// src/features/products/hooks/useProduct.js
import { useCallback, useEffect, useRef, useState } from 'react';
import { productService } from '../services/productService';

/**
 * 단일 상품 조회 훅.
 *
 * 상태:
 *   product       - 상품 객체 (없으면 null)
 *   isLoading     - 로딩 중
 *   error         - ProductError 인스턴스 또는 null
 *
 * 액션:
 *   reload()
 *   replaceProduct(patch|patcher)  - 좋아요/저장 등 낙관적 부분 업데이트용
 *
 * @param {string} productId
 */
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(productId));
  const [error, setError] = useState(null);

  // race condition 방지
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      setIsLoading(false);
      return;
    }
    const myRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.fetchProduct(productId);
      if (requestIdRef.current !== myRequestId) return;
      setProduct(data);
    } catch (e) {
      if (requestIdRef.current !== myRequestId) return;
      setError(e);
      setProduct(null);
    } finally {
      if (requestIdRef.current === myRequestId) setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * 낙관적 업데이트.
   * patch: 객체 또는 (current) => next 함수
   */
  const replaceProduct = useCallback((patch) => {
    setProduct((prev) => {
      if (!prev) return prev;
      return typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
    });
  }, []);

  return {
    product,
    isLoading,
    error,
    reload: load,
    replaceProduct,
  };
};
