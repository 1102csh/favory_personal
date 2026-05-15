// src/shared/config/env.js

/**
 * 환경 변수 접근 단일 진입점.
 * import.meta.env에 직접 접근하는 코드는 이 파일 외부에 존재해서는 안 됩니다.
 */
const requireEnv = (key) => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`[ENV] Missing required env variable: ${key}`);
  }
  return value;
};

export const env = Object.freeze({
  supabase: {
    url: requireEnv('VITE_SUPABASE_URL'),
    anonKey: requireEnv('VITE_SUPABASE_ANON_KEY'),
  },
  oauth: {
    // 네이버는 자체 구현이므로 클라이언트 ID 필요
    naverClientId: import.meta.env.VITE_NAVER_CLIENT_ID ?? '',
    naverRedirectUri: import.meta.env.VITE_NAVER_REDIRECT_URI ?? '',
  },
  app: {
    baseUrl: import.meta.env.VITE_APP_BASE_URL ?? 'http://localhost:5173',
  },
});