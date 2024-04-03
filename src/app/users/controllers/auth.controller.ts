import { NextFunction, Request, Response, Router } from 'express';

import { HttpStatusCodes } from '@/common/constants';
import { payloadValidator } from '@/lib/validator/payload-validator';

import {
  EmailVerifyPayload,
  EmailVerifySchema,
  ForgotPasswordPayload,
  ForgotPasswordPayloadSchema,
  PasswordResetPayload,
  PasswordResetSchema,
  SignInPayload,
  SignInPayloadSchema,
  SignUpPayload,
  SignUpPayloadSchema,
} from '../schemas';
import { AuthService } from '../services/auth.service';

export class AuthController {
  public path = '/auth';
  public router = Router();
  private authService = new AuthService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`${this.path}/sign-in`, payloadValidator(SignInPayloadSchema), this.signIn);
    this.router.post(`${this.path}/sign-up`, payloadValidator(SignUpPayloadSchema), this.signUp);
    this.router.post(`${this.path}/verify-email`, payloadValidator(EmailVerifySchema), this.verifyEmail);
    this.router.post(
      `${this.path}/forgot-password`,
      payloadValidator(ForgotPasswordPayloadSchema),
      this.forgotPassword,
    );
    this.router.put(`${this.path}/reset-password`, payloadValidator(PasswordResetSchema), this.resetPassword);
  }

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    const payload: SignInPayload = {
      email: req.body.email,
      password: req.body.password,
    };

    try {
      const signInResponse = await this.authService.signIn(payload);

      if ('twoFactor' in signInResponse) {
        res.status(HttpStatusCodes.OK).send(signInResponse);
        return;
      }

      res.setHeader(
        'Set-Cookie',
        `access_token=${signInResponse.access_token}; Path=/; SameSite=Lax; HttpOnly; Max-Age=${signInResponse.expiresIn}`,
      );
      res.setHeader('X-CSRF-Token', signInResponse.csrf_token);
      res.status(HttpStatusCodes.OK).send(signInResponse);
    } catch (error) {
      next(error);
    }
  };

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const payload: Omit<SignUpPayload, 'confirmPassword'> = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    };

    try {
      await this.authService.signUp(payload);
      res.status(HttpStatusCodes.CREATED).send('Sign up successfully! Please check your email.');
    } catch (error) {
      next(error);
    }
  };

  public verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const payload: EmailVerifyPayload = {
      token: String(req.query.token),
    };
    try {
      await this.authService.verifyEmail(payload);
      res.status(HttpStatusCodes.OK).send('Verify email successfully!');
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const payload: ForgotPasswordPayload = {
      email: req.body.email,
    };

    try {
      await this.authService.forgotPassword(payload);
      res.status(HttpStatusCodes.OK).send('Email reset sent!');
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const payload: PasswordResetPayload = {
      token: req.body.token,
      password: req.body.password,
    };

    try {
      await this.authService.resetPassword(payload);
      res.status(HttpStatusCodes.OK).send('Reset password successfully!');
    } catch (error) {
      next(error);
    }
  };
}
