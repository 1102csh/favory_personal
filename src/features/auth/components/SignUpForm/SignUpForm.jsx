// src/features/auth/components/SignUpForm/SignUpForm.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Input from '@/shared/ui/Input/Input';
import Button from '@/shared/ui/Button/Button';
import Alert from '@/shared/ui/Alert/Alert';

import PasswordField from '../PasswordField/PasswordField';
import PhoneVerificationField from '../PhoneVerificationField/PhoneVerificationField';
import AgreementSection from '../AgreementSection/AgreementSection';

import { signUpSchema } from '../../schemas/signUpSchema';
import { useNicknameCheck } from '../../hooks/useNicknameCheck';
import { usePhoneVerification } from '../../hooks/usePhoneVerification';
import { useSignUp } from '../../hooks/useSignUp';
import { AUTH_MESSAGES } from '../../constants/authConstants';
import { formatPhone } from '@/shared/lib/validators/phoneFormatter';

import styles from './SignUpForm.module.scss';

/**
 * 회원가입 폼.
 * - 폼 검증: react-hook-form + zod (signUpSchema)
 * - 닉네임 중복확인: useNicknameCheck (별도 비동기 검증)
 * - 전화번호 인증: usePhoneVerification (별도 비동기 검증)
 * - 제출: useSignUp → authService
 *
 * @param {object} props
 * @param {(result: { userId: string, needsEmailConfirm: boolean }) => void} [props.onSuccess]
 * @param {(key: string) => void} [props.onViewAgreement]   - 약관 본문 보기
 */
