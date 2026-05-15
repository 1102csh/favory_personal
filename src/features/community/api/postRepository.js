// src/features/community/api/postRepository.js
import { supabase } from '@/shared/api/supabaseClient';

/**
 * Posts 테이블 접근 Repository.
 * RLS 적용. 본인 글만 수정/삭제 가능.
 */
export const postRepository = {
  /**
   * 피드 조회 (커서 기반 페이징).
   * 작성자 정보 + 내가 좋아요 눌렀는지 함께 반환.
   *
   * @param {{ cursor?: string, category?: string, limit?: number }} options
   */
  async getFeed({ cursor = null, category = null, limit = 20 } = {}) {
    return supabase.rpc('get_feed_posts', {
      p_limit: limit,
      p_cursor: cursor,
      p_category: category,
    });
  },

  /**
   * 단일 게시글 조회 (작성자 정보 포함).
   */
  async getById(postId) {
    return supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey (
          id, nickname, avatar_url, role
        )
      `)
      .eq('id', postId)
      .eq('is_deleted', false)
      .single();
  },

  /**
   * 매거진 글 목록 (최신순). 캐러셀/큐레이션용 (public).
   */
  async listMagazines({ limit = 5 } = {}) {
    return supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey (
          id, nickname, avatar_url, role
        )
      `)
      .eq('post_type', 'magazine')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  /**
   * 매거진 관리용 전체 목록 (admin 페이지) — 페이지네이션·삭제글 포함.
   */
  async listMagazinesForAdmin({ limit = 50 } = {}) {
    return supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey (
          id, nickname, avatar_url, role
        )
      `)
      .eq('post_type', 'magazine')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  /**
   * 특정 사용자가 작성한 게시글 목록.
   */
  async listByAuthor(authorId, { limit = 20, cursor = null } = {}) {
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey (
          id, nickname, avatar_url, role
        )
      `)
      .eq('author_id', authorId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (cursor) query = query.lt('created_at', cursor);

    return query;
  },

  /**
   * 게시글 생성.
   */
  async create(input) {
    return supabase.from('posts').insert(input).select().single();
  },

  /**
   * 게시글 수정.
   */
  async update(postId, patch) {
    return supabase
      .from('posts')
      .update(patch)
      .eq('id', postId)
      .select()
      .single();
  },

  /**
   * 게시글 삭제 (soft delete).
   */
  async softDelete(postId) {
    return supabase
      .from('posts')
      .update({ is_deleted: true })
      .eq('id', postId);
  },

  /**
 * 조회수 증가.
 * fire-and-forget 패턴: 결과를 기다리지 않고 호출만.
 * 실패해도 사용자 흐름에 영향 없어야 함.
 */
  async incrementViewCount(postId) {
    return supabase.rpc('increment_post_view_count', { p_post_id: postId });
  },
};