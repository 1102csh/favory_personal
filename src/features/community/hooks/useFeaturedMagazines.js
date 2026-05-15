// src/features/community/hooks/useFeaturedMagazines.js
import { useCallback, useEffect, useRef, useState } from 'react';
import { postService } from '../services/postService';

/**
 * 캐러셀 노출용 최근 매거진 목록.
 *
 * @param {{ limit?: number, enabled?: boolean }} options
 */
export const useFeaturedMagazines = ({ limit = 5, enabled = true } = {}) => {
  const [magazines, setMagazines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    if (!enabled) {
      setMagazines([]);
      return;
    }
    const myRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const data = await postService.fetchFeaturedMagazines({ limit });
      if (requestIdRef.current !== myRequestId) return;
      setMagazines(data);
    } catch (e) {
      if (requestIdRef.current !== myRequestId) return;
      setError(e);
    } finally {
      if (requestIdRef.current === myRequestId) setIsLoading(false);
    }
  }, [limit, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { magazines, isLoading, error, reload: load };
};
