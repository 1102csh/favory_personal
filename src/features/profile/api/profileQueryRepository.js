// src/features/profile/api/profileQueryRepository.js
import { supabase } from '@/shared/api/supabaseClient';

/**
 * 공개 프로필 조회 전용 Repository.
 * 본인이 아닌 다른 사용자의 프로필을 안전하게 가져오기 위함.
 *
 * RPC를 사용해 민감 정보(email, phone, 약관 동의 시각 등) 제외.
 */
export const profileQueryRepository = {
  /**
   * user_id로 공개 프로필 조회.
   *
   * @param {string} userId
   */
  async getPublicProfileById(userId) {
    const { data, error } = await supabase.rpc('get_user_public_profile', {
      p_user_id: userId,
    });
    if (error) return { data: null, error };

    // RPC는 setof 반환이라 배열. 첫 행 또는 null.
    return { data: data?.[0] ?? null, error: null };
  },

  /**
   * handle로 공개 프로필 조회.
   * 향후 /@handle 라우팅 추가 시 사용.
   */
  async getPublicProfileByHandle(handle) {
    const { data, error } = await supabase.rpc('get_user_by_handle', {
      p_handle: handle.toLowerCase(),
    });
    if (error) return { data: null, error };
    return { data: data?.[0] ?? null, error: null };
  },
};