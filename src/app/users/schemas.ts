import z from 'zod';

import { messages, regexp } from '@/common/constants';

export const SignInPayloadSchema = z.object({
  email: z.string({ required_error: messages.REQUIRED_EMAIL }).email(messages.INVALID_EMAIL),
  password: z.string({ required_error: messages.REQUIRED_PASSWORD }),
  code: z.string().optional(),
});
export type SignInPayload = z.infer<typeof SignInPayloadSchema>;

export const SignUpPayloadSchema = z
  .object({
    email: z.string({ required_error: messages.REQUIRED_EMAIL }).email(messages.INVALID_EMAIL),
    username: z.string({ required_error: messages.REQUIRED_USERNAME }),
    password: z
      .string({ required_error: messages.REQUIRED_PASSWORD })
      .regex(regexp.PASSWORD, messages.INVALID_PASSWORD),
    confirmPassword: z.string({
      required_error: messages.REQUIRED_CONFIRM_PASSWORD,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: messages.INVALID_CONFIRM_PASSWORD,
    path: ['confirmPassword'],
  });
export type SignUpPayload = z.infer<typeof SignUpPayloadSchema>;

export const ForgotPasswordPayloadSchema = z.object({
  email: z.string({ required_error: messages.REQUIRED_EMAIL }).email(messages.INVALID_EMAIL),
});
export type ForgotPasswordPayload = z.infer<typeof ForgotPasswordPayloadSchema>;

export const PasswordResetSchema = z.object({
  token: z.string({ required_error: messages.REQUIRED_TOKEN }),
  password: z.string({ required_error: messages.REQUIRED_PASSWORD }).regex(regexp.PASSWORD, messages.INVALID_PASSWORD),
});
export type PasswordResetPayload = z.infer<typeof PasswordResetSchema>;

export const EmailVerifySchema = z.object({
  token: z.string({ required_error: messages.REQUIRED_TOKEN }),
});
export type EmailVerifyPayload = z.infer<typeof EmailVerifySchema>;
