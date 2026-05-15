import { supabase } from '@/shared/api/supabaseClient';
import { hasArtisanAccess } from '@/shared/lib/auth/roleUtils';

export const myPageRepository = {
  // 1. 마이페이지 데이터 불러오기
  async getMyPageData() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('로그인이 필요합니다.');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, nickname, avatar_url, role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error('프로필 정보를 불러올 수 없습니다.');
      }

      return {
        id: profile.id,
        email: profile.email || user.email,
        nickname: profile.nickname || '고객',
        profileImage: profile.avatar_url || null, 
        isSeller: hasArtisanAccess(profile),
        storeName: profile.nickname,
        points: 0,
        coupons: 0,
      };

    } catch (error) {
      console.error('마이페이지 데이터 호출 실패:', error);
      throw error;
    }
  },

  // ✨ 2. 프로필 이미지 업로드 로직
  async uploadProfileImage(userId, file) {
    try {
      // 파일 이름 무작위 생성 (중복 덮어쓰기 방지)
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;

      // Supabase Storage의 'avatars' 버킷에 업로드
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 퍼블릭 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // 프로필 테이블 업데이트
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      return publicUrl;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      throw error;
    }
  }
};