// src/features/search/services/searchService.js
import { searchRepository } from '../api/searchRepository';

export class SearchError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = 'SearchError';
    this.code = code;
    this.cause = cause;
  }
}

const MIN_QUERY_LENGTH = 2;

/**
 * 사용자 응답 데이터 normalize (snake → camel).
 */
const normalizeUser = (raw) => ({
  id: raw.id,
  nickname: raw.nickname,
  handle: raw.handle ?? null,
  bio: raw.bio ?? '',
  avatarUrl: raw.avatar_url ?? null,
  role: raw.role ?? 'customer',
  tags: Array.isArray(raw.tags) ? raw.tags : [],
});

export const searchService = {
  /**
   * 통합 검색 — 게시글 + 사용자 동시 조회.
   * 페이지 첫 진입 시 사용.
   *
   * @param {{ query: string, postLimit?: number, userLimit?: number }} args
   */
  async searchAll({ query, postLimit = 20, userLimit = 6 }) {
    const trimmed = (query ?? '').trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      throw new SearchError(
        'TOO_SHORT',
        `${MIN_QUERY_LENGTH}자 이상 입력해주세요.`
      );
    }

    // 병렬 호출
    const [postsResult, usersResult] = await Promise.all([
      searchRepository.searchPosts({ query: trimmed, limit: postLimit }),
      searchRepository.searchUsers({ query: trimmed, limit: userLimit }),
    ]);

    if (postsResult.error) {
      throw new SearchError('POSTS_FAILED', '게시글 검색에 실패했어요.', postsResult.error);
    }
    if (usersResult.error) {
      throw new SearchError('USERS_FAILED', '작가 검색에 실패했어요.', usersResult.error);
    }

    return {
      posts: postsResult.data ?? [],
      users: (usersResult.data ?? []).map(normalizeUser),
    };
  },

  /**
   * 게시글만 추가 페이지 로드 (무한 스크롤용).
   */
  async loadMorePosts({ query, cursor, limit = 20 }) {
    const trimmed = (query ?? '').trim();
    const { data, error } = await searchRepository.searchPosts({
      query: trimmed,
      limit,
      cursor,
    });
    if (error) throw new SearchError('POSTS_FAILED', '추가 로드에 실패했어요.', error);
    return data ?? [];
  },

  /**
   * 태그 검색 (정확 일치).
   * 1자도 허용.
   */
  async searchByTag({ tag, limit = 20, cursor = null }) {
    const trimmed = (tag ?? '').trim().replace(/^#+/, '');
    if (!trimmed) {
      throw new SearchError('EMPTY_TAG', '태그가 없습니다.');
    }
    const { data, error } = await searchRepository.findPostsByTag({
      tag: trimmed,
      limit,
      cursor,
    });
    if (error) throw new SearchError('TAG_FAILED', '태그 검색에 실패했어요.', error);
    return data ?? [];
  },
};