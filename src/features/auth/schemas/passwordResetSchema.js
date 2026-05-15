// src/features/auth/schemas/passwordResetSchema.js
import { z } from 'zod';
import { AUTH_RULES, AUTH_MESSAGES } from '../constants/authConstants';

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, AUTH_MESSAGES.email.required)
    .email(AUTH_MESSAGES.email.invalid),
});

export const resetPasswordSchema = z
  .object({
    password: z.string()
      .min(1, AUTH_MESSAGES.password.required)
      .min(AUTH_RULES.password.minLength, AUTH_MESSAGES.password.invalid)
      .max(AUTH_RULES.password.maxLength, AUTH_MESSAGES.password.invalid)
      .regex(AUTH_RULES.password.regex, AUTH_MESSAGES.password.invalid),
    passwordConfirm: z.string().min(1, AUTH_MESSAGES.password.required),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    path: ['passwordConfirm'],
    message: AUTH_MESSAGES.password.mismatch,
  });