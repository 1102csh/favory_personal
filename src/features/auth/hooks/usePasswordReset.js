// src/features/auth/hooks/usePasswordReset.js
import { useState } from 'react';
import { authService } from '../services/authService';
import { AuthError } from '@/shared/lib/errors/AuthError';
import { AUTH_MESSAGES } from '../constants/authConstants';

export const usePasswordReset = () => {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState(null);

  const sendResetEmail = async (email) => {
    setStatus('sending');
    setError(null);
    try {
      await authService.sendPasswordReset(email);
      setStatus('sent');
      return true;
    } catch (err) {
      const e = err instanceof AuthError
        ? err
        : new AuthError('UNKNOWN', AUTH_MESSAGES.generic.unknown, err);
      setError(e);
      setStatus('error');
      return false;
    }
  };

  const updatePassword = async (newPassword) => {
    setStatus('sending');
    setError(null);
    try {
      await authService.updatePassword(newPassword);
      setStatus('sent');
      return true;
    } catch (err) {
      const e = err instanceof AuthError
        ? err
        : new AuthError('UNKNOWN', AUTH_MESSAGES.generic.unknown, err);
      setError(e);
      setStatus('error');
      return false;
    }
  };

  return {
    status,
    error,
    isSending: status === 'sending',
    isDone: status === 'sent',
    sendResetEmail,
    updatePassword,
  };
};