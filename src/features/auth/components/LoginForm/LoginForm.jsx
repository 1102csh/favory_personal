// src/features/auth/components/LoginForm/LoginForm.jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Input from '@/shared/ui/Input/Input';
import Button from '@/shared/ui/Button/Button';
import Alert from '@/shared/ui/Alert/Alert';
import PasswordField from '../PasswordField';

import { loginSchema } from '../../schemas/loginSchema';
import { useLogin } from '../../hooks/useLogin';

import styles from './LoginForm.module.scss';

const LoginForm = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  const { submit, isSubmitting, submitError } = useLogin();

  const onSubmit = async (values) => {
    const result = await submit(values);
    if (result.success) onSuccess?.();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {submitError && <Alert tone="danger">{submitError.message}</Alert>}

      <Input
        label="이메일"
        type="email"
        autoComplete="email"
        placeholder="example@email.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <PasswordField
        label="비밀번호"
        autoComplete="current-password"
        placeholder="비밀번호"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isSubmitting}
      >
        로그인
      </Button>
    </form>
  );
};

export default LoginForm;