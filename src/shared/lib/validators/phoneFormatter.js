// src/shared/lib/validators/phoneFormatter.js

/**
 * 입력된 전화번호 문자열에서 숫자만 추출.
 * Supabase/DB에는 정규화된 형태로 저장 권장.
 *
 * @param {string} raw
 * @returns {string}
 */
export const normalizePhone = (raw) => raw.replace(/\D/g, '');

/**
 * 화면 표시용 포맷터: 01012345678 → 010-1234-5678
 * @param {string} raw
 * @returns {string}
 */
export const formatPhone = (raw) => {
  const digits = normalizePhone(raw);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};