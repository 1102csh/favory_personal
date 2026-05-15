// src/features/auth/api/profileRepository.js
import { supabase } from '../../../shared/api/supabaseClient';

/**
 * profiles 테이블 접근 Repository.
 * RLS가 적용되므로 호출 전 인증된 세션이 필요합니다 (단, RPC는 예외).
 */
export const profileRepository = {
  /**
   * 본인 프로필 조회 (RLS에 의해 본인만 가능).
   * 모든 컬럼 반환 — 민감 정보 포함.
   */
  async getProfileById(userId) {
    return supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  },

  /**
   * 닉네임 사용 가능 여부 (RPC).
   * Supabase 함수 시그니처는 is_nickname_available(p_nickname text) — 파라미터 키 일치 필요.
   * 결과를 boolean으로 풀어서 반환. RPC 실패 시 throw.
   */
  async isNicknameAvailable(nickname) {
    const { data, error } = await supabase.rpc('is_nickname_available', {
      p_nickname: nickname,
    });
    if (error) throw error;
    return Boolean(data);
  },

  /**
   * 본인 프로필 업데이트.
   * RLS에 의해 본인만 가능. 변경 가능한 필드만 patch에 포함.
   *
   * @param {string} userId
   * @param {Partial<{
   *   nickname: string,
   *   bio: string,
   *   handle: string,
   *   avatar_url: string,
   *   cover_image_url: string,
   *   tags: string[],
   *   social_links: Record<string, string>,
   * }>} patch
   */
  async updateProfile(userId, patch) {
    return supabase
      .from('profiles')
      .update(patch)
      .eq('id', userId)
      .select()
      .single();
  },

  /**
   * handle 중복 확인.
   * 자기 자신의 handle은 제외하고 체크 (편집 시 본인 handle 그대로 두는 경우 통과).
   *
   * @param {string} handle
   * @param {string} excludeUserId  - 본인 user_id (제외 대상)
   */
  async isHandleAvailable(handle, excludeUserId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('handle', handle)
      .neq('id', excludeUserId)
      .maybeSingle();

    if (error) return { available: null, error };
    return { available: !data, error: null };
  },
};