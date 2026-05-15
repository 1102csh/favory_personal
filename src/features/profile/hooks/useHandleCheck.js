// src/features/profile/hooks/useHandleCheck.js
import { useEffect, useState } from 'react';
import { profileEditService } from '../services/profileEditService';
import { useAuth } from '@/app/providers/AuthProvider';

const HANDLE_REGEX = /^[a-z0-9_.]{3,20}$/;
const DEBOUNCE_MS = 400;

/**
 * Handle 입력값 실시간 중복 검사.
 *
 * 본인이 이미 사용 중인 handle은 사용 가능으로 처리 (편집 시 자기 handle 그대로 두는 경우).
 *
 * @param {string} handle
 * @returns {{
 *   status: 'idle'|'checking'|'invalid'|'available'|'taken'|'error',
 *   message: string,
 * }}
 */
export const useHandleCheck = (handle) => {
  const { user, profile } = useAuth();
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const trimmed = handle?.trim().toLowerCase() ?? '';

    // 빈 값
    if (!trimmed) {
      setStatus('idle');
      setMessage('');
      return;
    }

    // 본인이 현재 쓰는 handle 그대로면 사용 가능 (변경 없음)
    if (profile?.handle === trimmed) {
      setStatus('available');
      setMessage('현재 사용 중인 핸들이에요');
      return;
    }

    // 포맷 검증
    if (!HANDLE_REGEX.test(trimmed)) {
      setStatus('invalid');
      setMessage('영문 소문자, 숫자, _, . 만 사용 가능 (3~20자)');
      return;
    }

    // 디바운스 후 중복 체크
    setStatus('checking');
    setMessage('확인 중...');

    const timeoutId = setTimeout(async () => {
      try {
        const { available } = await profileEditService.checkHandleAvailable(
          trimmed,
          user?.id ?? ''
        );
        if (available) {
          setStatus('available');
          setMessage('사용 가능한 핸들이에요');
        } else {
          setStatus('taken');
          setMessage('이미 사용 중인 핸들이에요');
        }
      } catch (e) {
        setStatus('error');
        setMessage(e.message ?? '확인 중 오류가 발생했어요');
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [handle, user?.id, profile?.handle]);

  return { status, message };
};