// src/shared/hooks/useInfiniteScroll.js
import { useEffect, useRef } from 'react';

/**
 * 센티넬 요소가 화면에 보이면 콜백을 호출하는 훅.
 *
 * 사용:
 *   const sentinelRef = useInfiniteScroll(loadMore, { enabled: hasMore && !isLoading });
 *   <div ref={sentinelRef} aria-hidden style={{ height: 1 }} />
 *
 * @param {() => void} onIntersect
 * @param {{ enabled?: boolean, rootMargin?: string }} options
 */
export const useInfiniteScroll = (onIntersect, { enabled = true, rootMargin = '300px' } = {}) => {
  const sentinelRef = useRef(null);
  const callbackRef = useRef(onIntersect);
  callbackRef.current = onIntersect;

  useEffect(() => {
    if (!enabled) return;
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callbackRef.current();
      },
      { rootMargin }
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return sentinelRef;
};