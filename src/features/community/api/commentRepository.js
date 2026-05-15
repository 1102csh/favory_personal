// src/features/community/api/commentRepository.js
import { supabase } from '@/shared/api/supabaseClient';

export const commentRepository = {
  /**
   * 게시글의 댓글 목록 (1단 + 대댓글 모두).
   * 클라이언트에서 parent_id로 그룹핑해서 트리로 표시.
   */
  async listByPost(postId) {
    return supabase
      .from('post_comments')
      .select(`
        *,
        author:profiles!post_comments_author_id_fkey (
          id, nickname, avatar_url, role
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
  },

  async create(input) {
    return supabase
      .from('post_comments')
      .insert(input)
      .select(`
        *,
        author:profiles!post_comments_author_id_fkey (
          id, nickname, avatar_url, role
        )
      `)
      .single();
  },

  async update(commentId, content) {
    return supabase
      .from('post_comments')
      .update({ content })
      .eq('id', commentId)
      .select()
      .single();
  },

  async softDelete(commentId) {
    return supabase
      .from('post_comments')
      .update({ is_deleted: true })
      .eq('id', commentId);
  },
};