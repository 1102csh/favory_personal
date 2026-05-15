// src/features/auth/api/authRepository.js (보강된 전체)
import { supabase } from '@/shared/api/supabaseClient';
import { env } from '@/shared/config/env';

const SUPPORTED_OAUTH = ['google', 'kakao']; // 'naver'는 별도 구현

export const authRepository = {
  async signUpWithEmail({ email, password, metadata }) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${env.app.baseUrl}/auth/callback`,
      },
    });
  },

  async signInWithEmail({ email, password }) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    return supabase.auth.signOut();
  },

  /**
   * 비밀번호 재설정 메일 발송.
   * 메일의 링크는 /auth/reset-password로 라우팅되며,
   * 그 페이지에서 새 비밀번호를 입력받아 supabase.auth.updateUser로 변경.
   */
  async sendPasswordResetEmail(email) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.app.baseUrl}/auth/reset-password`,
    });
  },

  /** 새 비밀번호로 변경. 재설정 메일 링크로 진입한 세션 상태에서 호출. */
  async updatePassword(newPassword) {
    return supabase.auth.updateUser({ password: newPassword });
  },

  /** 이메일 인증 메일 재발송. */
  async resendSignupEmail(email) {
    return supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${env.app.baseUrl}/auth/callback` },
    });
  },

  async signInWithOAuth(provider) {
    if (!SUPPORTED_OAUTH.includes(provider)) {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    return supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${env.app.baseUrl}/auth/callback` },
    });
  },

  async getSession() { return supabase.auth.getSession(); },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};