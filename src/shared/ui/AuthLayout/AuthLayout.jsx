// src/shared/ui/AuthLayout/AuthLayout.jsx
import Logo from '../Logo';
import styles from './AuthLayout.module.scss';

/**
 * 인증 페이지 공통 레이아웃.
 *
 * - 모바일: 풀스크린, 카드 보더 없이 페이지 자체가 폼
 * - 태블릿+: 중앙 카드, 보조 배경
 *
 * @param {object} props
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.footer]
 */
const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <main className={styles.shell}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <Logo width={160} />
        </div>
        {(title || subtitle) && (
          <header className={styles.header}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </header>
        )}
        <div className={styles.content}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </main>
  );
};

export default AuthLayout;