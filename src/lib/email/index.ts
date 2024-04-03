import { Resend } from 'resend';

import configEnv from '@/config';

export class EmailService {
  private readonly apiKey = configEnv.get('resendAPIKey');
  private readonly domain = configEnv.get('appAdminURL');

  private readonly resend = new Resend(this.apiKey);

  public sendTwoFactorTokenEmail = async (email: string, token: string) => {
    return await this.resend.emails.send({
      from: 'noreply@resend.dev',
      to: email,
      subject: '2FA Code',
      html: `<p>Your 2FA code: ${token}</p>`,
    });
  };

  public sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${this.domain}/new-password?token=${token}`;

    return await this.resend.emails.send({
      from: 'noreply@resend.dev',
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    });
  };

  public sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${this.domain}/new-verification?token=${token}`;

    return await this.resend.emails.send({
      from: 'noreply@resend.dev',
      to: email,
      subject: 'Confirm your email',
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
  };
}
