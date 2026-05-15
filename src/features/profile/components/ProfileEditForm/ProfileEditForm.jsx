// src/features/profile/components/ProfileEditForm/ProfileEditForm.jsx
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import clsx from 'clsx';

import ImageUploadField from '@/shared/ui/ImageUploadField';

import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';
import Alert from '@/shared/ui/Alert';

import TagInput from '../TagInput';
import SocialLinksInput from '../SocialLinksInput';

import { profileEditSchema } from '../../schemas/profileEditSchema';
import { profileEditService } from '../../services/profileEditService';
import { useNicknameCheck } from '@/features/auth/hooks/useNicknameCheck';
import { useHandleCheck } from '../../hooks/useHandleCheck';

import styles from './ProfileEditForm.module.scss';

/**
 * 프로필 편집 폼.
 *
 * @param {object} props
 * @param {string} props.userId
 * @param {object} props.initialProfile  - useUserProfile이 normalize한 객체
 * @param {(updated: object) => void} props.onSaved
 * @param {() => void} [props.onCancel]
 */
const ProfileEditForm = ({ userId, initialProfile, onSaved, onCancel }) => {
    const [submitError, setSubmitError] = useState(null);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setError,
        formState: { errors, isSubmitting, isDirty },
    } = useForm({
        resolver: zodResolver(profileEditSchema),
        mode: 'onBlur',
        defaultValues: {
            nickname: initialProfile?.nickname ?? '',
            handle: initialProfile?.handle ?? '',
            bio: initialProfile?.bio ?? '',
            avatarUrl: initialProfile?.avatarUrl ?? '',
            coverImageUrl: initialProfile?.coverImageUrl ?? '',
            tags: initialProfile?.tags ?? [],
            socialLinks: initialProfile?.socialLinks ?? {},
        },
    });

    // 닉네임 중복 검사 (기존과 다를 때만 의미 있음)
    const watchedNickname = watch('nickname');
    const nicknameChanged = watchedNickname !== initialProfile?.nickname;
    const { status: nicknameStatus, message: nicknameMessage } =
        useNicknameCheck(nicknameChanged ? watchedNickname : '');

    // 핸들 중복 검사
    const watchedHandle = watch('handle');
    const { status: handleStatus, message: handleMessage } =
        useHandleCheck(watchedHandle);

    const onSubmit = async (values) => {
        setSubmitError(null);

        // 닉네임이 변경됐는데 사용 불가 상태면 차단
        if (nicknameChanged && nicknameStatus === 'taken') {
            setError('nickname', { message: '이미 사용 중인 닉네임이에요' });
            return;
        }
        if (handleStatus === 'taken') {
            setError('handle', { message: '이미 사용 중인 핸들이에요' });
            return;
        }
        if (handleStatus === 'invalid') {
            setError('handle', { message: '핸들 형식이 올바르지 않아요' });
            return;
        }

        try {
            const updated = await profileEditService.updateOwnProfile(userId, values);
            onSaved?.(updated);
        } catch (e) {
            // 서버 검증으로 막힌 unique 에러는 필드별로 매핑
            if (e.code === 'NICKNAME_TAKEN') {
                setError('nickname', { message: e.message });
            } else if (e.code === 'HANDLE_TAKEN') {
                setError('handle', { message: e.message });
            } else {
                setSubmitError(e);
            }
        }
    };

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            {submitError && <Alert tone="danger">{submitError.message}</Alert>}

            {/* 기본 정보 */}
            <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>기본 정보</legend>

                <Input
                    label="닉네임"
                    placeholder="2~20자"
                    error={errors.nickname?.message}
                    hint={nicknameChanged ? nicknameMessage : '한글/영문/숫자 사용 가능'}
                    rightSlot={renderCheckStatus(nicknameChanged ? nicknameStatus : 'idle')}
                    {...register('nickname')}
                />

                <Input
                    label={
                        <>
                            핸들 <span className={styles.optional}>(선택)</span>
                        </>
                    }
                    placeholder="영문 소문자/숫자/_/. (3~20자)"
                    error={errors.handle?.message}
                    hint={
                        handleMessage ||
                        '나중에 @핸들로 다른 사용자가 회원님을 찾을 수 있어요'
                    }
                    rightSlot={renderCheckStatus(handleStatus)}
                    {...register('handle')}
                />

                <div className={styles.field}>
                    <label htmlFor="bio" className={styles.label}>
                        자기소개 <span className={styles.optional}>(선택)</span>
                    </label>
                    <textarea
                        id="bio"
                        rows={5}
                        className={clsx(styles.textarea, errors.bio && styles.textareaError)}
                        placeholder="500자 이내"
                        {...register('bio')}
                    />
                    {errors.bio && (
                        <p className={styles.error} role="alert">
                            {errors.bio.message}
                        </p>
                    )}
                </div>
            </fieldset>

            {/* 이미지 */}
            <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>이미지</legend>

                <Controller
                    name="avatarUrl"
                    control={control}
                    render={({ field }) => (
                        <ImageUploadField
                            kind="avatar"
                            replacePrevious                          // 새 업로드 시 이전 파일 정리
                            label="프로필 이미지"
                            previewShape="square"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.avatarUrl?.message}
                            hint="권장: 정사각형, 2MB 이하"
                        />
                    )}
                />

                <Controller
                    name="coverImageUrl"
                    control={control}
                    render={({ field }) => (
                        <ImageUploadField
                            kind="cover"
                            replacePrevious
                            label="커버 이미지"
                            previewShape="wide"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.coverImageUrl?.message}
                            hint="프로필 상단 배경. 권장: 1920×1080, 5MB 이하"
                        />
                    )}
                />
            </fieldset>

            {/* 태그 */}
            <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>태그</legend>

                <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                        <TagInput
                            value={field.value}
                            onChange={field.onChange}
                            hint="Enter 또는 쉼표(,)로 추가. 최대 10개"
                            error={errors.tags?.message}
                        />
                    )}
                />
            </fieldset>

            {/* 소셜 링크 */}
            <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>외부 링크</legend>

                <Controller
                    name="socialLinks"
                    control={control}
                    render={({ field }) => {
                        const socialErrors = Object.entries(errors.socialLinks ?? {}).reduce(
                            (acc, [key, val]) => {
                                acc[key] = val?.message;
                                return acc;
                            },
                            {}
                        );
                        return (
                            <SocialLinksInput
                                value={field.value}
                                onChange={field.onChange}
                                errors={socialErrors}
                            />
                        );
                    }}
                />
            </fieldset>

            {/* 액션 */}
            <div className={styles.actions}>
                {onCancel && (
                    <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                        취소
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    disabled={!isDirty}
                >
                    저장하기
                </Button>
            </div>
        </form>
    );
};

/**
 * 닉네임/핸들 검사 상태를 시각화하는 right slot.
 */
const renderCheckStatus = (status) => {
    switch (status) {
        case 'checking':
            return <Loader2 size={16} className={styles.spinner} aria-label="확인 중" />;
        case 'available':
            return <Check size={16} color="var(--color-success)" aria-label="사용 가능" />;
        case 'taken':
        case 'invalid':
        case 'error':
            return <AlertCircle size={16} color="var(--color-danger)" aria-label="사용 불가" />;
        default:
            return null;
    }
};

export default ProfileEditForm;