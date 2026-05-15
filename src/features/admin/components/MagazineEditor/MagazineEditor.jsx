// src/features/admin/components/MagazineEditor/MagazineEditor.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Pencil, ImagePlus, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import Button from '@/shared/ui/Button';
import Alert from '@/shared/ui/Alert';
import ImageUploadField from '@/shared/ui/ImageUploadField';
import { useAuth } from '@/app/providers/AuthProvider';
import { useImageUpload } from '@/shared/hooks/useImageUpload';
import { useUnsavedChangesGuard } from '@/shared/hooks/useUnsavedChangesGuard';

import { magazineCreateSchema } from '@/features/community/schemas/postSchema';
import { POST_CATEGORIES, POST_LIMITS } from '@/features/community/constants/postConstants';

import styles from './MagazineEditor.module.scss';

/**
 * 매거진 작성/수정 에디터.
 * 일반 PostComposer와 분리된, 관리자 전용 인터페이스.
 *
 * @param {object} props
 * @param {'create'|'edit'} [props.mode='create']
 * @param {object} [props.initialMagazine]   - mode='edit'일 때 기존 데이터
 * @param {(post) => void} props.onSaved
 * @param {() => void} props.onCancel
 */
const MagazineEditor = ({
  mode = 'create',
  initialMagazine = null,
  onSaved,
  onCancel,
}) => {
  const { user } = useAuth();
  const [submitError, setSubmitError] = useState(null);
  const [tab, setTab] = useState('write');           // 'write' | 'preview'
  const textareaRef = useRef(null);

  // 본문 안 이미지 삽입용 업로더
  const { upload: uploadInline, isUploading: isInlineUploading } = useImageUpload({
    kind: 'post',
  });

  const defaultValues = useMemo(() => {
    if (mode === 'edit' && initialMagazine) {
      return {
        title: initialMagazine.title ?? '',
        content: initialMagazine.content ?? '',
        category: initialMagazine.category ?? null,
        attachments: {
          cover_url: initialMagazine.attachments?.cover_url
            ?? initialMagazine.attachments?.images?.[0]?.url
            ?? null,
        },
      };
    }
    return {
      title: '',
      content: '',
      category: null,
      attachments: { cover_url: null },
    };
  }, [mode, initialMagazine]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(magazineCreateSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  useEffect(() => {
    if (mode === 'edit' && initialMagazine) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initialMagazine?.id]);

  // 이탈 방지
  useUnsavedChangesGuard(isDirty && !isSubmitting);

  const content = watch('content');
  const title = watch('title');
  const coverUrl = watch('attachments.cover_url');

  const remaining = POST_LIMITS.contentMax - (content?.length ?? 0);

  // textarea 커서 위치에 텍스트 삽입
  const insertAtCursor = (insertion) => {
    const ta = textareaRef.current;
    if (!ta) {
      setValue('content', (content ?? '') + insertion, { shouldDirty: true });
      return;
    }
    const start = ta.selectionStart ?? content?.length ?? 0;
    const end = ta.selectionEnd ?? start;
    const next = (content ?? '').slice(0, start) + insertion + (content ?? '').slice(end);
    setValue('content', next, { shouldDirty: true });
    // 다음 tick에 커서 위치 복원
    requestAnimationFrame(() => {
      ta.focus();
      const caret = start + insertion.length;
      ta.setSelectionRange(caret, caret);
    });
  };

  const handleInlineImageUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const { publicUrl } = await uploadInline(file);
      insertAtCursor(`\n\n![](${publicUrl})\n\n`);
    } catch {
      // useImageUpload가 error 상태 보관
    }
  };

  const onSubmit = async (values) => {
    setSubmitError(null);
    try {
      const result = await onSaved({
        authorId: user.id,
        title: values.title,
        content: values.content,
        category: values.category || null,
        coverUrl: values.attachments.cover_url || null,
      });
      reset();
      return result;
    } catch (e) {
      setSubmitError(e);
    }
  };

  return (
    <form className={styles.editor} onSubmit={handleSubmit(onSubmit)} noValidate>
      {submitError && <Alert tone="danger">{submitError.message}</Alert>}

      {/* 표지 이미지 */}
      <section className={styles.fieldset}>
        <label className={styles.fieldLabel}>표지 이미지</label>
        <p className={styles.fieldHint}>매거진 카드와 상세 페이지 상단에 큰 이미지로 노출됩니다.</p>
        <Controller
          name="attachments.cover_url"
          control={control}
          render={({ field }) => (
            <ImageUploadField
              kind="post"
              previewShape="wide"
              value={field.value ?? ''}
              onChange={field.onChange}
            />
          )}
        />
      </section>

      {/* 카테고리 */}
      <section className={styles.fieldset}>
        <label className={styles.fieldLabel}>카테고리 (선택)</label>
        <select className={styles.select} {...register('category')}>
          <option value="">선택 안 함</option>
          {POST_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </section>

      {/* 제목 */}
      <section className={styles.fieldset}>
        <label className={styles.fieldLabel}>제목</label>
        <input
          type="text"
          className={styles.titleInput}
          placeholder="매거진 제목을 입력해주세요"
          maxLength={POST_LIMITS.titleMax}
          aria-invalid={!!errors.title}
          {...register('title')}
        />
        {errors.title && (
          <p className={styles.error} role="alert">{errors.title.message}</p>
        )}
      </section>

      {/* 본문 — write/preview 탭 */}
      <section className={styles.fieldset}>
        <div className={styles.bodyHeader}>
          <label className={styles.fieldLabel}>본문</label>
          <div className={styles.tabs} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'write'}
              className={tab === 'write' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              onClick={() => setTab('write')}
            >
              <Pencil size={14} /> 작성
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'preview'}
              className={tab === 'preview' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              onClick={() => setTab('preview')}
            >
              <Eye size={14} /> 미리보기
            </button>
          </div>
        </div>

        {tab === 'write' ? (
          <>
            <textarea
              ref={(el) => {
                textareaRef.current = el;
                // RHF에 ref 등록 — register는 textarea 직접 등록할 때 사용하지만
                // 여기선 control과 함께 사용하므로 setValue로 처리
              }}
              className={styles.textarea}
              placeholder={`# 큰 제목 (선택)\n\n매거진 본문을 마크다운으로 작성하세요.\n\n**굵게**, *기울임*, [링크](https://...), 그리고 본문 중간에 이미지를 삽입할 수 있어요.\n\n이미지 삽입은 본문 위 [이미지 삽입] 버튼을 눌러주세요.`}
              rows={20}
              value={content ?? ''}
              onChange={(e) =>
                setValue('content', e.target.value, { shouldDirty: true })
              }
            />
            <div className={styles.metaRow}>
              <label className={styles.inlineImageButton}>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleInlineImageUpload}
                  disabled={isInlineUploading}
                  hidden
                />
                {isInlineUploading ? (
                  <>
                    <Loader2 size={14} className={styles.spinner} />
                    업로드 중...
                  </>
                ) : (
                  <>
                    <ImagePlus size={14} /> 본문에 이미지 삽입
                  </>
                )}
              </label>
              <span
                className={styles.counter}
                data-warn={remaining < 200 || undefined}
              >
                {remaining}자 남음
              </span>
            </div>
            {errors.content && (
              <p className={styles.error} role="alert">{errors.content.message}</p>
            )}
          </>
        ) : (
          <div className={styles.preview}>
            {coverUrl && (
              <img src={coverUrl} alt="" className={styles.previewCover} />
            )}
            {title && <h1 className={styles.previewTitle}>{title}</h1>}
            {!content?.trim() ? (
              <p className={styles.previewEmpty}>아직 작성된 본문이 없어요.</p>
            ) : (
              <div className={styles.previewBody}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 액션 */}
      <div className={styles.actions}>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
        >
          {mode === 'edit' ? '수정 완료' : '매거진 발행'}
        </Button>
      </div>
    </form>
  );
};

export default MagazineEditor;
