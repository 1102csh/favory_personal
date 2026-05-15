// src/shared/lib/formatters/relativeTime.js

/**
 * 상대 시간 포맷.
 * "방금 전" / "5분 전" / "2시간 전" / "3일 전" / "2024.03.15"
 */
export const formatRelativeTime = (iso) => {
  if (!iso) return '';
  const target = new Date(iso);
  const now = new Date();
  const diffMs = now - target;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return '방금 전';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}일 전`;

  // 1주일 이상은 절대 날짜로
  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const d = String(target.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
};