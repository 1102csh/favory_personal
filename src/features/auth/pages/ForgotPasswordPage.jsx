// src/features/auth/pages/ForgotPasswordPage.jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';

import AuthLayout from '@/shared/ui/AuthLayout/AuthLayout';
import Input from '@/shared/ui/Input/Input';
import Button from '@/shared/ui/Button/Button';
import Alert from '@/shared/ui/Alert/Alert';

import { forgotPasswordSchema } from '../schemas/passwordResetSchema';
import { usePasswordReset } from '../hooks/usePasswordReset';

import styles from './ForgotPasswordPage.module.scss';

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: { email: '' },
  });

  const { sendResetEmail, isSending, isDone, error } = usePasswordReset();

  const onSubmit = async ({ email }) => {
    await sendResetEmail(email);
  };

  return (
    <AuthLayout
      title="비밀번호 찾기"
      subtitle="가입하신 이메일로 재설정 링크를 보내드립니다."
      footer={<Link to="/login" className={styles.link}>로그인 페이지로</Link>}
    >
      {isDone ? (
        <Alert tone="success">
          이메일을 확인해주세요. 메일에 포함된 링크를 클릭하면 새 비밀번호를 설정할 수 있습니다.
          몇 분이 지나도 메일이 오지 않으면 스팸함을 확인해주세요.
        </Alert>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          {error && <Alert tone="danger">{error.message}</Alert>}

          <Input
            label="이메일"
            type="email"
            autoComplete="email"
            placeholder="가입하신 이메일을 입력해주세요"
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSending}
          >
            재설정 링크 받기
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;