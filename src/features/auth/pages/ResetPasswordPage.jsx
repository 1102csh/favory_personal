// src/features/auth/pages/ResetPasswordPage.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import AuthLayout from '@/shared/ui/AuthLayout/AuthLayout';
import Button from '@/shared/ui/Button/Button';
import Alert from '@/shared/ui/Alert/Alert';
import PasswordField from '../components/PasswordField/PasswordField';

import { resetPasswordSchema } from '../schemas/passwordResetSchema';
import { usePasswordReset } from '../hooks/usePasswordReset';
import { authRepository } from '../api/authRepository';

import styles from './ResetPasswordPage.module.scss';

const ResetPasswordPage = () => {
    const navigate = useNavigate();

    // 진입 시점에 세션이 있어야 함 (Supabase가 detectSessionInUrl로 자동 처리)
    const [sessionReady, setSessionReady] = useState('checking');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const { data } = await authRepository.getSession();
            if (cancelled) return;
            setSessionReady(data?.session ? 'ready' : 'invalid');
        })();
        return () => { cancelled = true; };
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onBlur',
        defaultValues: { password: '', passwordConfirm: '' },
    });

    const watchedPassword = watch('password');
    const { updatePassword, isSending, isDone, error } = usePasswordReset();

    const onSubmit = async ({ password }) => {
        const ok = await updatePassword(password);
        if (ok) {
            // 변경 후 잠시 안내 후 로그인 페이지로
            setTimeout(() => navigate('/login', { replace: true }), 1500);
        }
    };

    if (sessionReady === 'checking') {
        return (
            <AuthLayout title="비밀번호 재설정">
                <p className={styles.muted}>링크를 확인하고 있습니다...</p>
            </AuthLayout>
        );
    }

    if (sessionReady === 'invalid') {
        return (
            <AuthLayout title="링크가 유효하지 않습니다">
                <Alert tone="danger">
                    링크가 만료되었거나 이미 사용되었습니다. 비밀번호 찾기를 다시 진행해주세요.
                </Alert>
                <Button variant="primary" fullWidth onClick={() => navigate('/auth/forgot-password')}>
                    비밀번호 찾기
                </Button>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="새 비밀번호 설정"
            subtitle="안전한 새 비밀번호를 설정해주세요."
        >
            {isDone ? (
                <Alert tone="success">
                    비밀번호가 변경되었습니다. 잠시 후 로그인 페이지로 이동합니다.
                </Alert>
            ) : (
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                    {error && <Alert tone="danger">{error.message}</Alert>}

                    <PasswordField
                        label="새 비밀번호"
                        autoComplete="new-password"
                        placeholder="영문/숫자/특수문자 포함 8자 이상"
                        showStrength
                        strengthValue={watchedPassword}      // ✅
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <PasswordField
                        label="비밀번호 확인"
                        autoComplete="new-password"
                        error={errors.passwordConfirm?.message}
                        {...register('passwordConfirm')}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={isSending}
                    >
                        비밀번호 변경
                    </Button>
                </form>
            )}
        </AuthLayout>
    );
};

export default ResetPasswordPage;