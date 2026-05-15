// src/features/admin/hooks/useAdminMagazines.js
import { useCallback, useEffect, useRef, useState } from 'react';
import { postService } from '@/features/community/services/postService';

/**
 * 관리자용 매거진 목록 훅.
 * 삭제·수정 직후 reload할 수 있도록 단순한 fetch + 액션 헬퍼 노출.
 */
export const useAdminMagazines = ({ limit = 50 } = {}) => {
  const [magazines, setMagazines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const myRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const data = await postService.fetchMagazinesForAdmin({ limit });
      if (requestIdRef.current !== myRequestId) return;
      setMagazines(data);
    } catch (e) {
      if (requestIdRef.current !== myRequestId) return;
      setError(e);
    } finally {
      if (requestIdRef.current === myRequestId) setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    load();
  }, [load]);

  const removeOptimistic = useCallback((id) => {
    setMagazines((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { magazines, isLoading, error, reload: load, removeOptimistic };
};
