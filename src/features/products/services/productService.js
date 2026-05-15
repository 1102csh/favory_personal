// src/features/products/services/productService.js
import { productRepository } from '../api/productRepository';
import { PRODUCT_MESSAGES, PRODUCT_ERROR_CODES } from '../constants/productConstants';

class ProductError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = 'ProductError';
    this.code = code;
    this.cause = cause;
  }
}

export { ProductError };

const mapError = (error, fallbackMessage) => {
  if (!error) return null;
  return new ProductError(
    PRODUCT_ERROR_CODES.UNKNOWN,
    fallbackMessage ?? PRODUCT_MESSAGES.errors.unknown,
    error,
  );
};

export const productService = {
  /**
   * 단일 상품 조회.
   *
   * @param {string} productId
   * @returns {Promise<object>} normalized product
   *
   * @throws {ProductError} code: 'PRODUCT_NOT_FOUND' 또는 'PRODUCT_ERROR'
   */
  async fetchProduct(productId) {
    if (!productId) {
      throw new ProductError(
        PRODUCT_ERROR_CODES.NOT_FOUND,
        PRODUCT_MESSAGES.errors.notFound,
      );
    }

    const { data, error } = await productRepository.getById(productId);

    if (error) {
      // Supabase PGRST116 = single row 없음 → NOT_FOUND로 매핑
      if (error.code === 'PGRST116' || error.code === PRODUCT_ERROR_CODES.NOT_FOUND) {
        throw new ProductError(
          PRODUCT_ERROR_CODES.NOT_FOUND,
          PRODUCT_MESSAGES.errors.notFound,
          error,
        );
      }
      throw mapError(error, PRODUCT_MESSAGES.errors.fetchFail);
    }

    if (!data) {
      throw new ProductError(
        PRODUCT_ERROR_CODES.NOT_FOUND,
        PRODUCT_MESSAGES.errors.notFound,
      );
    }

    return data;
  },
};
