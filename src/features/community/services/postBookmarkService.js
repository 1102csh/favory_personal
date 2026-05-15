// src/features/community/services/postBookmarkService.js
import { postBookmarkRepository } from '../api/postBookmarkRepository';

export class BookmarkError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = 'BookmarkError';
    this.code = code;
    this.cause = cause;
  }
}

export const postBookmarkService = {
  /**
   * 북마크 토글. 현재 상태에 따라 add/remove 자동 분기.
   *
   * @param {{ postId: string, userId: string, currentBookmarked: boolean }} args
   * @returns {Promise<{ bookmarked: boolean }>}
   */
  async toggleBookmark({ postId, userId, currentBookmarked }) {
    if (!postId || !userId) {
      throw new BookmarkError('INVALID_INPUT', '필수 정보가 누락됐습니다.');
    }

    if (currentBookmarked) {
      const { error } = await postBookmarkRepository.remove(postId, userId);
      if (error) throw new BookmarkError('REMOVE_FAILED', '북마크 해제에 실패했어요.', error);
      return { bookmarked: false };
    } else {
      const { error } = await postBookmarkRepository.add(postId, userId);
      if (error) {
        // 23505: 이미 북마크된 상태 (race condition). 멱등 처리.
        if (error.code === '23505') {
          return { bookmarked: true };
        }
        throw new BookmarkError('ADD_FAILED', '북마크 추가에 실패했어요.', error);
      }
      return { bookmarked: true };
    }
  },

  /**
   * 본인이 저장한 게시글 목록.
   */
  async listMyBookmarks({ limit, cursor } = {}) {
    const { data, error } = await postBookmarkRepository.listMyBookmarks({ limit, cursor });
    if (error) throw new BookmarkError('FETCH_FAILED', '저장 목록을 불러올 수 없습니다.', error);
    return data ?? [];
  },
};