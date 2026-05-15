// src/app/router/guards.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const ALLOW_INCOMPLETE_PATHS = ['/auth/complete-profile', '/auth/callback'];

// ✅ 'loading'과 'authenticating' 모두 로딩 상태로 처리
const isResolving = (status) => status === 'loading' || status === 'authenticating';

export const ProtectedRoute = ({ children }) => {
  const { status, profile } = useAuth();
  const location = useLocation();

  if (isResolving(status)) return <FullScreenLoader />;
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (
    profile &&
    !profile.profile_completed &&
    !ALLOW_INCOMPLETE_PATHS.includes(location.pathname)
  ) {
    return <Navigate to="/auth/complete-profile" replace />;
  }
  return children;
};

export const PublicOnlyRoute = ({ children }) => {
  const { status, profile } = useAuth();

  if (isResolving(status)) return <FullScreenLoader />;
  if (status === 'authenticated') {
    if (profile && !profile.profile_completed) {
      return <Navigate to="/auth/complete-profile" replace />;
    }
    return <Navigate to="/" replace />;
  }
  return children;
};

export const ArtisanRoute = ({ children }) => {
  const { status, profile, isArtisan } = useAuth();
  const location = useLocation();

  if (isResolving(status)) return <FullScreenLoader />;
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (profile && !profile.profile_completed) {
    return <Navigate to="/auth/complete-profile" replace />;
  }

  if (!isArtisan) {
    return <Navigate to="/upgrade" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { status, profile, isAdmin } = useAuth();
  const location = useLocation();

  if (isResolving(status)) return <FullScreenLoader />;
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (profile && !profile.profile_completed) {
    return <Navigate to="/auth/complete-profile" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const FullScreenLoader = () => (
  <div
    style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--color-text-secondary)',
    }}
    aria-live="polite"
  >
    Loading...
  </div>
);
