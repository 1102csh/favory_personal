// src/features/auth/components/CompleteProfileForm/CompleteProfileForm.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Input from '@/shared/ui/Input/Input';
import Button from '@/shared/ui/Button/Button';
import Alert from '@/shared/ui/Alert/Alert';

import PhoneVerificationField from '../PhoneVerificationField/PhoneVerificationField';
import AgreementSection from '../AgreementSection/AgreementSection';

import { completeProfileSchema } from '../../schemas/completeProfileSchema';
import { useNicknameCheck } from '../../hooks/useNicknameCheck';
import { usePhoneVerification } from '../../hooks/usePhoneVerification';
import { authService } from '../../services/authService';
import { AuthError } from '@/shared/lib/errors/AuthError';
import { AUTH_MESSAGES } from '../../constants/authConstants';
import { formatPhone } from '@/shared/lib/validators/phoneFormatter';

import styles from './CompleteProfileForm.module.scss';

/**
 * 소셜 가입자 추가 정보 입력 폼.
 * SignUpForm과 구조 유사하나 이메일/비밀번호 필드 없음.
 */
const CompleteProfileForm = ({ userId, onSuccess, onViewAgreement }) => {
  const {
    register, handleSubmit, watch, setValue, setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(completeProfileSchema),
    mode: 'onBlur',
    defaultValues: {
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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const watchedNickname = watch('nickname');
  const watchedPhone = watch('phone');
  const watchedAgreements = {
    agreedTerms:     watch('agreedTerms'),
    agreedPrivacy:   watch('agreedPrivacy'),
    agreedAge:       watch('agreedAge'),
    agreedMarketing: watch('agreedMarketing'),
  };

  useEffect(() => {
    if (nicknameCheck.verifiedNickname && watchedNickname !== nicknameCheck.verifiedNickname) {
      nicknameCheck.reset();
    }
  }, [watchedNickname, nicknameCheck]);

  useEffect(() => {
    if (phoneVerification.verifiedPhone && watchedPhone !== phoneVerification.verifiedPhone) {
      phoneVerification.reset();
    }
  }, [watchedPhone, phoneVerification]);

  useEffect(() => {
    if (!watchedPhone) return;
    const formatted = formatPhone(watchedPhone);
    if (formatted !== watchedPhone) {
      setValue('phone', formatted, { shouldValidate: false });
    }
  }, [watchedPhone, setValue]);

  const onSubmit = async (values) => {
    if (!nicknameCheck.isAvailable || nicknameCheck.verifiedNickname !== values.nickname) {
      setError('nickname', { message: AUTH_MESSAGES.nickname.notChecked });
      return;
    }
    if (!phoneVerification.isVerified || phoneVerification.verifiedPhone !== values.phone) {
      setError('phone', { message: AUTH_MESSAGES.phone.notVerified });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      await authService.completeSocialProfile({
        userId,
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
      onSuccess?.();
    } catch (err) {
      const e = err instanceof AuthError
        ? err
        : new AuthError('UNKNOWN', AUTH_MESSAGES.generic.unknown, err);
      if (e.code === 'NICKNAME_DUPLICATED') {
        setError('nickname', { message: e.message });
        nicknameCheck.reset();
      } else {
        setSubmitError(e);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {submitError && <Alert tone="danger">{submitError.message}</Alert>}

      <Alert tone="info">
        서비스 이용을 위해 추가 정보를 입력해주세요.
      </Alert>

      <Input
        label="닉네임"
        autoComplete="nickname"
        placeholder="2~16자 한글/영문/숫자"
        error={errors.nickname?.message}
        helperText={nicknameCheck.status === 'available' ? nicknameCheck.message : undefined}
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

      <PhoneVerificationField
        phone={watchedPhone}
        phoneError={errors.phone?.message}
        phoneRegister={register('phone')}
        verification={phoneVerification}
      />

      <AgreementSection
        values={watchedAgreements}
        errors={{
          agreedTerms:     errors.agreedTerms,
          agreedPrivacy:   errors.agreedPrivacy,
          agreedAge:       errors.agreedAge,
          agreedMarketing: errors.agreedMarketing,
        }}
        register={register}
        setValue={setValue}
        onView={onViewAgreement}
      />

      <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting}>
        시작하기
      </Button>
    </form>
  );
};

export default CompleteProfileForm;