// src/features/auth/services/phoneVerificationService.js
import { phoneAuthRepository } from '../api/phoneAuthRepository';
import { normalizePhone } from '../../../shared/lib/validators/phoneFormatter';

/**
 * 전화번호 인증 비즈니스 로직.
 * 발송 제한, 재시도 쿨다운 등의 정책이 여기에 모입니다.
 */
export const phoneVerificationService = {
  async requestCode(phone) {
    const normalized = normalizePhone(phone);
    // TODO: 발송 횟수 제한, IP 기반 rate limiting 등은 서버에서 처리
    return phoneAuthRepository.requestVerification(normalized);
  },

  async verifyCode(requestId, code) {
    return phoneAuthRepository.verifyCode(requestId, code);
  },
};