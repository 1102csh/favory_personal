// src/features/auth/components/PasswordField/PasswordField.jsx
import { forwardRef, useState } from 'react';
import Input from '@/shared/ui/Input/Input';
import { evaluatePasswordStrength } from '@/shared/lib/validators/passwordStrength';
import { PASSWORD_STRENGTH } from '../../constants/authConstants';
import styles from './PasswordField.module.scss';

const STRENGTH_LABEL = {
  [PASSWORD_STRENGTH.WEAK]:   '약함',
  [PASSWORD_STRENGTH.MEDIUM]: '보통',
  [PASSWORD_STRENGTH.STRONG]: '강함',
};

/**
 * 비밀번호 입력 필드.
 *
 * 사용법 (react-hook-form):
 *   const password = watch('password');
 *   <PasswordField
 *     {...register('password')}        // RHF가 비제어로 관리
 *     showStrength
 *     strengthValue={password}         // 강도 미터 계산용 (input value와 분리)
 *     error={errors.password?.message}
 *   />
 *
 * ⚠️ 중요: input은 RHF의 비제어 모드로 동작합니다.
 *   value/defaultValue 전달 금지. 강도 미터용 값은 strengthValue로 별도 전달.
 */
const PasswordField = forwardRef(
  ({ showStrength = false, strengthValue = '', error, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);
    const { level, score } = evaluatePasswordStrength(strengthValue);

    return (
      <div className={styles.wrapper}>
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          autoComplete={rest.autoComplete ?? 'new-password'}
          error={error}
          rightSlot={
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? '비밀번호 숨기기' : '비밀번호 표시'}
              aria-pressed={visible}
            >
              {visible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
          {...rest}
        />

        {showStrength && strengthValue && !error && (
          <div className={styles.strength} aria-live="polite">
            <div
              className={styles.bar}
              data-level={level}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={4}
              aria-valuenow={score}
            >
              <span style={{ width: `${(score / 4) * 100}%` }} />
            </div>
            <span className={styles.label} data-level={level}>
              {STRENGTH_LABEL[level]}
            </span>
          </div>
        )}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
export default PasswordField;

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17.94 17.94A10.5 10.5 0 0 1 12 19c-7 0-10-7-10-7a18.5 18.5 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.6 9.6 0 0 1 12 4c7 0 10 7 10 7a18.4 18.4 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);