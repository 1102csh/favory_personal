// src/features/auth/hooks/useLogin.js
import { useState } from 'react';
import { authService } from '../services/authService';
import { AuthError } from '@/shared/lib/errors/AuthError';
import { AUTH_MESSAGES } from '../constants/authConstants';

export const useLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const submit = async ({ email, password }) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const data = await authService.signIn({ email, password });
      return { success: true, session: data.session };
    } catch (err) {
      const error = err instanceof AuthError
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