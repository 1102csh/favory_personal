// src/features/profile/pages/ProfileEditPage.jsx
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import LegacyScope from '@/shared/ui/LegacyScope';
import { useAuth } from '@/app/providers/AuthProvider';
import { useResponsive } from '@/shared/hooks/useResponsive';
import SiteNav from '@/features/home/components/SiteNav';

import { useUserProfile } from '../hooks/useUserProfile';
import ProfileEditForm from '../components/ProfileEditForm';

import styles from './ProfileEditPage.module.scss';

/**
 * 프로필 편집 페이지.
 *
 * 라우트: /settings/profile
 * 가드:   ProtectedRoute로 감쌈
 *
 * 저장 성공 시 → 본인 프로필 페이지로 자동 이동.
 */
const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const { user, refreshProfile } = useAuth();
  const { profile, isLoading, error } = useUserProfile(user?.id);

  const handleSaved = async () => {
    // AuthProvider의 currentProfile 갱신 → 헤더/SiteNav 즉시 반영
    await refreshProfile();
    // 본인 프로필 페이지로 이동
    navigate(`/users/${user.id}`, { replace: true });
  };

  return (
    <LegacyScope className={styles.page}>
      <SiteNav isMobile={isMobile} />

      <div className={styles.container}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={styles.backLink}
        >
          <ChevronLeft size={16} /> 뒤로
        </button>

        <header className={styles.header}>
          <h1 className={styles.title}>프로필 편집</h1>
          <p className={styles.subtitle}>
            다른 사람들에게 보여질 정보를 수정할 수 있어요.
          </p>
        </header>

        {isLoading && (
          <p className={styles.message}>프로필 정보를 불러오는 중...</p>
        )}

        {error && (
          <p className={styles.message} style={{ color: 'var(--color-danger)' }}>
            {error.message}
          </p>
        )}

        {!isLoading && !error && profile && user && (
          <ProfileEditForm
            userId={user.id}
            initialProfile={profile}
            onSaved={handleSaved}
            onCancel={() => navigate(-1)}
          />
        )}
      </div>
    </LegacyScope>
  );
};

export default ProfileEditPage;