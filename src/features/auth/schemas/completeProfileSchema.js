// src/features/auth/schemas/completeProfileSchema.js
import { z } from 'zod';
import { AUTH_RULES, AUTH_MESSAGES } from '../constants/authConstants';

export const completeProfileSchema = z.object({
  nickname: z.string()
    .min(1, AUTH_MESSAGES.nickname.required)
    .min(AUTH_RULES.nickname.minLength, AUTH_MESSAGES.nickname.invalid)
    .max(AUTH_RULES.nickname.maxLength, AUTH_MESSAGES.nickname.invalid)
    .regex(AUTH_RULES.nickname.regex, AUTH_MESSAGES.nickname.invalid),

  phone: z.string()
    .min(1, AUTH_MESSAGES.phone.required)
    .regex(AUTH_RULES.phone.regex, AUTH_MESSAGES.phone.invalid),

  agreedTerms: z.literal(true, { errorMap: () => ({ message: AUTH_MESSAGES.agreement.terms }) }),
  agreedPrivacy: z.literal(true, { errorMap: () => ({ message: AUTH_MESSAGES.agreement.privacy }) }),
  agreedAge: z.literal(true, { errorMap: () => ({ message: AUTH_MESSAGES.agreement.age }) }),
  agreedMarketing: z.boolean().optional(),
});