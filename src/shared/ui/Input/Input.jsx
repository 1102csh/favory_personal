// src/shared/ui/Input/Input.jsx
import { forwardRef, useId } from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';

/**
 * 디자인 시스템 Input.
 * react-hook-form의 register와 함께 사용:
 *   <Input label="이메일" {...register('email')} error={errors.email?.message} />
 *
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} [props.error]            // 에러 메시지
 * @param {string} [props.helperText]       // 보조 설명
 * @param {React.ReactNode} [props.rightSlot]  // 인증 버튼 같은 우측 요소
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      rightSlot,
      type = 'text',
      id,
      className,
      ...rest
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? `input-${reactId}`;
    const describedBy = error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined;

    return (
      <div className={clsx(styles.field, className)}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        <div className={clsx(styles.inputWrapper, error && styles.hasError)}>
          <input
            ref={ref}
            id={inputId}
            type={type}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={styles.input}
            {...rest}
          />
          {rightSlot && <div className={styles.rightSlot}>{rightSlot}</div>}
        </div>

        {error ? (
          <p id={`${inputId}-error`} className={styles.error} role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-help`} className={styles.helper}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;