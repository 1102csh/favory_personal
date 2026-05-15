// src/shared/ui/Modal/Modal.jsx
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.scss';

/**
 * 접근성 친화 모달.
 * - ESC 키로 닫기
 * - 오버레이 클릭으로 닫기 (옵션)
 * - body 스크롤 잠금
 * - 마운트 시 다이얼로그로 포커스 이동
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {string} [props.title]
 * @param {boolean} [props.closeOnOverlayClick=true]
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.footer]
 */
const Modal = ({
  open,
  onClose,
  title,
  closeOnOverlayClick = true,
  children,
  footer,
}) => {
  const dialogRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  // ESC 키 + body 스크롤 잠금 + 포커스 관리
  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);

    // 마운트 직후 다이얼로그로 포커스 이동
    requestAnimationFrame(() => dialogRef.current?.focus());

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalOverflow;
      // 포커스 복원
      const prev = previouslyFocusedRef.current;
      if (prev && typeof prev.focus === 'function') prev.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        className={styles.dialog}
      >
        {(title || onClose) && (
          <header className={styles.header}>
            {title && <h2 id="modal-title" className={styles.title}>{title}</h2>}
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="닫기"
            >
              <CloseIcon />
            </button>
          </header>
        )}
        <div className={styles.content}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body
  );
};

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default Modal;