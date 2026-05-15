// src/shared/hooks/useThemePreference.js
import { useCallback, useEffect, useState } from 'react';
import {
  THEME_PREFERENCES,
  readStoredPreference,
  writeStoredPreference,
  applyThemeToDOM,
} from '../lib/theme/themePreference';

/**
 * 테마 선호도 훅.
 *
 * 반환값:
 *   preference          - 'light' | 'dark' | 'system'
 *   resolvedTheme       - 실제로 적용 중인 테마 (system 해석 결과)
 *   setPreference(next) - 선호도 변경 + 영속화 + DOM 적용
 */
export const useThemePreference = () => {
  const [preference, setPreferenceState] = useState(readStoredPreference);

  // system 선택 시 시스템 색상 변화에 반응하기 위한 상태
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemPrefersDark(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // preference 바뀔 때마다 DOM 동기화 — 다른 탭에서 변경 시 대응도 가능
  useEffect(() => {
    applyThemeToDOM(preference);
  }, [preference]);

  const setPreference = useCallback((next) => {
    writeStoredPreference(next);
    setPreferenceState(next);
  }, []);

  const resolvedTheme =
    preference === THEME_PREFERENCES.SYSTEM
      ? (systemPrefersDark ? THEME_PREFERENCES.DARK : THEME_PREFERENCES.LIGHT)
      : preference;

  return { preference, resolvedTheme, setPreference };
};
