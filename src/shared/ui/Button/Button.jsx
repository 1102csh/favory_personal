// src/shared/ui/Button/Button.jsx
import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

/**
 * 디자인 시스템 Button.
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.fullWidth]
 * @param {boolean} [props.loading]
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.children]
 */
const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      leftIcon,
      type = 'button',
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={clsx(
          styles.button,
          styles[`variant-${variant}`],
          styles[`size-${size}`],
          fullWidth && styles.fullWidth,
          loading && styles.loading,
          className
        )}
        {...rest}
      >
        {loading && <span className={styles.spinner} aria-hidden />}
        {!loading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <span className={styles.label}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;