const SignUpForm = ({ onSuccess, onViewAgreement }) => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        formState: { errors, isSubmitted },
    } = useForm({
        resolver: zodResolver(signUpSchema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: '',
            passwordConfirm: '',
            nickname: '',
            phone: '',
            agreedTerms: false,
            agreedPrivacy: false,
            agreedAge: false,
            agreedMarketing: false,
        },
    });

    const nicknameCheck = useNicknameCheck();
    const phoneVerification = usePhoneVerification();
    const { submit, isSubmitting, submitError } = useSignUp();

    const watchedPassword = watch('password');
    const watchedNickname = watch('nickname');
    const watchedPhone = watch('phone');
    const watchedAgreements = {
        agreedTerms: watch('agreedTerms'),
        agreedPrivacy: watch('agreedPrivacy'),
        agreedAge: watch('agreedAge'),
        agreedMarketing: watch('agreedMarketing'),
    };

    // 닉네임 값이 바뀌면 이전 검증 결과 무효화
    useEffect(() => {
        if (
            nicknameCheck.verifiedNickname &&
            watchedNickname !== nicknameCheck.verifiedNickname
        ) {
            nicknameCheck.reset();
        }
    }, [watchedNickname, nicknameCheck]);

    // 전화번호 값이 바뀌면 이전 인증 결과 무효화
    useEffect(() => {
        if (
            phoneVerification.verifiedPhone &&
            watchedPhone !== phoneVerification.verifiedPhone
        ) {
            phoneVerification.reset();
        }
    }, [watchedPhone, phoneVerification]);

    // 전화번호 자동 포맷팅 (입력 중 하이픈 자동 추가)
    useEffect(() => {
        if (!watchedPhone) return;
        const formatted = formatPhone(watchedPhone);
        if (formatted !== watchedPhone) {
            setValue('phone', formatted, { shouldValidate: false });
        }
    }, [watchedPhone, setValue]);

    const onSubmit = async (values) => {
        // ----- 비동기 부가검증 (zod로 못 잡는 것들) -----
        if (!nicknameCheck.isAvailable || nicknameCheck.verifiedNickname !== values.nickname) {
            setError('nickname', { message: AUTH_MESSAGES.nickname.notChecked });
            return;
        }
        if (!phoneVerification.isVerified || phoneVerification.verifiedPhone !== values.phone) {
            setError('phone', { message: AUTH_MESSAGES.phone.notVerified });
            return;
        }

        // ----- 제출 -----
        const result = await submit({
            email: values.email,
            password: values.password,
            nickname: values.nickname,
            phone: values.phone,
            phoneVerified: true,
            agreements: {
                terms: values.agreedTerms,
                privacy: values.agreedPrivacy,
                age: values.agreedAge,
                marketing: values.agreedMarketing,
            },
        });

        if (result.success) {
            onSuccess?.({ userId: result.userId, needsEmailConfirm: result.needsEmailConfirm });
        } else if (submitError?.code === 'EMAIL_DUPLICATED') {
            setError('email', { message: submitError.message });
        } else if (submitError?.code === 'NICKNAME_DUPLICATED') {
            setError('nickname', { message: submitError.message });
            nicknameCheck.reset();
        }
        // 그 외 에러는 상단 Alert에 표시 (submitError는 훅이 보유)
    };

    // 폼 제출 가능 여부 (UX용 — 실제 검증은 onSubmit에서)
    const canSubmit =
        nicknameCheck.isAvailable &&
        phoneVerification.isVerified &&
        !isSubmitting;

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* 제출 에러 (필드별로 매핑되지 않은 일반 에러) */}
            {submitError &&
                !['EMAIL_DUPLICATED', 'NICKNAME_DUPLICATED'].includes(submitError.code) && (
                    <Alert tone="danger">{submitError.message}</Alert>
                )}

            {/* 이메일 */}
            <Input
                label="이메일"
                type="email"
                autoComplete="email"
                placeholder="example@email.com"
                error={errors.email?.message}
                {...register('email')}
            />

            {/* 비밀번호 */}
            <PasswordField
                label="비밀번호"
                autoComplete="new-password"
                placeholder="영문/숫자/특수문자 포함 8자 이상"
                helperText="영문, 숫자, 특수문자를 모두 포함해야 합니다."
                showStrength
                strengthValue={watchedPassword}      // ✅ value → strengthValue
                error={errors.password?.message}
                {...register('password')}
            />

            {/* 비밀번호 확인 */}
            <PasswordField
                label="비밀번호 확인"
                autoComplete="new-password"
                placeholder="비밀번호를 다시 입력해주세요"
                error={errors.passwordConfirm?.message}
                {...register('passwordConfirm')}     // ✅ value/strengthValue 전달 X
            />

            {/* 닉네임 + 중복확인 */}
            <Input
                label="닉네임"
                autoComplete="nickname"
                placeholder="2~16자 한글/영문/숫자"
                error={errors.nickname?.message}
                helperText={
                    nicknameCheck.status === 'available'
                        ? nicknameCheck.message
                        : nicknameCheck.status === 'taken' || nicknameCheck.status === 'error'
                            ? undefined
                            : undefined
                }
                {...register('nickname')}
                rightSlot={
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => nicknameCheck.check(watchedNickname)}
                        loading={nicknameCheck.isChecking}
                        disabled={!watchedNickname || nicknameCheck.isAvailable}
                    >
                        {nicknameCheck.isAvailable ? '확인완료' : '중복확인'}
                    </Button>
                }
            />

            {/* 전화번호 + 인증 */}
            <PhoneVerificationField
                phone={watchedPhone}
                phoneError={errors.phone?.message}
                phoneRegister={register('phone')}
                verification={phoneVerification}
            />

            {/* 약관 동의 */}
            <AgreementSection
                values={watchedAgreements}
                errors={{
                    agreedTerms: errors.agreedTerms,
                    agreedPrivacy: errors.agreedPrivacy,
                    agreedAge: errors.agreedAge,
                    agreedMarketing: errors.agreedMarketing,
                }}
                register={register}
                setValue={setValue}
                onView={onViewAgreement}
            />

            {/* 제출 */}
            <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                disabled={!canSubmit && isSubmitted}
            >
                회원가입
            </Button>
        </form>
    );
};

export default SignUpForm;