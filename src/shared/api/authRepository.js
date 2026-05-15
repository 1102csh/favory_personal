// src/features/auth/api/authRepository.js
import { supabase } from '../../../shared/api/supabaseClient';
import { env } from '../../../shared/config/env';

/**
 * Supabase Auth 호출만 담당하는 Repository.
 * 이 레이어는 Supabase SDK에만 의존하며, React/도메인 로직과 격리됩니다.
 */
export const authRepository = {
  /**
   * 이메일/비밀번호 회원가입.
   * user_metadata에 닉네임/전화번호를 저장하지만, profiles 테이블에도 별도 insert 필요.
   */
  async signUpWithEmail({ email, password, metadata }) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // user_metadata로 저장됨
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

  async sendPasswordResetEmail(email) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.app.baseUrl}/auth/reset-password`,
    });
  },

  /**
   * OAuth 로그인. provider: 'google' | 'kakao' | 'naver'(자체구현)
   * Supabase가 지원하는 provider만 처리. 네이버는 별도 함수에서.
   */
  async signInWithOAuth(provider) {
    return supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${env.app.baseUrl}/auth/callback` },
    });
  },

  async getSession() {
    return supabase.auth.getSession();
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};