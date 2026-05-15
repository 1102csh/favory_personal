// src/shared/lib/errors/AuthError.js

/**
 * 인증 관련 도메인 에러.
 * code는 UI에서 분기처리에 사용, message는 사용자에게 노출됩니다.
 */
export class AuthError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.cause = cause;
  }
}

export const AUTH_ERROR_CODES = Object.freeze({
  EMAIL_DUPLICATED: 'EMAIL_DUPLICATED',
  NICKNAME_DUPLICATED: 'NICKNAME_DUPLICATED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_CONFIRMED: 'EMAIL_NOT_CONFIRMED',
  PHONE_NOT_VERIFIED: 'PHONE_NOT_VERIFIED',
  OAUTH_FAILED: 'OAUTH_FAILED',
  NETWORK: 'NETWORK',
  UNKNOWN: 'UNKNOWN',
});