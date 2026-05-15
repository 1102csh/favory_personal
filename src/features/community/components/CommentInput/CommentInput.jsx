// src/features/community/components/CommentInput/CommentInput.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/shared/ui/Button';
import { commentCreateSchema } from '../../schemas/postSchema';
import styles from './CommentInput.module.scss';

/**
 * 댓글/대댓글 입력창.
 *
 * @param {object} props
 * @param {(content: string) => Promise<void>} props.onSubmit
 * @param {string} [props.placeholder]
 * @param {boolean} [props.autoFocus]
 * @param {() => void} [props.onCancel]
 * @param {string} [props.submitLabel='등록']
 */
const CommentInput = ({
  onSubmit,
  placeholder = '댓글을 입력해주세요',
  autoFocus = false,
  onCancel,
  submitLabel = '등록',
}) => {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(commentCreateSchema),
    mode: 'onSubmit',
    defaultValues: { content: '' },
  });

  const handleFormSubmit = async ({ content }) => {
    setSubmitting(true);
    try {
      await onSubmit(content);
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <textarea
        className={styles.textarea}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={2}
        aria-invalid={!!errors.content}
        {...register('content')}
        onKeyDown={(e) => {
          // Cmd/Ctrl + Enter 로 빠른 제출
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit(handleFormSubmit)();
          }
        }}
      />
      {errors.content && (
        <p className={styles.error} role="alert">
          {errors.content.message}
        </p>
      )}
      <div className={styles.footer}>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={submitting}>
            취소
          </Button>
        )}
        <Button type="submit" variant="primary" size="sm" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default CommentInput;