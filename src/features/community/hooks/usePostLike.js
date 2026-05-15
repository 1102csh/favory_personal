// src/features/community/hooks/usePostLike.js
import { useCallback, useState } from 'react';
import { postService } from '../services/postService';
import { useAuth } from '@/app/providers/AuthProvider';

/**
 * 좋아요 토글 훅.
 *
 * 사용:
 *   const { toggleLike, isPending } = usePostLike({ onLocalUpdate });
 *   <LikeButton onClick={() => toggleLike(post)} disabled={isPending} />
 *
 * @param {{ onLocalUpdate?: (postId, patch) => void }} options
 *   onLocalUpdate: 부모 상태(피드 배열)를 즉시 갱신하기 위한 콜백.
 *                  보통 useFeed의 replacePost를 전달.
 */
export const usePostLike = ({ onLocalUpdate } = {}) => {
  const { user } = useAuth();
  const [pendingIds, setPendingIds] = useState(new Set());

  const toggleLike = useCallback(
    async (post) => {
      if (!user) return;
      if (pendingIds.has(post.id)) return; // 중복 클릭 방지

      const wasLiked = post.is_liked_by_me;
      const optimisticPatch = {
        is_liked_by_me: !wasLiked,
        like_count: Math.max(0, post.like_count + (wasLiked ? -1 : 1)),
      };

      // 1) 낙관적 업데이트
      onLocalUpdate?.(post.id, optimisticPatch);
      setPendingIds((prev) => new Set(prev).add(post.id));

      try {
        await postService.toggleLike({
          postId: post.id,
          userId: user.id,
          isCurrentlyLiked: wasLiked,
        });
        // 성공 — 트리거가 like_count를 정확히 갱신했으나
        // 우리 로컬 값도 +1/-1 이므로 일치. 별도 동기화 불필요.
      } catch (e) {
        // 2) 실패 시 롤백
        onLocalUpdate?.(post.id, {
          is_liked_by_me: wasLiked,
          like_count: post.like_count,
        });
        console.error('toggleLike failed', e);
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(post.id);
          return next;
        });
      }
    },
    [user, pendingIds, onLocalUpdate]
  );

  const isPending = useCallback(
    (postId) => pendingIds.has(postId),
    [pendingIds]
  );

  return { toggleLike, isPending };
};