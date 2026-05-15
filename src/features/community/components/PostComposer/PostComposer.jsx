// src/features/community/components/PostComposer/PostComposer.jsx
import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as LinkIcon, X } from 'lucide-react';

import Button from '@/shared/ui/Button';
import Alert from '@/shared/ui/Alert';
import ImageUploadField from '@/shared/ui/ImageUploadField';
import { useAuth } from '@/app/providers/AuthProvider';
import { useUnsavedChangesGuard } from '@/shared/hooks/useUnsavedChangesGuard';

import { postService } from '../../services/postService';
import { postCreateSchema } from '../../schemas/postSchema';
import {
  POST_TYPES,
  POST_TYPE_LABELS,
  POST_CATEGORIES,
  POST_LIMITS,
} from '../../constants/postConstants';

import styles from './PostComposer.module.scss';

/**
 * 게시글 작성/수정 폼.
 *
 * @param {object} props
 * @param {(post) => void} [props.onCreated]    - 작성/수정 완료 후 호출
 * @param {() => void} [props.onCancel]         - 취소 (page 모드 한정)
 * @param {'inline'|'page'} [props.variant='inline']
 * @param {'create'|'edit'} [props.mode='create']
 * @param {object} [props.initialPost]          - mode='edit'일 때 기존 데이터
 */
