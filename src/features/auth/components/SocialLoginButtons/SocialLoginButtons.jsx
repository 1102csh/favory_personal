// src/features/auth/components/SocialLoginButtons/SocialLoginButtons.jsx
import { useState } from 'react';
import { authService } from '../../services/authService';
import { AuthError } from '@/shared/lib/errors/AuthError';
import Alert from '@/shared/ui/Alert/Alert';
import styles from './SocialLoginButtons.module.scss';

const PROVIDERS = [
  { id: 'google', label: 'Google로 계속하기', supported: true },
  { id: 'kakao',  label: '카카오로 계속하기',  supported: true },
  { id: 'naver',  label: '네이버로 계속하기',  supported: false }, // 추후 구현
];

const SocialLoginButtons = () => {
  const [pending, setPending] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = async (providerId) => {
    setError(null);

    if (providerId === 'naver') {
      setError('네이버 로그인은 준비 중입니다. 곧 지원될 예정입니다.');
      return;
    }

    try {
      setPending(providerId);
      await authService.signInWithSocial(providerId);
      // signInWithOAuth는 리다이렉트를 유발하므로 일반적으로 이 라인 도달 X
    } catch (err) {
      const message = err instanceof AuthError
        ? err.message
        : '소셜 로그인 중 오류가 발생했습니다.';
      setError(message);
      setPending(null);
    }
  };

  return (
    <div className={styles.wrapper}>
      {error && <Alert tone="danger">{error}</Alert>}

      <div className={styles.buttons}>
        {PROVIDERS.map((p) => (
          <SocialButton
            key={p.id}
            providerId={p.id}
            label={p.label}
            disabled={!!pending && pending !== p.id}
            loading={pending === p.id}
            comingSoon={!p.supported}
            onClick={() => handleClick(p.id)}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * 개별 소셜 버튼.
 * 각 브랜드 컬러는 SCSS의 data-provider 셀렉터로 분기.
 */
const SocialButton = ({ providerId, label, loading, disabled, comingSoon, onClick }) => (
  <button
    type="button"
    className={styles.button}
    data-provider={providerId}
    onClick={onClick}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
  >
    <span className={styles.icon} aria-hidden>
      <ProviderIcon providerId={providerId} />
    </span>
    <span className={styles.label}>
      {loading ? '연결 중...' : label}
    </span>
    {comingSoon && <span className={styles.badge}>준비중</span>}
  </button>
);

const ProviderIcon = ({ providerId }) => {
  switch (providerId) {
    case 'google':
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.9c1.7-1.56 2.69-3.86 2.69-6.61z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86a5.32 5.32 0 0 1-5-3.68H.96v2.32A9 9 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M4 10.74a5.4 5.4 0 0 1 0-3.48V4.94H.96a9 9 0 0 0 0 8.12L4 10.74z"/>
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.94L4 7.26A5.32 5.32 0 0 1 9 3.58z"/>
        </svg>
      );
    case 'kakao':
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
          <path fill="#3C1E1E" d="M9 1.5C4.86 1.5 1.5 4.13 1.5 7.38c0 2.1 1.4 3.93 3.5 4.97-.15.55-.55 2.05-.63 2.37-.1.4.15.4.31.29.13-.09 2-1.36 2.8-1.91.5.07 1.01.11 1.52.11 4.14 0 7.5-2.63 7.5-5.83C16.5 4.13 13.14 1.5 9 1.5z"/>
        </svg>
      );
    case 'naver':
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
          <path fill="#fff" d="M10.46 9.27 7.36 4.5H4.5v9h3.04V8.73L10.65 13.5H13.5v-9h-3.04v4.77z"/>
        </svg>
      );
    default: return null;
  }
};

export default SocialLoginButtons;