// src/shared/api/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

/**
 * Supabase 클라이언트 싱글턴.
 * 외부에서는 반드시 이 인스턴스만 사용해야 합니다.
 */
export const supabase = createClient(
  env.supabase.url,
  env.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // OAuth 콜백 자동 감지
    },
  }
);