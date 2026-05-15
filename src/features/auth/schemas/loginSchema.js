// src/features/auth/schemas/loginSchema.js
import { z } from 'zod';
import { AUTH_MESSAGES } from '../constants/authConstants';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, AUTH_MESSAGES.email.required)
    .email(AUTH_MESSAGES.email.invalid),
  password: z.string().min(1, AUTH_MESSAGES.password.required),
});

/** @typedef {import('zod').infer<typeof loginSchema>} LoginFormValues */