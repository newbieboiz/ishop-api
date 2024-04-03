import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import configEnv from '@/config';
import db from '@/lib/database';

export class TokenService {
  public getVerificationTokenByToken = async (token: string) => {
    try {
      const verificationToken = await db.verificationToken.findFirst({
        where: { token },
      });

      return verificationToken;
    } catch {
      return null;
    }
  };

  private getVerificationTokenByEmail = async (email: string) => {
    try {
      const verificationToken = await db.verificationToken.findFirst({
        where: { email },
      });

      return verificationToken;
    } catch {
      return null;
    }
  };

  public generateVerificationToken = async (email: string) => {
    const existingToken = await this.getVerificationTokenByEmail(email);
    if (existingToken) {
      await db.verificationToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const token = uuidv4();
    const expires = new Date(new Date().getTime() + configEnv.get('token.verificationToken.expiresIn') * 1000);
    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return verificationToken;
  };

  public deleteVerificationToken = async (id: string) => {
    return await db.verificationToken.delete({
      where: { id },
    });
  };

  public getPasswordResetTokenByToken = async (token: string) => {
    try {
      const passwordResetToken = await db.passwordResetToken.findUnique({
        where: { token },
      });

      return passwordResetToken;
    } catch {
      return null;
    }
  };

  public getPasswordResetTokenByEmail = async (email: string) => {
    try {
      const passwordResetToken = await db.passwordResetToken.findFirst({
        where: { email },
      });

      return passwordResetToken;
    } catch {
      return null;
    }
  };

  public generatePasswordResetToken = async (email: string) => {
    const existingToken = await this.getPasswordResetTokenByEmail(email);
    if (existingToken) {
      await db.passwordResetToken.delete({
        where: { id: existingToken.id },
      });
    }

    const token = uuidv4();
    const expires = new Date(new Date().getTime() + configEnv.get('token.passwordResetToken.expiresIn') * 1000);
    const passwordResetToken = await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return passwordResetToken;
  };

  public deleteResetPasswordToken = async (id: string) => {
    return await db.passwordResetToken.delete({
      where: { id },
    });
  };

  public generateTwoFactorConfirmation = async (userId: string) => {
    try {
      const twoFactorConfirmation = await db.twoFactorConfirmation.create({
        data: {
          userId,
        },
      });

      return twoFactorConfirmation;
    } catch {
      return null;
    }
  };

  public getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
      const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
        where: { userId },
      });

      return twoFactorConfirmation;
    } catch {
      return null;
    }
  };

  public deleteTwoFactorConfirmation = async (id: string) => {
    return await db.twoFactorConfirmation.delete({
      where: { id },
    });
  };

  public getTwoFactorTokenByToken = async (token: string) => {
    try {
      const twoFactorToken = await db.twoFactorToken.findUnique({
        where: { token },
      });

      return twoFactorToken;
    } catch {
      return null;
    }
  };

  public getTwoFactorTokenByEmail = async (email: string) => {
    try {
      const twoFactorToken = await db.twoFactorToken.findFirst({
        where: { email },
      });

      return twoFactorToken;
    } catch {
      return null;
    }
  };

  public generateTwoFactorToken = async (email: string) => {
    const existingToken = await this.getTwoFactorTokenByEmail(email);
    if (existingToken) {
      await db.twoFactorToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + configEnv.get('token.twoFactorToken.expiresIn') * 1000);
    const twoFactorToken = await db.twoFactorToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return twoFactorToken;
  };

  public deleteTwoFactorToken = async (id: string) => {
    return await db.twoFactorToken.delete({
      where: { id },
    });
  };
}
