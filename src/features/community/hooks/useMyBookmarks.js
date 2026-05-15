// src/features/community/hooks/useMyBookmarks.js
import { useEffect, useState, useCallback, useRef } from 'react';
import { postBookmarkService } from '../services/postBookmarkService';

/**
 * 본인이 저장한 게시글 목록 훅.
 * 커서 기반 무한 스크롤 지원.
 */
export const useMyBookmarks = ({ pageSize = 20 } = {}) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // race guard
  const requestIdRef = useRef(0);

  const fetchPage = useCallback(
    async ({ reset = false } = {}) => {
      const reqId = ++requestIdRef.current;
      if (reset) {
        setIsLoading(true);
        setHasMore(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const cursor = reset
        ? null
        : posts[posts.length - 1]?.bookmarked_at ?? null;

      try {
        const data = await postBookmarkService.listMyBookmarks({
          limit: pageSize,
          cursor,
        });

        if (reqId !== requestIdRef.current) return; // stale

        if (reset) {
          setPosts(data);
        } else {
          setPosts((prev) => [...prev, ...data]);
        }

        if (data.length < pageSize) setHasMore(false);
      } catch (e) {
        if (reqId !== requestIdRef.current) return;
        setError(e);
      } finally {
        if (reqId === requestIdRef.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [pageSize, posts]
  );

  // 최초 로드
  useEffect(() => {
    fetchPage({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(() => {
    if (isLoading || isLoadingMore || !hasMore) return;
    fetchPage({ reset: false });
  }, [isLoading, isLoadingMore, hasMore, fetchPage]);

  const reload = useCallback(() => {
    fetchPage({ reset: true });
  }, [fetchPage]);

  // 옵티미스틱 업데이트용 — 북마크 해제 시 목록에서 제거
  const replacePost = useCallback((postId, patcher) => {
    setPosts((prev) =>
      prev
        .map((p) => (p.id === postId ? patcher(p) : p))
        .filter((p) => p.is_bookmarked_by_me)  // 해제된 글은 즉시 제거
    );
  }, []);

  return {
    posts,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    reload,
    replacePost,
  };
};