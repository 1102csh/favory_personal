// src/features/search/hooks/useSearch.js
import { useEffect, useState, useCallback, useRef } from 'react';
import { searchService } from '../services/searchService';
import { searchHistory } from '../lib/searchHistory';
import { SEARCH_LIMITS } from '../constants/searchConstants';

/**
 * 검색 실행 훅.
 *
 * mode 'query' (q=...): 게시글 + 사용자 통합 검색
 * mode 'tag'   (tag=...): 게시글만 (태그 정확 일치)
 *
 * @param {{ query?: string, tag?: string }} params
 */
export const useSearch = ({ query, tag }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState('idle');
  const [results, setResults] = useState({ users: [], posts: [] });

  // race guard
  const requestIdRef = useRef(0);

  const mode = tag ? 'tag' : query ? 'query' : 'idle';
  const activeTerm = tag || query || '';

  // 최초 로드
  useEffect(() => {

    if (mode === 'idle') {
      setPosts([]);
      setUsers([]);
      setError(null);
      setHasMore(false);
      return;
    }

    const reqId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        if (mode === 'tag') {
          const data = await searchService.searchByTag({ tag, limit: 20 });
          if (reqId !== requestIdRef.current) return;
          setPosts(data);
          setUsers([]);
          setHasMore(data.length >= 20);
          searchHistory.add(tag, 'tag');
        } else {
          const result = await searchService.searchAll({ query, postLimit: 20, userLimit: 6 });
          if (reqId !== requestIdRef.current) return;
          setPosts(result.posts);
          setUsers(result.users);
          setHasMore(result.posts.length >= 20);
          searchHistory.add(query, 'q');
        }
      } catch (e) {
        if (reqId !== requestIdRef.current) return;
        setError(e);
        setPosts([]);
        setUsers([]);
        setHasMore(false);
      } finally {
        if (reqId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    })();
  }, [mode, query, tag]);

  // 추가 로드 (무한 스크롤)
  const loadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore) return;
    if (mode === 'idle') return;

    const lastPost = posts[posts.length - 1];
    if (!lastPost) return;

    setIsLoadingMore(true);
    try {
      const data =
        mode === 'tag'
          ? await searchService.searchByTag({
              tag,
              limit: 20,
              cursor: lastPost.created_at,
            })
          : await searchService.loadMorePosts({
              query,
              cursor: lastPost.created_at,
              limit: 20,
            });

      setPosts((prev) => [...prev, ...data]);
      if (data.length < 20) setHasMore(false);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore, hasMore, mode, posts, query, tag]);

  // 게시글 옵티미스틱 업데이트 (좋아요/북마크 토글용)
  const replacePost = useCallback((postId, patcher) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? patcher(p) : p)));
  }, []);

  return {
    mode,
    activeTerm,
    posts,
    users,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    replacePost,
  };
};