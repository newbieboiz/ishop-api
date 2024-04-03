import { packRules } from '@casl/ability/extra';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

import { TokenService } from '@/app/users/services/token.service';
import { messages } from '@/common/constants';
import { BadRequestException, ForbiddenException, NotFoundException } from '@/common/exceptions';
import configEnv from '@/config';
import { JwtService } from '@/lib/auth/jwt.service';
import { definePermissionsFor } from '@/lib/auth/permissions';
import { EmailService } from '@/lib/email';

import {
  EmailVerifyPayload,
  ForgotPasswordPayload,
  PasswordResetPayload,
  SignInPayload,
  SignUpPayload,
} from '../schemas';
import { UserService } from './user.service';

export class AuthService {
  private userService = new UserService();
  private jwtService = new JwtService();
  private tokenService = new TokenService();
  private emailService = new EmailService();

  public signIn = async ({ email, password, code }: SignInPayload) => {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException(messages.INVALID_CREDENTIALS);
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new BadRequestException(messages.INVALID_CREDENTIALS);
    }

    if (!user.emailVerified) {
      this.sendVerificationEmail(user.email);

      throw new ForbiddenException(messages.PENDING_VERIFICATION);
    }

    if (user.isTwoFactorEnabled) {
      if (code) {
        const twoFactorToken = await this.tokenService.getTwoFactorTokenByEmail(user.email);

        if (!twoFactorToken) {
          throw new BadRequestException(messages.INVALID_CODE);
        }

        if (twoFactorToken.token !== code) {
          throw new BadRequestException(messages.INVALID_CODE);
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if (hasExpired) {
          throw new BadRequestException(messages.EXPIRED_CODE);
        }

        await this.tokenService.deleteTwoFactorToken(twoFactorToken.id);

        const existingConfirmation = await this.tokenService.getTwoFactorConfirmationByUserId(user.id);
        if (existingConfirmation) {
          await this.tokenService.deleteTwoFactorConfirmation(existingConfirmation.id);
        }

        await this.tokenService.generateTwoFactorConfirmation(user.id);
      } else {
        const twoFactorToken = await this.tokenService.generateTwoFactorToken(user.email);
        await this.emailService.sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

        return { twoFactor: true };
      }
    }

    const expiresIn = configEnv.get('token.accessToken.expiresIn');
    const csrfToken = uuid();
    const jwtPayload: JwtPayload = {
      id: user.id,
      email: user.email,
      csrf_token: csrfToken,
      permissions: packRules(definePermissionsFor(user)),
    };
    const accessToken = this.jwtService.create(jwtPayload, expiresIn);
    const signInResponse = {
      csrf_token: csrfToken,
      access_token: accessToken,
      expiresIn: expiresIn,
      userId: user.id,
      role: null,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    };

    return signInResponse;
  };

  private sendVerificationEmail = async (email: string) => {
    const verificationToken = await this.tokenService.generateVerificationToken(email);
    return this.emailService.sendVerificationEmail(email, verificationToken.token);
  };

  public signUp = async (signUpPayload: Omit<SignUpPayload, 'confirmPassword'>) => {
    const user = await this.userService.findByEmail(signUpPayload.email);

    if (user) {
      throw new BadRequestException('Email has already taken');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(signUpPayload.password, salt);
    await this.userService.create({
      ...signUpPayload,
      password: hashedPassword,
    });

    this.sendVerificationEmail(signUpPayload.email);
  };

  public verifyEmail = async (payload: EmailVerifyPayload) => {
    const { token } = payload;

    if (!token) {
      throw new BadRequestException('Missing token!');
    }

    const existingToken = await this.tokenService.getVerificationTokenByToken(token);
    if (!existingToken) {
      throw new BadRequestException('Token does not exist!');
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      throw new BadRequestException('Token has expired!');
    }

    const existingUser = await this.userService.findByEmail(existingToken.email);
    if (!existingUser) {
      throw new NotFoundException('Email does not exist!');
    }

    await this.userService.update(existingUser.id, {
      emailVerified: new Date(),
      email: existingToken.email,
    });

    await this.tokenService.deleteVerificationToken(existingToken.id);

    return 'Verified';
  };

  public forgotPassword = async (payload: ForgotPasswordPayload) => {
    const { email } = payload;

    const existingUser = await this.userService.findByEmail(email);
    if (!existingUser) {
      throw new NotFoundException('Email does not exist!');
    }

    const passwordResetToken = await this.tokenService.generatePasswordResetToken(email);
    await this.emailService.sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return 'Email sent!';
  };

  public resetPassword = async (payload: PasswordResetPayload) => {
    const { token, password } = payload;

    const existingToken = await this.tokenService.getPasswordResetTokenByToken(token);
    if (!existingToken) {
      throw new BadRequestException('Invalid token!');
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      throw new BadRequestException('Token has expired!');
    }

    const existingUser = await this.userService.findByEmail(existingToken.email);
    if (!existingUser) {
      throw new NotFoundException('Email does not exist!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.update(existingUser.id, {
      password: hashedPassword,
    });
    await this.tokenService.deleteResetPasswordToken(existingToken.id);

    return 'Password updated!';
  };
}
