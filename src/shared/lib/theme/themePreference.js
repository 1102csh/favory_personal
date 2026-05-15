// src/shared/lib/theme/themePreference.js
//
// 테마 영속성·DOM 적용 헬퍼.
// localStorage 키는 index.html의 FOUC 방지 스크립트와 반드시 일치해야 합니다.

const STORAGE_KEY = 'app:theme-preference';

export const THEME_PREFERENCES = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
});

const VALID = new Set([
  THEME_PREFERENCES.LIGHT,
  THEME_PREFERENCES.DARK,
  THEME_PREFERENCES.SYSTEM,
]);

/**
 * 저장된 사용자 선호 테마. 없으면 'system'.
 */
export const readStoredPreference = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (VALID.has(raw)) return raw;
  } catch {
    // 사파리 프라이빗 모드 등에서 throw — silent fallback
  }
  return THEME_PREFERENCES.SYSTEM;
};

/**
 * 사용자 선호 테마 저장.
 */
export const writeStoredPreference = (preference) => {
  try {
    localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // ignore
  }
};

/**
 * <html data-theme> 속성 적용.
 *   light/dark → 명시
 *   system     → 속성 제거 (CSS의 prefers-color-scheme이 결정)
 */
export const applyThemeToDOM = (preference) => {
  const html = document.documentElement;
  if (preference === THEME_PREFERENCES.SYSTEM) {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', preference);
  }
};
