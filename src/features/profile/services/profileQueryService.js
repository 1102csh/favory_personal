// src/features/profile/services/profileQueryService.js
import { profileQueryRepository } from '../api/profileQueryRepository';

/**
 * Profile 도메인 에러.
 */
export class ProfileError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = 'ProfileError';
    this.code = code;
    this.cause = cause;
  }
}

const MESSAGES = {
  notFound: '사용자를 찾을 수 없습니다.',
  unknown: '프로필 정보를 불러오는 중 오류가 발생했습니다.',
};

const mapError = (error, fallback) =>
  new ProfileError('PROFILE_ERROR', fallback ?? MESSAGES.unknown, error);

/**
 * 응답 데이터 정규화.
 * - tags / social_links 가 null인 경우 안전한 기본값
 * - role이 없으면 'customer'로
 */
const normalizeProfile = (raw) => {
  if (!raw) return null;
  return {
    id: raw.id,
    nickname: raw.nickname,
    handle: raw.handle ?? null,
    bio: raw.bio ?? '',
    avatarUrl: raw.avatar_url ?? null,
    coverImageUrl: raw.cover_image_url ?? null,
    role: raw.role ?? 'customer',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    socialLinks:
      raw.social_links && typeof raw.social_links === 'object'
        ? raw.social_links
        : {},
    createdAt: raw.created_at,
  };
};

export const profileQueryService = {
  /**
   * user_id로 공개 프로필 조회.
   *
   * @param {string} userId
   * @throws {ProfileError} NOT_FOUND
   */
  async fetchPublicProfile(userId) {
    if (!userId) {
      throw new ProfileError('INVALID_INPUT', '사용자 ID가 필요합니다.');
    }

    const { data, error } = await profileQueryRepository.getPublicProfileById(userId);
    if (error) throw mapError(error);
    if (!data) {
      throw new ProfileError('NOT_FOUND', MESSAGES.notFound);
    }
    return normalizeProfile(data);
  },

  /**
   * handle로 공개 프로필 조회. (향후 /@handle 라우팅용)
   */
  async fetchPublicProfileByHandle(handle) {
    if (!handle) {
      throw new ProfileError('INVALID_INPUT', 'handle이 필요합니다.');
    }

    const { data, error } = await profileQueryRepository.getPublicProfileByHandle(handle);
    if (error) throw mapError(error);
    if (!data) {
      throw new ProfileError('NOT_FOUND', MESSAGES.notFound);
    }
    return normalizeProfile(data);
  },
};