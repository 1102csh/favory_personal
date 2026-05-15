// src/features/community/hooks/usePostBookmark.js
import { useCallback, useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { postBookmarkService } from '../services/postBookmarkService';

/**
 * 게시글 북마크 토글 훅.
 *
 * @param {{
 *   onLocalUpdate?: (postId: string, patcher: (post) => post) => void,
 *   onRequireLogin?: () => void,
 * }} options
 */
export const usePostBookmark = ({
  onLocalUpdate,
  onRequireLogin,
} = {}) => {
  const { user } = useAuth();
  const [pending, setPending] = useState(new Set());

  const isPending = useCallback((postId) => pending.has(postId), [pending]);

  const toggleBookmark = useCallback(
    async (post) => {
      if (!user) {
        onRequireLogin?.();
        return;
      }
      if (pending.has(post.id)) return;

      setPending((prev) => {
        const next = new Set(prev);
        next.add(post.id);
        return next;
      });

      const wasBookmarked = !!post.is_bookmarked_by_me;

      // 옵티미스틱
      onLocalUpdate?.(post.id, (current) => ({
        ...current,
        is_bookmarked_by_me: !wasBookmarked,
      }));

      try {
        await postBookmarkService.toggleBookmark({
          postId: post.id,
          userId: user.id,
          currentBookmarked: wasBookmarked,
        });
      } catch (e) {
        // 롤백
        onLocalUpdate?.(post.id, (current) => ({
          ...current,
          is_bookmarked_by_me: wasBookmarked,
        }));
        console.error('[bookmark] toggle failed:', e);
      } finally {
        setPending((prev) => {
          const next = new Set(prev);
          next.delete(post.id);
          return next;
        });
      }
    },
    [user, pending, onLocalUpdate, onRequireLogin]
  );

  return { toggleBookmark, isPending };
};