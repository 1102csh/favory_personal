// src/features/profile/hooks/useArtistPosts.js
import { useEffect, useState, useCallback } from 'react';
import { postRepository } from '@/features/community/api/postRepository';

/**
 * 특정 작가의 게시글 목록 조회.
 *
 * @param {string} authorId
 * @param {{ limit?: number }} [options]
 * @returns {{
 *   posts: object[],
 *   isLoading: boolean,
 *   error: Error|null,
 *   reload: () => void,
 * }}
 */
export const useArtistPosts = (authorId, { limit = 20 } = {}) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    if (!authorId) {
      setPosts([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } =
        await postRepository.listByAuthor(authorId, { limit });
      if (fetchError) throw fetchError;
      setPosts(data ?? []);
    } catch (e) {
      setError(e);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [authorId, limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    isLoading,
    error,
    reload: fetchPosts,
  };
};