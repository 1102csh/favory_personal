// src/features/search/lib/searchHistory.js

const STORAGE_KEY = 'favory:search-history';
const MAX_ITEMS = 10;

/**
 * 최근 검색어 관리 (localStorage).
 *
 * 형태: [{ query, type, timestamp }, ...]
 * type: 'q' (일반 검색) | 'tag' (태그)
 */
export const searchHistory = {
  list() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  add(query, type = 'q') {
    if (!query?.trim()) return;
    const trimmed = query.trim();

    try {
      const current = this.list();
      // 같은 query+type 중복 제거
      const filtered = current.filter(
        (item) => !(item.query === trimmed && item.type === type)
      );
      // 최근 항목을 맨 앞에
      const updated = [
        { query: trimmed, type, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_ITEMS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage 사용 불가 환경 — 무시
    }
  },

  remove(query, type) {
    try {
      const current = this.list();
      const filtered = current.filter(
        (item) => !(item.query === query && item.type === type)
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};