// src/features/auth/hooks/useSignUp.js
import { useState } from 'react';
import { authService } from '../services/authService';
import { AuthError } from '@/shared/lib/errors/AuthError';
import { AUTH_MESSAGES } from '../constants/authConstants';

/**
 * 회원가입 제출 훅.
 * 폼 검증(zod)은 RHF에서 처리하고, 비동기 부가검증(닉네임 중복/전화번호 인증)
 * 결과를 받아 최종 제출만 담당합니다.
 */
export const useSignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  /**
   * @param {{
   *   email: string,
   *   password: string,
   *   nickname: string,
   *   phone: string,
   *   phoneVerified: boolean,
   *   agreements: { terms: boolean, privacy: boolean, age: boolean, marketing?: boolean }
   * }} input
   * @returns {Promise<{ success: boolean, userId?: string, needsEmailConfirm?: boolean }>}
   */
  const submit = async (input) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await authService.signUp(input);
      return { success: true, ...result };
    } catch (err) {
      const error =
        err instanceof AuthError
          ? err
          : new AuthError('UNKNOWN', AUTH_MESSAGES.generic.unknown, err);
      setSubmitError(error);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, submitError };
};