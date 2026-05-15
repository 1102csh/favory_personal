// src/features/products/constants/productConstants.js

export const PRODUCT_MESSAGES = Object.freeze({
  errors: {
    unknown:   '상품을 불러오는 중 문제가 발생했습니다.',
    notFound:  '상품을 찾을 수 없습니다.',
    fetchFail: '상품 정보를 불러오지 못했습니다.',
  },
});

export const PRODUCT_ERROR_CODES = Object.freeze({
  NOT_FOUND: 'PRODUCT_NOT_FOUND',
  UNKNOWN:   'PRODUCT_ERROR',
});
