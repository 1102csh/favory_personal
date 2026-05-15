// src/shared/hooks/useTheme.js
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'app:theme-preference';
const VALID = ['light', 'dark', 'system'];

const readStoredPreference = () => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return VALID.includes(v) ? v : 'system';
  } catch {
    return 'system';
  }
};

const writeStoredPreference = (pref) => {
  try { localStorage.setItem(STORAGE_KEY, pref); } catch { /* ignore */ }
};

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyThemeAttribute = (preference) => {
  const root = document.documentElement;
  if (preference === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', preference);
  }
};

/**
 * 테마 훅.
 *
 * preference: 사용자가 선택한 값 ('light' | 'dark' | 'system')
 * resolvedTheme: 실제 적용된 값 ('light' | 'dark')
 */
export const useTheme = () => {
  const [preference, setPreference] = useState(readStoredPreference);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // preference 변경 → DOM/저장소 반영
  useEffect(() => {
    applyThemeAttribute(preference);
    writeStoredPreference(preference);
  }, [preference]);

  const resolvedTheme = preference === 'system' ? systemTheme : preference;

  const setTheme = useCallback((next) => {
    if (VALID.includes(next)) setPreference(next);
  }, []);

  const toggle = useCallback(() => {
    setPreference((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { preference, resolvedTheme, setTheme, toggle };
};