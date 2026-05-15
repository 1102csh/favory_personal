// src/features/community/hooks/usePost.js
import { useCallback, useEffect, useRef, useState } from 'react';
import { postService } from '../services/postService';

/**
 * 단일 게시글 조회 훅.
 *
 * 상태:
 *   post         - 게시글 (작성자/카운트/is_liked_by_me/is_bookmarked_by_me 포함)
 *   isLoading    - 로딩 중
 *   error        - 에러 객체
 *
 * 액션:
 *   reload()                     - 다시 가져오기
 *   replacePost(patch|patcher)   - 좋아요·북마크 등 낙관적 부분 업데이트
 *
 * @param {string} postId
 * @param {string} [viewerId]  - 좋아요 여부 조회용
 */
export const usePost = (postId, viewerId) => {
  const [post, setPost] = useState(null);
  // postId가 없으면 로딩 상태 자체가 false — 호출자가 무한 로딩 보지 않도록
  const [isLoading, setIsLoading] = useState(Boolean(postId));
  const [error, setError] = useState(null);

  // race condition 방지
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    if (!postId) {
      setPost(null);
      setIsLoading(false);
      return;
    }
    const myRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const data = await postService.fetchPost(postId, viewerId);
      if (requestIdRef.current !== myRequestId) return;
      setPost(data);
    } catch (e) {
      if (requestIdRef.current !== myRequestId) return;
      setError(e);
    } finally {
      if (requestIdRef.current === myRequestId) setIsLoading(false);
    }
  }, [postId, viewerId]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * 낙관적 업데이트.
   * patch: 객체 또는 (current) => next 함수
   */
  const replacePost = useCallback((idOrPatch, maybePatch) => {
    // 시그니처 유연: (patch) 또는 (id, patch)
    // FeedPage의 replacePost(id, patch)와 호환되도록 (id, patch) 형태도 받음
    const patch = maybePatch === undefined ? idOrPatch : maybePatch;
    setPost((prev) => {
      if (!prev) return prev;
      // (id, patch) 형식일 때 id 검사
      if (maybePatch !== undefined && prev.id !== idOrPatch) return prev;
      return typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
    });
  }, []);

  return {
    post,
    isLoading,
    error,
    reload: load,
    replacePost,
  };
};
