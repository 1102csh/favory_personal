// src/shared/ui/Checkbox/Checkbox.jsx
import { forwardRef, useId } from 'react';
import clsx from 'clsx';
import styles from './Checkbox.module.scss';

/**
 * 디자인 시스템 Checkbox.
 * required prop으로 별표 표시. error prop으로 에러 강조.
 * 
 * clsx 설치 필요
 * npm install clsx
 */
const Checkbox = forwardRef(
  ({ label, error, required, id, children, className, ...rest }, ref) => {
    const reactId = useId();
    const checkboxId = id ?? `cb-${reactId}`;

    return (
      <div className={clsx(styles.wrapper, className)}>
        <label htmlFor={checkboxId} className={clsx(styles.label, error && styles.hasError)}>
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={styles.input}
            aria-invalid={!!error}
            {...rest}
          />
          <span className={styles.box} aria-hidden>
            <svg viewBox="0 0 12 12" className={styles.check}>
              <path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className={styles.text}>
            {required && <span className={styles.required} aria-hidden>*</span>}
            {label ?? children}
          </span>
        </label>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;