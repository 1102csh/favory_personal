// src/features/community/services/commentService.js
import { commentRepository } from '../api/commentRepository';
import { POST_MESSAGES } from '../constants/postConstants';
import { PostError } from './postService';

const mapError = (error, fallbackMessage) =>
  error ? new PostError('COMMENT_ERROR', fallbackMessage ?? POST_MESSAGES.errors.unknown, error) : null;

export const commentService = {
  /**
   * 게시글의 모든 댓글을 가져와 트리 구조로 정리.
   * 반환 형태: [{ ...comment, replies: [...] }]
   */
  async fetchTree(postId) {
    const { data, error } = await commentRepository.listByPost(postId);
    if (error) throw mapError(error, '댓글을 불러오지 못했습니다.');

    const list = data ?? [];
    const topLevel = [];
    const repliesByParent = new Map();

    for (const c of list) {
      if (c.parent_id) {
        if (!repliesByParent.has(c.parent_id)) {
          repliesByParent.set(c.parent_id, []);
        }
        repliesByParent.get(c.parent_id).push(c);
      } else {
        topLevel.push(c);
      }
    }

    return topLevel.map((c) => ({
      ...c,
      replies: repliesByParent.get(c.id) ?? [],
    }));
  },

  async createComment({ postId, authorId, content, parentId = null }) {
    const { data, error } = await commentRepository.create({
      post_id: postId,
      author_id: authorId,
      content,
      parent_id: parentId,
    });
    if (error) {
      if (error.message?.includes('COMMENT_DEPTH_EXCEEDED')) {
        throw new PostError('DEPTH_EXCEEDED', '대댓글의 대댓글은 작성할 수 없습니다.', error);
      }
      throw mapError(error, '댓글 작성에 실패했습니다.');
    }
    return data;
  },

  async updateComment(commentId, content) {
    const { data, error } = await commentRepository.update(commentId, content);
    if (error) throw mapError(error, '댓글 수정에 실패했습니다.');
    return data;
  },

  async deleteComment(commentId) {
    const { error } = await commentRepository.softDelete(commentId);
    if (error) throw mapError(error, '댓글 삭제에 실패했습니다.');
  },
};