import { supabase } from '../../../shared/api/supabaseClient';

export const homeRepository = {
  // 활성화된 배너만 순서대로 가져오기
  async getActiveBanners() {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true });

      if (error) throw error;

      // 💡 해결 포인트: FeaturedBanner가 좋아하는 이름표로 바꿔서 내보냅니다!
      return data.map(banner => ({
        id: banner.id,
        name: banner.title,          // ✨ title 대신 name 으로!
        category: banner.subtitle,   // ✨ subtitle 대신 category (또는 description) 으로!
        image: banner.image_url,     
        link: banner.link_url,
        bgColor: banner.bg_color
      }));
    } catch (error) {
      console.error('Banner Fetch Error:', error);
      return [];
    }
  }
};