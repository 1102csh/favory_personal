// src/features/profile/hooks/useUserProfile.js
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { profileQueryService } from '../services/profileQueryService';

/**
 * 사용자 프로필 조회 훅.
 *
 * 본인 프로필이면 AuthProvider의 currentProfile을 normalize해서 반환.
 * 타인 프로필이면 Supabase에서 fetch.
 *
 * @param {string} userId  - 조회할 사용자 ID (라우트 파라미터)
 * @returns {{
 *   profile: object|null,
 *   isLoading: boolean,
 *   error: Error|null,
 *   isOwnProfile: boolean,
 *   reload: () => void,
 * }}
 */
export const useUserProfile = (userId) => {
  const { user, profile: currentProfile, refreshProfile } = useAuth();

  const isOwnProfile = useMemo(
    () => Boolean(user && userId && user.id === userId),
    [user, userId]
  );

  // ====== 본인 프로필 — currentProfile에서 즉시 ======
  // AuthProvider가 이미 fetch한 데이터를 normalize만 해서 사용
  const ownProfileNormalized = useMemo(() => {
    if (!isOwnProfile || !currentProfile) return null;
    return {
      id: currentProfile.id,
      nickname: currentProfile.nickname,
      handle: currentProfile.handle ?? null,
      bio: currentProfile.bio ?? '',
      avatarUrl: currentProfile.avatar_url ?? null,
      coverImageUrl: currentProfile.cover_image_url ?? null,
      role: currentProfile.role ?? 'customer',
      tags: Array.isArray(currentProfile.tags) ? currentProfile.tags : [],
      socialLinks:
        currentProfile.social_links && typeof currentProfile.social_links === 'object'
          ? currentProfile.social_links
          : {},
      createdAt: currentProfile.created_at,
    };
  }, [isOwnProfile, currentProfile]);

  // ====== 타인 프로필 — RPC fetch ======
  const [otherProfile, setOtherProfile] = useState(null);
  const [isLoadingOther, setIsLoadingOther] = useState(false);
  const [errorOther, setErrorOther] = useState(null);

  const fetchOtherProfile = useCallback(async () => {
    if (!userId || isOwnProfile) return;

    setIsLoadingOther(true);
    setErrorOther(null);
    try {
      const data = await profileQueryService.fetchPublicProfile(userId);
      setOtherProfile(data);
    } catch (e) {
      setErrorOther(e);
      setOtherProfile(null);
    } finally {
      setIsLoadingOther(false);
    }
  }, [userId, isOwnProfile]);

  useEffect(() => {
    fetchOtherProfile();
  }, [fetchOtherProfile]);

  // ====== reload ======
  const reload = useCallback(async () => {
    if (isOwnProfile) {
      await refreshProfile();
    } else {
      await fetchOtherProfile();
    }
  }, [isOwnProfile, refreshProfile, fetchOtherProfile]);

  // ====== 결과 통합 ======
  if (isOwnProfile) {
    return {
      profile: ownProfileNormalized,
      isLoading: !currentProfile,        // AuthProvider 로딩 중일 때
      error: null,
      isOwnProfile: true,
      reload,
    };
  }

  return {
    profile: otherProfile,
    isLoading: isLoadingOther,
    error: errorOther,
    isOwnProfile: false,
    reload,
  };
};