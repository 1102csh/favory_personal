// src/features/community/api/postBookmarkRepository.js
import { supabase } from '@/shared/api/supabaseClient';

export const postBookmarkRepository = {
  /**
   * 북마크 추가.
   */
  async add(postId, userId) {
    return supabase
      .from('post_bookmarks')
      .insert({ post_id: postId, user_id: userId })
      .select()
      .single();
  },

  /**
   * 북마크 제거.
   */
  async remove(postId, userId) {
    return supabase
      .from('post_bookmarks')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
  },

  /**
   * 본인이 해당 게시글을 북마크했는지 확인.
   */
  async hasBookmarked(postId, userId) {
    const { data, error } = await supabase
      .from('post_bookmarks')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) return { bookmarked: null, error };
    return { bookmarked: !!data, error: null };
  },

  /**
   * 본인이 저장한 게시글 목록 (RPC 호출).
   */
  async listMyBookmarks({ limit = 20, cursor = null } = {}) {
    return supabase.rpc('get_user_bookmarks', {
      p_limit: limit,
      p_cursor: cursor,
    });
  },
};