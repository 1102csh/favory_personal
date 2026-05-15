// src/features/auth/pages/SignUpPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/shared/ui/AuthLayout/AuthLayout';
import SignUpForm from '../components/SignUpForm/SignUpForm';
import AgreementModal from '../components/AgreementModal/AgreementModal';
import styles from './SignUpPage.module.scss';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [openAgreement, setOpenAgreement] = useState(null);

  const handleSuccess = ({ needsEmailConfirm }) => {
    if (needsEmailConfirm) {
      navigate('/auth/verify-email', { replace: true });
    } else {
      // 이메일 인증이 비활성화된 환경(개발/테스트)인 경우 바로 홈으로
      navigate('/', { replace: true });
    }
  };

  return (
    <AuthLayout
      title="회원가입"
      subtitle="공방 작가들의 작품과 이야기를 만나보세요"
      footer={
        <span>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className={styles.link}>로그인</Link>
        </span>
      }
    >
      <SignUpForm
        onSuccess={handleSuccess}
        onViewAgreement={(key) => setOpenAgreement(key)}
      />
      <AgreementModal
        openKey={openAgreement}
        onClose={() => setOpenAgreement(null)}
      />
    </AuthLayout>
  );
};

export default SignUpPage;