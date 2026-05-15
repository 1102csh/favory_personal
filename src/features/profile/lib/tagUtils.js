// src/features/profile/lib/tagUtils.js

/**
 * 태그 입력값 정규화.
 * - 앞뒤 공백 제거
 * - 선두 # 제거
 * - 내부 공백을 단일 _로 변환 (또는 그대로 둘 수도 있음 — 정책 결정)
 * - 중복 제거
 * - 빈 값 제거
 *
 * @param {string[]} tags
 * @returns {string[]}
 */
export const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  const cleaned = tags
    .map((t) => String(t).trim().replace(/^#+/, '').trim())
    .filter(Boolean);
  return Array.from(new Set(cleaned));
};

/**
 * 단일 태그 유효성.
 * 너무 길거나 특정 문자 포함 시 reject.
 */
export const isValidTag = (tag) => {
  if (typeof tag !== 'string') return false;
  const t = tag.trim();
  if (t.length === 0 || t.length > 30) return false;
  // 줄바꿈/탭/슬래시 등 제외
  if (/[\n\t\\/]/.test(t)) return false;
  return true;
};

/**
 * 표시용 — 항상 # 접두사 부여.
 */
export const formatTagDisplay = (tag) =>
  tag.startsWith('#') ? tag : `#${tag}`;