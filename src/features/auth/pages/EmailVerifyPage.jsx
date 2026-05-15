// src/features/auth/pages/EmailVerifyPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/shared/ui/AuthLayout/AuthLayout';
import Button from '@/shared/ui/Button/Button';
import Alert from '@/shared/ui/Alert/Alert';
import { authService } from '../services/authService';
import styles from './EmailVerifyPage.module.scss';

/**
 * 이메일 인증 안내 페이지.
 * 가입 직후 세션이 없는 상태에서도 접근 가능.
 *
 * 향후 보강:
 * - URL query에서 가입 시 입력한 이메일 받아 표시
 * - 인증 메일 재발송 (Supabase: resend)
 * - 메일 클릭 후 돌아오는 처리 (이건 AuthCallbackPage가 담당)
 */
const EmailVerifyPage = () => {
  const [resendStatus, setResendStatus] = useState('idle');
  const [resendError, setResendError] = useState(null);

  // 사용자 이메일 입력으로 재발송 (간단 구현; 추후 가입 시 이메일을 sessionStorage에 저장해 자동 채우는 방식 권장)
  const [email, setEmail] = useState('');

  const handleResend = async () => {
    if (!email) return;
    setResendStatus('sending');
    setResendError(null);
    try {
      // 비밀번호 재설정 메일과 별도로 인증 재발송이 필요하면
      // authRepository에 별도 함수 추가 필요. 지금은 안내만.
      await authService.sendPasswordReset(email); // placeholder
      setResendStatus('done');
    } catch (e) {
      setResendStatus('error');
      setResendError(e?.message ?? '재발송에 실패했습니다.');
    }
  };

  return (
    <AuthLayout
      title="이메일을 확인해주세요"
      subtitle="가입하신 이메일로 인증 링크를 보내드렸습니다."
      footer={
        <Link to="/login" className={styles.link}>로그인 페이지로</Link>
      }
    >
      <div className={styles.body}>
        <Alert tone="info">
          메일이 도착하지 않았다면 스팸함을 확인하시거나, 잠시 후 다시 시도해주세요.
          링크는 24시간 동안 유효합니다.
        </Alert>

        <ol className={styles.steps}>
          <li>받은 메일함에서 인증 메일을 엽니다.</li>
          <li>메일 안의 <strong>인증 링크</strong>를 클릭합니다.</li>
          <li>자동으로 로그인되어 서비스 이용이 가능합니다.</li>
        </ol>

        {resendStatus === 'done' && (
          <Alert tone="success">인증 메일이 다시 발송되었습니다.</Alert>
        )}
        {resendStatus === 'error' && resendError && (
          <Alert tone="danger">{resendError}</Alert>
        )}
      </div>
    </AuthLayout>
  );
};

export default EmailVerifyPage;