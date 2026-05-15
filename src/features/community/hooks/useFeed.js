// src/features/community/hooks/useFeed.js
import { useCallback, useEffect, useRef, useState } from 'react';
import { postService } from '../services/postService';
import { POST_LIMITS, POST_TYPES } from '../constants/postConstants';

/**
 * post_type 필터 적용 헬퍼.
 *   null              → 필터 없음
 *   'magazine'        → 매거진만
 *   'exclude_magazine'→ 매거진 제외 (일반 소식)
 *
 * ⚠️ 현재는 fetch 후 클라이언트 측 필터. 백엔드 RPC가 p_post_type을 지원하면
 *    이 함수 호출을 제거하고 service 인자로 넘기는 형태로 교체 가능.
 */
const applyPostTypeFilter = (posts, postType) => {
  if (!postType) return posts;
  if (postType === 'magazine') {
    return posts.filter((p) => p.post_type === POST_TYPES.MAGAZINE);
  }
  if (postType === 'exclude_magazine') {
    return posts.filter((p) => p.post_type !== POST_TYPES.MAGAZINE);
  }
  return posts;
};

/**
 * 피드 조회 훅.
 *
 * 상태:
 *   posts        - 누적된 게시글 배열
 *   isLoading    - 첫 페이지 로딩 중
 *   isLoadingMore- 추가 페이지 로딩 중
 *   error        - 에러 객체
 *   hasMore      - 다음 페이지 존재 여부
 *
 * 액션:
 *   reload()                 - 처음부터 다시 (필터 변경 시)
 *   loadMore()               - 다음 페이지
 *   prependPost(post)        - 새 글 작성 후 피드 상단 추가
 *   replacePost(id, patch)   - 좋아요 수, 댓글 수 등 부분 업데이트
 *   removePost(id)           - 삭제 후 즉시 제거
 *
 * @param {{ category?: string|null, postType?: string|null }} options
 *   - postType: 'magazine' | 'exclude_magazine' | null
 */
export const useFeed = ({ category = null, postType = null } = {}) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // race condition 방지용 — 가장 최근 요청만 결과 반영
  const requestIdRef = useRef(0);

  // 커서는 서버 RPC가 반환한 원본 데이터의 마지막 created_at 기준으로 유지해야 함
  // (postType 필터로 가려진 항목도 cursor 계산에 포함되어야 페이지가 끊기지 않음)
  const lastFetchedCursorRef = useRef(null);

  const fetchFirstPage = useCallback(async () => {
    const myRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const data = await postService.fetchFeed({
        category,
        limit: POST_LIMITS.pageSize,
      });
      if (requestIdRef.current !== myRequestId) return;
      lastFetchedCursorRef.current = data.length ? data[data.length - 1].created_at : null;
      setPosts(applyPostTypeFilter(data, postType));
      setHasMore(data.length === POST_LIMITS.pageSize);
    } catch (e) {
      if (requestIdRef.current !== myRequestId) return;
      setError(e);
    } finally {
      if (requestIdRef.current === myRequestId) setIsLoading(false);
    }
  }, [category, postType]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    if (!lastFetchedCursorRef.current) return;

    const myRequestId = ++requestIdRef.current;
    setIsLoadingMore(true);
    try {
      const data = await postService.fetchFeed({
        cursor: lastFetchedCursorRef.current,
        category,
        limit: POST_LIMITS.pageSize,
      });
      if (requestIdRef.current !== myRequestId) return;

      lastFetchedCursorRef.current = data.length
        ? data[data.length - 1].created_at
        : lastFetchedCursorRef.current;

      const filteredFresh = applyPostTypeFilter(data, postType);

      // 중복 방지 (커서 경계에서 같은 글이 들어올 수 있음)
      setPosts((prev) => {
        const existing = new Set(prev.map((p) => p.id));
        const merged = filteredFresh.filter((p) => !existing.has(p.id));
        return [...prev, ...merged];
      });
      setHasMore(data.length === POST_LIMITS.pageSize);
    } catch (e) {
      if (requestIdRef.current !== myRequestId) return;
      setError(e);
    } finally {
      if (requestIdRef.current === myRequestId) setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, category, postType]);

  // 카테고리/포스트타입 변경 시 처음부터 재조회
  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  // ----- 낙관적 업데이트 헬퍼 -----
  const prependPost = useCallback((post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  // patch는 객체 또는 (current) => next 형태의 patcher 함수 모두 허용
  const replacePost = useCallback((postId, patch) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return typeof patch === 'function' ? patch(p) : { ...p, ...patch };
      })
    );
  }, []);

  const removePost = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  return {
    posts,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    reload: fetchFirstPage,
    loadMore,
    prependPost,
    replacePost,
    removePost,
  };
};