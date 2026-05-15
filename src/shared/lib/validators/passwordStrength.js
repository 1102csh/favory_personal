// src/shared/lib/validators/passwordStrength.js
import { PASSWORD_STRENGTH } from '../../../features/auth/constants/authConstants';

/**
 * 비밀번호 강도를 4가지 기준으로 평가합니다.
 * - 길이 12자 이상
 * - 영문 포함
 * - 숫자 포함
 * - 특수문자 포함
 *
 * @param {string} password
 * @returns {{ level: 'weak'|'medium'|'strong', score: number }}
 */
export const evaluatePasswordStrength = (password) => {
  if (!password) return { level: PASSWORD_STRENGTH.WEAK, score: 0 };

  const checks = [
    password.length >= 12,
    /[A-Za-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9\s]/.test(password),
  ];

  const score = checks.filter(Boolean).length;

  if (score <= 2) return { level: PASSWORD_STRENGTH.WEAK, score };
  if (score === 3) return { level: PASSWORD_STRENGTH.MEDIUM, score };
  return { level: PASSWORD_STRENGTH.STRONG, score };
};