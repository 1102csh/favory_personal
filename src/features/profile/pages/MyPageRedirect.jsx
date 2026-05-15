// src/features/profile/pages/MyPageRedirect.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

/**
 * /mypage → /users/{본인id} 리다이렉트.
 *
 * ProfilePage 자체는 /users/:id로만 접근 가능하게 통일하되,
 * 사용자 친화적인 /mypage URL은 유지하기 위함.
 */
export default function MyPageRedirect() {
  const { user, status } = useAuth();

  if (status === 'loading' || status === 'authenticating') {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`/users/${user.id}`} replace />;
}