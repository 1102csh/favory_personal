// src/features/auth/pages/LoginPage.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '@/shared/ui/AuthLayout/AuthLayout';
import Divider from '@/shared/ui/Divider/Divider';
import LoginForm from '../components/LoginForm/LoginForm';
import SocialLoginButtons from '../components/SocialLoginButtons/SocialLoginButtons';
import styles from './LoginPage.module.scss';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? '/';

  return (
    <AuthLayout
      title="로그인"
      subtitle="공방 작가들의 작품과 이야기를 만나보세요"
      footer={
        <div className={styles.footer}>
          <Link to="/auth/forgot-password" className={styles.link}>비밀번호 찾기</Link>
          <span className={styles.dot} aria-hidden>·</span>
          <Link to="/signup" className={styles.link}>회원가입</Link>
        </div>
      }
    >
      <LoginForm onSuccess={() => navigate(from, { replace: true })} />
      <Divider>또는</Divider>
      <SocialLoginButtons />
    </AuthLayout>
  );
};

export default LoginPage;