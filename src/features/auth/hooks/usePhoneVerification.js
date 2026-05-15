// src/features/auth/hooks/usePhoneVerification.js
import { useCallback, useEffect, useRef, useState } from 'react';
import { phoneVerificationService } from '../services/phoneVerificationService';
import { AUTH_MESSAGES, AUTH_RULES } from '../constants/authConstants';

/**
 * 전화번호 인증 훅.
 *
 * 단계:
 *   idle     - 인증 시작 전
 *   sending  - SMS 발송 중
 *   sent     - 인증번호 입력 대기 (타이머 작동)
 *   verifying- 코드 검증 중
 *   verified - 인증 완료
 *   expired  - 만료됨 (재요청 필요)
 *   error    - 에러
 */
export const usePhoneVerification = () => {
  const [step, setStep] = useState('idle');
  const [message, setMessage] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [remainingSec, setRemainingSec] = useState(0);

  const requestIdRef = useRef(null);
  const timerRef = useRef(null);

  // 타이머 정리
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const startTimer = useCallback(
    (expiresAt) => {
      clearTimer();
      const tick = () => {
        const sec = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
        setRemainingSec(sec);
        if (sec <= 0) {
          clearTimer();
          setStep('expired');
          setMessage(AUTH_MESSAGES.otp.expired);
        }
      };
      tick();
      timerRef.current = setInterval(tick, 1000);
    },
    [clearTimer]
  );

  const reset = useCallback(() => {
    clearTimer();
    requestIdRef.current = null;
    setStep('idle');
    setMessage('');
    setVerifiedPhone('');
    setRemainingSec(0);
  }, [clearTimer]);

  /**
   * 인증번호 발송 요청.
   * @param {string} phone - 형식 무관, 서비스 내부에서 정규화됨
   */
  const sendCode = useCallback(async (phone) => {
    if (!phone || !AUTH_RULES.phone.regex.test(phone)) {
      setStep('error');
      setMessage(AUTH_MESSAGES.phone.invalid);
      return false;
    }

    setStep('sending');
    setMessage('');

    try {
      const { requestId, expiresAt } = await phoneVerificationService.requestCode(phone);
      requestIdRef.current = requestId;
      setStep('sent');
      setMessage('인증번호가 발송되었습니다.');
      startTimer(expiresAt);
      return true;
    } catch {
      setStep('error');
      setMessage(AUTH_MESSAGES.generic.network);
      return false;
    }
  }, [startTimer]);

  /**
   * 인증번호 검증.
   * @param {string} code - 6자리 OTP
   * @param {string} phone - 검증 성공 시 verifiedPhone에 저장할 값
   */
  const verifyCode = useCallback(async (code, phone) => {
    if (!requestIdRef.current) {
      setStep('error');
      setMessage('먼저 인증번호를 요청해주세요.');
      return false;
    }
    if (!code || code.length !== AUTH_RULES.otp.length) {
      setMessage(AUTH_MESSAGES.otp.required);
      return false;
    }

    setStep('verifying');
    try {
      const { verified, reason } = await phoneVerificationService.verifyCode(
        requestIdRef.current,
        code
      );
      if (verified) {
        clearTimer();
        setStep('verified');
        setMessage('휴대폰 인증이 완료되었습니다.');
        setVerifiedPhone(phone);
        return true;
      }
      setStep('sent'); // 다시 입력 가능 상태로
      setMessage(
        reason === 'expired' ? AUTH_MESSAGES.otp.expired : AUTH_MESSAGES.otp.invalid
      );
      return false;
    } catch {
      setStep('error');
      setMessage(AUTH_MESSAGES.generic.network);
      return false;
    }
  }, [clearTimer]);

  return {
    step,
    message,
    remainingSec,
    verifiedPhone,
    isSending: step === 'sending',
    isVerifying: step === 'verifying',
    isVerified: step === 'verified',
    canEnterCode: step === 'sent' || step === 'verifying',
    sendCode,
    verifyCode,
    reset,
  };
};