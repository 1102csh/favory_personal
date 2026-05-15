// src/features/products/api/productRepository.js
//
// Products 접근 Repository.
//
// ⚠️ 현재는 mock 단일 상품을 반환하는 임시 구현.
//    Supabase products 테이블이 정식화되면 다음과 같이 교체:
//
//      async getById(productId) {
//        return supabase
//          .from('products')
//          .select('*, artist:profiles!products_artist_id_fkey ( id, nickname, ... )')
//          .eq('id', productId)
//          .eq('is_deleted', false)
//          .single();
//      }
//
// 시그니처는 supabase의 { data, error } 형태로 유지 — 서비스 레이어에서 동일하게 처리.

import { PRODUCT_DETAIL_MOCK } from '../data/productDetailMock';

// Mock 응답에 약간의 지연을 두어 loading 상태가 실제로 노출되게 함.
const MOCK_LATENCY_MS = 120;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const productRepository = {
  /**
   * 단일 상품 조회.
   *
   * @param {string} productId
   * @returns {Promise<{ data: object|null, error: object|null }>}
   */
  async getById(_productId) {
    await delay(MOCK_LATENCY_MS);
    // 현재는 id에 관계없이 동일 mock 반환. 추후 supabase 호출로 교체.
    return { data: PRODUCT_DETAIL_MOCK, error: null };
  },
};
