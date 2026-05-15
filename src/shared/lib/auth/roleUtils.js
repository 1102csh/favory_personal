// src/shared/lib/auth/roleUtils.js

/**
 * 사용자 권한 체크 헬퍼.
 *
 * 권한 위계:
 *   admin > artisan > customer
 *
 * admin은 artisan의 모든 기능을 포함합니다.
 * artisan 전용 분기 시 hasArtisanAccess를 사용하면 admin도 자동 통과.
 *
 * admin 전용 기능(매거진 작성 등)에는 isAdminRole 사용.
 */

const ROLES = Object.freeze({
  CUSTOMER: 'customer',
  ARTISAN: 'artisan',
  ADMIN: 'admin',
});

/**
 * profile 또는 role 문자열을 받아서 admin 여부 반환.
 *
 * @param {{ role?: string }|string|null|undefined} profileOrRole
 * @returns {boolean}
 */
export const isAdminRole = (profileOrRole) => {
  const role = extractRole(profileOrRole);
  return role === ROLES.ADMIN;
};

/**
 * 작가 기능 접근 가능 여부 (artisan + admin).
 *
 * @param {{ role?: string }|string|null|undefined} profileOrRole
 * @returns {boolean}
 */
export const hasArtisanAccess = (profileOrRole) => {
  const role = extractRole(profileOrRole);
  return role === ROLES.ARTISAN || role === ROLES.ADMIN;
};

/**
 * 작가 role 그 자체인지 (admin 제외).
 * 거의 사용하지 않지만, "작가만 (admin 제외)" 분기가 필요한 드문 경우용.
 *
 * @param {{ role?: string }|string|null|undefined} profileOrRole
 * @returns {boolean}
 */
export const isArtisanRoleOnly = (profileOrRole) => {
  const role = extractRole(profileOrRole);
  return role === ROLES.ARTISAN;
};

export { ROLES };

// ─────────────────────────────────────────────────
const extractRole = (input) => {
  if (!input) return null;
  if (typeof input === 'string') return input;
  return input.role ?? null;
};