const PostComposer = ({
  onCreated,
  onCancel,
  variant = 'inline',
  mode = 'create',
  initialPost = null,
  guardUnsavedChanges = true,
}) => {
  const { user, profile, isArtisan } = useAuth();
  const [submitError, setSubmitError] = useState(null);

  const isPageMode = variant === 'page';
  const isEditMode = mode === 'edit';

  // 매거진은 별도 관리자 페이지(/admin/magazine)에서 작성. 여기선 제외.
  const availableTypes = (
    isArtisan
      ? Object.values(POST_TYPES)
      : Object.values(POST_TYPES).filter((t) => t !== POST_TYPES.NOTICE)
  ).filter((t) => t !== POST_TYPES.MAGAZINE);

  // 수정 모드일 때 초기값 구성
  const defaultValues = isEditMode && initialPost
    ? {
      content: initialPost.content ?? '',
      post_type: initialPost.post_type ?? POST_TYPES.GENERAL,
      category: initialPost.category ?? null,
      attachments: {
        images: initialPost.attachments?.images ?? [],
        external_links: initialPost.attachments?.external_links ?? [],
        attached_products: initialPost.attachments?.attached_products ?? [],
      },
    }
    : {
      content: '',
      post_type: POST_TYPES.GENERAL,
      category: null,
      attachments: { images: [], external_links: [], attached_products: [] },
    };

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(postCreateSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  // initialPost가 비동기로 늦게 도착할 수 있으니 reset으로 동기화
  useEffect(() => {
    if (isEditMode && initialPost) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, initialPost?.id]);

  // ✅ 이탈 방지 가드
  const shouldGuard = guardUnsavedChanges && isDirty && !isSubmitting;
  useUnsavedChangesGuard(shouldGuard);

  const imagesField = useFieldArray({ control, name: 'attachments.images' });
  const linksField = useFieldArray({ control, name: 'attachments.external_links' });

  const watchedContent = watch('content');
  const remaining = POST_LIMITS.contentMax - (watchedContent?.length ?? 0);

  const onSubmit = async (values) => {
    setSubmitError(null);
    try {
      const cleanAttachments = {
        images: values.attachments.images?.filter((img) => img.url) ?? [],
        external_links: values.attachments.external_links?.filter((l) => l.url) ?? [],
        attached_products: values.attachments.attached_products ?? [],
      };

      const payload = {
        content: values.content,
        post_type: values.post_type,
        category: values.category || null,
        attachments: cleanAttachments,
      };

      let result;
      if (isEditMode) {
        // 수정
        result = await postService.updatePost(initialPost.id, payload);
        // 작성자/카운트 정보는 기존 값 유지
        result = {
          ...initialPost,
          ...result,
        };
      } else {
        // 신규 작성
        const created = await postService.createPost({
          authorId: user.id,
          ...payload,
        });
        result = {
          ...created,
          author_id: user.id,
          author_nickname: profile?.nickname,
          author_avatar_url: profile?.avatar_url,
          author_role: profile?.role,
          is_liked_by_me: false,
          like_count: 0,
          comment_count: 0,
        };
      }

      reset();
      onCreated?.(result);
    } catch (e) {
      setSubmitError(e);
    }
  };

  if (!user) return null;

  // 제출 버튼 레이블
  const submitLabel = isEditMode ? '수정 완료' : '게시';

  return (
    <form
      className={`${styles.composer} ${isPageMode ? styles.composerPage : ''}`}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {submitError && <Alert tone="danger">{submitError.message}</Alert>}

      {/* 분류 영역 */}
      <div className={isPageMode ? styles.fieldset : styles.headerInline}>
        {isPageMode && <label className={styles.fieldLabel}>분류</label>}

        <div className={styles.selectRow}>
          <select
            className={styles.select}
            aria-label="게시글 종류"
            {...register('post_type')}
          >
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {POST_TYPE_LABELS[t]}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            aria-label="카테고리"
            {...register('category')}
          >
            <option value="">카테고리 선택</option>
            {POST_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 본문 */}
      <div className={isPageMode ? styles.fieldset : ''}>
        {isPageMode && <label className={styles.fieldLabel}>내용</label>}

        <textarea
          className={`${styles.textarea} ${isPageMode ? styles.textareaPage : ''}`}
          placeholder={
            isPageMode
              ? '어떤 이야기를 나누고 싶으신가요?\n\n첫 줄은 카드에 제목처럼 표시됩니다.'
              : `${profile?.nickname ?? '회원'}님, 무슨 이야기를 나누고 싶으신가요?`
          }
          rows={isPageMode ? 12 : 4}
          aria-invalid={!!errors.content}
          {...register('content')}
        />

        <div className={styles.metaRow}>
          {errors.content && (
            <p className={styles.error} role="alert">
              {errors.content.message}
            </p>
          )}
          <span
            className={styles.counter}
            data-warn={remaining < 100 || undefined}
            aria-live="polite"
          >
            {remaining}자 남음
          </span>
        </div>
      </div>

      {/* 이미지 영역 — 상시 노출 */}
      <div className={isPageMode ? styles.fieldset : ''}>
        {isPageMode && (
          <label className={styles.fieldLabel}>
            첨부 이미지 ({imagesField.fields.length}/{POST_LIMITS.imagesMax})
          </label>
        )}

        <div className={styles.imageGrid}>
          {imagesField.fields.map((field, idx) => (
            <div key={field.id} className={styles.imageCell}>
              <Controller
                name={`attachments.images.${idx}.url`}
                control={control}
                render={({ field: ctrl }) => (
                  <ImageUploadField
                    kind="post"
                    previewShape="square"
                    value={ctrl.value}
                    onChange={ctrl.onChange}
                  />
                )}
              />
              <button
                type="button"
                className={styles.imageRemoveBtn}
                onClick={() => imagesField.remove(idx)}
                aria-label="이미지 제거"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {/* 항상 비어 있는 추가 업로드 슬롯 — 한도 도달 시 숨김.
              여러 장 한 번에 선택 가능 (남은 슬롯만큼). */}
          {imagesField.fields.length < POST_LIMITS.imagesMax && (
            <div className={styles.imageCell}>
              <ImageUploadField
                kind="post"
                previewShape="square"
                value=""
                multiple
                maxFiles={POST_LIMITS.imagesMax - imagesField.fields.length}
                onMultipleUploaded={(urls) => {
                  urls.forEach((url) => imagesField.append({ url }));
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 외부 링크 영역 */}
      {linksField.fields.length > 0 && (
        <div className={isPageMode ? styles.fieldset : ''}>
          {isPageMode && (
            <label className={styles.fieldLabel}>외부 링크</label>
          )}

          <div className={styles.attachmentList}>
            {linksField.fields.map((field, idx) => (
              <div key={field.id} className={styles.linkRow}>
                <LinkIcon size={16} className={styles.linkIcon} />
                <input
                  type="url"
                  className={styles.linkInput}
                  placeholder="링크 URL"
                  {...register(`attachments.external_links.${idx}.url`)}
                />
                <input
                  type="text"
                  className={styles.linkInput}
                  placeholder="링크 제목 (선택)"
                  {...register(`attachments.external_links.${idx}.title`)}
                />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => linksField.remove(idx)}
                  aria-label="링크 제거"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 액션 바 — 이미지 진입점은 그리드의 빈 슬롯이 담당하므로 제거,
          링크는 영역이 빈 상태에서 숨겨져 있어 트리거 버튼 유지. */}
      <div className={`${styles.actions} ${isPageMode ? styles.actionsPage : ''}`}>
        <div className={styles.attachButtons}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => linksField.append({ url: '', title: '' })}
            aria-label="링크 추가"
            title="외부 링크 추가"
          >
            <LinkIcon size={18} />
            {isPageMode && <span className={styles.iconBtnLabel}>링크 추가</span>}
          </button>
        </div>

        <div className={styles.submitGroup}>
          {isPageMode && onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              취소
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={remaining < 0}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PostComposer;