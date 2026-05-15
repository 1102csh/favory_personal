// src/features/community/api/postLikeRepository.js
import { supabase } from '@/shared/api/supabaseClient';

export const postLikeRepository = {
    /**
     * 좋아요 추가. 이미 있으면 무시 (idempotent).
     */
    async like(postId, userId) {
        return supabase
            .from('post_likes')
            .insert({ post_id: postId, user_id: userId });
    },

    /**
     * 좋아요 취소.
     */
    async unlike(postId, userId) {
        return supabase
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', userId);
    },

    /**
     * 특정 게시글의 좋아요 누른 사용자 목록 (최신순).
     */
    async listByPost(postId, { limit = 50 } = {}) {
        return supabase
            .from('post_likes')
            .select(`
        created_at,
        user:profiles!post_likes_user_id_fkey (
          id, nickname, avatar_url
        )
      `)
            .eq('post_id', postId)
            .order('created_at', { ascending: false })
            .limit(limit);
    },

    // src/features/community/api/postLikeRepository.js (메서드 추가)
    async hasLiked(postId, userId) {
        const { data, error } = await supabase
            .from('post_likes')
            .select('post_id')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .maybeSingle();
        if (error) return false;
        return !!data;
    },
};