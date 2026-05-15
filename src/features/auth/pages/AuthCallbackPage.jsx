// src/features/auth/pages/AuthCallbackPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { status } = useAuth();

  useEffect(() => {
    // AuthProvider가 detectSessionInUrl로 자동 처리하므로
    // status가 결정되는 즉시 라우팅
    if (status === 'authenticated') navigate('/', { replace: true });
    else if (status === 'unauthenticated') navigate('/login', { replace: true });
  }, [status, navigate]);

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-secondary)',
      }}
      aria-live="polite"
    >
      인증 처리 중입니다...
    </div>
  );
};

export default AuthCallbackPage;