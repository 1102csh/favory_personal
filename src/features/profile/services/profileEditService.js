// src/features/profile/services/profileEditService.js
import { profileRepository } from '@/features/auth/api/profileRepository';
import { ProfileError } from './profileQueryService';
import { normalizeTags } from '../lib/tagUtils';

const MESSAGES = {
  nicknameTaken: '이미 사용 중인 닉네임입니다.',
  handleTaken: '이미 사용 중인 핸들입니다.',
  unknown: '프로필 저장에 실패했습니다.',
};

/**
 * Supabase의 unique violation을 우리 에러로 변환.
 * - 23505: unique_violation
 */
const mapDbError = (error) => {
  if (!error) return null;
  if (error.code === '23505') {
    if (error.message?.includes('nickname')) {
      return new ProfileError('NICKNAME_TAKEN', MESSAGES.nicknameTaken, error);
    }
    if (error.message?.includes('handle')) {
      return new ProfileError('HANDLE_TAKEN', MESSAGES.handleTaken, error);
    }
  }
  return new ProfileError('UPDATE_FAILED', MESSAGES.unknown, error);
};

/**
 * 입력값을 DB 저장 형태로 변환.
 * - 빈 문자열 → null (handle, bio 등 nullable 컬럼)
 * - tags 정규화
 * - social_links에서 빈 값 제거
 */
const buildPatch = (input) => {
  const patch = {};

  if ('nickname' in input) {
    patch.nickname = input.nickname.trim();
  }
  if ('bio' in input) {
    const bio = input.bio?.trim();
    patch.bio = bio || null;
  }
  if ('handle' in input) {
    const handle = input.handle?.trim().toLowerCase();
    patch.handle = handle || null;
  }
  if ('avatarUrl' in input) {
    const url = input.avatarUrl?.trim();
    patch.avatar_url = url || null;
  }
  if ('coverImageUrl' in input) {
    const url = input.coverImageUrl?.trim();
    patch.cover_image_url = url || null;
  }
  if ('tags' in input) {
    patch.tags = normalizeTags(input.tags ?? []);
  }
  if ('socialLinks' in input) {
    // 빈 값 제거
    const cleaned = Object.entries(input.socialLinks ?? {})
      .filter(([, v]) => v && v.trim())
      .reduce((acc, [k, v]) => {
        acc[k] = v.trim();
        return acc;
      }, {});
    patch.social_links = cleaned;
  }

  return patch;
};

export const profileEditService = {
  /**
   * 본인 프로필 업데이트.
   *
   * @param {string} userId
   * @param {object} input  - { nickname?, bio?, handle?, avatarUrl?, coverImageUrl?, tags?, socialLinks? }
   * @returns {Promise<object>} 업데이트된 프로필
   */
  async updateOwnProfile(userId, input) {
    const patch = buildPatch(input);

    const { data, error } = await profileRepository.updateProfile(userId, patch);
    if (error) throw mapDbError(error);
    return data;
  },

  /**
   * handle 중복 미리 검사 (제출 전 실시간 검증용).
   * 본인 자신의 handle은 사용 가능으로 처리.
   *
   * @returns {Promise<{ available: boolean }>}
   */
  async checkHandleAvailable(handle, ownUserId) {
    if (!handle) return { available: true };

    const { available, error } =
      await profileRepository.isHandleAvailable(handle.toLowerCase(), ownUserId);
    if (error) throw new ProfileError('CHECK_FAILED', '핸들 확인 중 오류', error);
    return { available };
  },
};