import { supabase } from '../../../shared/api/supabaseClient';

export const feedRepository = {
  // 1. 작성한 피드 목록 조회 (작성자 ID 기준)
  async getFeedsByAuthor(authorId) {
    const { data, error } = await supabase
      .from('feeds')
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`소식을 불러오지 못했습니다: ${error.message}`);
    return data;
  },

  // 2. 새 소식 작성 (이미지 포함 시 image_url 전달)
  async createFeed(feedData) {
    const { data, error } = await supabase
      .from('feeds')
      .insert([feedData])
      .select()
      .single();

    if (error) throw new Error(`소식 업로드에 실패했습니다: ${error.message}`);
    return data;
  },

  // 3. 소식 삭제
  async deleteFeed(feedId) {
    const { error } = await supabase
      .from('feeds')
      .delete()
      .eq('id', feedId);

    if (error) throw new Error(`소식 삭제에 실패했습니다: ${error.message}`);
  }
};