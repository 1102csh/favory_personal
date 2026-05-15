// src/app/router/NotFoundPage.jsx
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <main
    style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      gap: 16,
      background: 'var(--color-bg-page)',
      color: 'var(--color-text-primary)',
    }}
  >
    <h1 style={{ fontSize: 48, fontWeight: 600, margin: 0 }}>404</h1>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      요청하신 페이지를 찾을 수 없습니다.
    </p>
    <Link
      to="/"
      style={{
        marginTop: 8,
        padding: '10px 20px',
        borderRadius: 8,
        background: 'var(--color-brand)',
        color: 'var(--color-text-on-brand)',
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      홈으로
    </Link>
  </main>
);

export default NotFoundPage;