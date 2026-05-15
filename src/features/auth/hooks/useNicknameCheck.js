// src/features/auth/hooks/useNicknameCheck.js
import { useCallback, useState } from 'react';
import { authService } from '../services/authService';
import { AUTH_RULES, AUTH_MESSAGES } from '../constants/authConstants';

/**
 * 닉네임 중복확인 훅.
 *
 * 상태 머신:
 *   idle      - 검사 안 함 (값이 바뀌면 이 상태로 리셋)
 *   checking  - 검사 중
 *   available - 사용 가능
 *   taken     - 중복
 *   invalid   - 형식 오류 (중복확인 자체 불가)
 *   error     - 네트워크 등 에러
 */
export const useNicknameCheck = () => {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  /** 마지막으로 확인 완료된 닉네임. 폼 제출 시 일치 여부 검증 가능. */
  const [verifiedNickname, setVerifiedNickname] = useState('');

  const reset = useCallback(() => {
    setStatus('idle');
    setMessage('');
    setVerifiedNickname('');
  }, []);

  const check = useCallback(async (nickname) => {
    const trimmed = nickname?.trim() ?? '';

    // 형식 검증 먼저 (서버 호출 낭비 방지)
    if (!trimmed) {
      setStatus('invalid');
      setMessage(AUTH_MESSAGES.nickname.required);
      return false;
    }
    if (
      trimmed.length < AUTH_RULES.nickname.minLength ||
      trimmed.length > AUTH_RULES.nickname.maxLength ||
      !AUTH_RULES.nickname.regex.test(trimmed)
    ) {
      setStatus('invalid');
      setMessage(AUTH_MESSAGES.nickname.invalid);
      return false;
    }

    setStatus('checking');
    setMessage('');

    try {
      const available = await authService.checkNicknameAvailability(trimmed);
      if (available) {
        setStatus('available');
        setMessage('사용 가능한 닉네임입니다.');
        setVerifiedNickname(trimmed);
        return true;
      }
      setStatus('taken');
      setMessage(AUTH_MESSAGES.nickname.duplicated);
      setVerifiedNickname('');
      return false;
    } catch {
      setStatus('error');
      setMessage(AUTH_MESSAGES.generic.network);
      setVerifiedNickname('');
      return false;
    }
  }, []);

  return {
    status,
    message,
    verifiedNickname,
    isAvailable: status === 'available',
    isChecking: status === 'checking',
    check,
    reset,
  };
};