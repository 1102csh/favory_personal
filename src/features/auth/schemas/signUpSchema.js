// src/features/auth/schemas/signUpSchema.js
import { z } from 'zod';
import { AUTH_RULES, AUTH_MESSAGES } from '../constants/authConstants';

/**
 * 회원가입 폼 스키마.
 * react-hook-form의 zodResolver와 함께 사용됩니다.
 *
 * 주의: 닉네임 중복검사, 전화번호 인증 여부는 비동기 검사이므로
 *       이 스키마가 아닌 useSignUp 훅 레벨에서 별도 검증합니다.
 *       (zod의 refine async도 가능하지만 UX 제어가 어려움)
 */
export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, AUTH_MESSAGES.email.required)
      .email(AUTH_MESSAGES.email.invalid),

    password: z
      .string()
      .min(1, AUTH_MESSAGES.password.required)
      .min(AUTH_RULES.password.minLength, AUTH_MESSAGES.password.invalid)
      .max(AUTH_RULES.password.maxLength, AUTH_MESSAGES.password.invalid)
      .regex(AUTH_RULES.password.regex, AUTH_MESSAGES.password.invalid),

    passwordConfirm: z.string().min(1, AUTH_MESSAGES.password.required),

    nickname: z
      .string()
      .min(1, AUTH_MESSAGES.nickname.required)
      .min(AUTH_RULES.nickname.minLength, AUTH_MESSAGES.nickname.invalid)
      .max(AUTH_RULES.nickname.maxLength, AUTH_MESSAGES.nickname.invalid)
      .regex(AUTH_RULES.nickname.regex, AUTH_MESSAGES.nickname.invalid),

    phone: z
      .string()
      .min(1, AUTH_MESSAGES.phone.required)
      .regex(AUTH_RULES.phone.regex, AUTH_MESSAGES.phone.invalid),

    agreedTerms: z.literal(true, {
      errorMap: () => ({ message: AUTH_MESSAGES.agreement.terms }),
    }),
    agreedPrivacy: z.literal(true, {
      errorMap: () => ({ message: AUTH_MESSAGES.agreement.privacy }),
    }),
    agreedAge: z.literal(true, {
      errorMap: () => ({ message: AUTH_MESSAGES.agreement.age }),
    }),
    agreedMarketing: z.boolean().optional(), // 선택 동의
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: AUTH_MESSAGES.password.mismatch,
  });

/** @typedef {import('zod').infer<typeof signUpSchema>} SignUpFormValues */