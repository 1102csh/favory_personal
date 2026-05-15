// src/features/auth/api/phoneAuthRepository.js

/**
 * 전화번호 인증 Repository (Mock 구현).
 *
 * ⚠️ 현재는 메모리 기반 Mock입니다.
 * 추후 Supabase Edge Function + 국내 SMS API 연동 시
 * 이 파일의 구현체만 교체하면 됩니다 (인터페이스 동일 유지).
 *
 * 인터페이스:
 *   requestVerification(phone): Promise<{ requestId: string, expiresAt: number }>
 *   verifyCode(requestId, code): Promise<{ verified: boolean }>
 */

const mockStore = new Map(); // requestId -> { phone, code, expiresAt }

const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));
const generateRequestId = () =>
  `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const phoneAuthRepository = {
  async requestVerification(phone) {
    const requestId = generateRequestId();
    const code = generateCode();
    const expiresAt = Date.now() + 3 * 60 * 1000; // 3분

    mockStore.set(requestId, { phone, code, expiresAt });

    // 🔧 개발 편의: 콘솔에 출력. 실제 연동 시 SMS 발송으로 대체.
    console.log(`[Mock SMS] ${phone} → 인증번호: ${code}`);

    return { requestId, expiresAt };
  },

  async verifyCode(requestId, code) {
    const entry = mockStore.get(requestId);
    if (!entry) return { verified: false, reason: 'not_found' };
    if (Date.now() > entry.expiresAt) {
      mockStore.delete(requestId);
      return { verified: false, reason: 'expired' };
    }
    if (entry.code !== code) return { verified: false, reason: 'mismatch' };

    mockStore.delete(requestId);
    return { verified: true };
  },
};