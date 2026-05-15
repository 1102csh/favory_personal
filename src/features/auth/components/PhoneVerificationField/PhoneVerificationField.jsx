// src/features/auth/components/PhoneVerificationField/PhoneVerificationField.jsx
import { forwardRef, useState } from 'react';
import Input from '@/shared/ui/Input/Input';
import Button from '@/shared/ui/Button/Button';
import { formatPhone } from '@/shared/lib/validators/phoneFormatter';
import { AUTH_RULES } from '../../constants/authConstants';
import styles from './PhoneVerificationField.module.scss';

const formatRemaining = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

/**
 * 전화번호 입력 + 인증번호 발송/검증 필드.
 *
 * @param {object} props
 * @param {string} props.phone                                - RHF에서 watch한 phone 값
 * @param {string} [props.phoneError]                         - RHF가 던진 phone 형식 에러
 * @param {object} props.phoneRegister                        - register('phone') 결과
 * @param {ReturnType<typeof usePhoneVerification>} props.verification - 부모에서 주입한 훅 결과
 */
const PhoneVerificationField = forwardRef(
  ({ phone, phoneError, phoneRegister, verification }, ref) => {
    const [otp, setOtp] = useState('');
    const {
      step,
      message,
      remainingSec,
      isSending,
      isVerifying,
      isVerified,
      canEnterCode,
      sendCode,
      verifyCode,
    } = verification;

    const phoneInvalid = !phone || !AUTH_RULES.phone.regex.test(phone);
    const sendDisabled = phoneInvalid || isSending || isVerified;

    const handleSend = async () => {
      if (sendDisabled) return;
      await sendCode(phone);
      setOtp('');
    };

    const handleVerify = async () => {
      if (!otp || isVerifying) return;
      await verifyCode(otp, phone);
    };

    // 메시지 색 분기 (error / success / info)
    const messageTone =
      step === 'verified' ? 'success'
      : step === 'expired' || step === 'error' || (step === 'sent' && /일치하지/.test(message)) ? 'error'
      : 'info';

    return (
      <div className={styles.wrapper}>
        {/* 전화번호 입력 + 인증번호 받기 버튼 */}
        <Input
          ref={ref}
          label="휴대폰 번호"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="010-1234-5678"
          error={phoneError}
          disabled={isVerified}
          {...phoneRegister}
          rightSlot={
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSend}
              disabled={sendDisabled}
              loading={isSending}
            >
              {isVerified ? '인증완료' : step === 'sent' || step === 'expired' ? '재전송' : '인증요청'}
            </Button>
          }
        />

        {/* 인증번호 입력 (인증 시작 후에만 노출) */}
        {(canEnterCode || step === 'verified' || step === 'expired') && (
          <div className={styles.otpRow}>
            <Input
              label="인증번호"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={AUTH_RULES.otp.length}
              placeholder="6자리 숫자"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              disabled={isVerified || step === 'expired'}
              rightSlot={
                !isVerified && remainingSec > 0 ? (
                  <span className={styles.timer} aria-live="off">
                    {formatRemaining(remainingSec)}
                  </span>
                ) : null
              }
            />
            <Button
              variant="primary"
              size="md"
              onClick={handleVerify}
              loading={isVerifying}
              disabled={isVerified || step === 'expired' || otp.length !== AUTH_RULES.otp.length}
            >
              확인
            </Button>
          </div>
        )}

        {/* 상태 메시지 */}
        {message && (
          <p className={styles.message} data-tone={messageTone} role="status" aria-live="polite">
            {message}
          </p>
        )}
      </div>
    );
  }
);

PhoneVerificationField.displayName = 'PhoneVerificationField';
export default PhoneVerificationField;