// src/features/search/api/searchRepository.js
import { supabase } from '@/shared/api/supabaseClient';

export const searchRepository = {
  /**
   * 게시글 키워드 검색.
   */
  async searchPosts({ query, limit = 20, cursor = null }) {
    return supabase.rpc('search_posts', {
      p_query: query,
      p_limit: limit,
      p_cursor: cursor,
    });
  },

  /**
   * 사용자 검색.
   */
  async searchUsers({ query, limit = 10 }) {
    return supabase.rpc('search_users', {
      p_query: query,
      p_limit: limit,
    });
  },

  /**
   * 태그로 게시글 검색.
   */
  async findPostsByTag({ tag, limit = 20, cursor = null }) {
    return supabase.rpc('find_posts_by_tag', {
      p_tag: tag,
      p_limit: limit,
      p_cursor: cursor,
    });
  },
};