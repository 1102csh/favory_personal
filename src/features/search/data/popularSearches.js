// src/features/search/data/popularSearches.js

/**
 * 인기 검색어 mock 데이터.
 *
 * ⚠️ 임시 데이터입니다. 추후 다음으로 교체:
 *   - get_popular_search_terms RPC (일정 기간 검색 횟수 집계)
 *   - 또는 어드민이 큐레이팅한 "추천 검색어"
 */
export const POPULAR_SEARCHES = Object.freeze([
  { type: 'tag', term: '도자기',       trend: 'up' },
  { type: 'tag', term: '뜨개',         trend: 'flat' },
  { type: 'tag', term: '캔들',         trend: 'up' },
  { type: 'q',   term: '원데이클래스', trend: 'up' },
  { type: 'tag', term: '자수',         trend: 'flat' },
  { type: 'q',   term: '서울 공방',    trend: 'flat' },
  { type: 'tag', term: '핸드메이드',   trend: 'flat' },
  { type: 'q',   term: '부산',         trend: 'down' },
]);