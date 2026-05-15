// src/features/community/hooks/useComments.js
import { useCallback, useEffect, useState } from 'react';
import { commentService } from '../services/commentService';
import { useAuth } from '@/app/providers/AuthProvider';

/**
 * 게시글의 댓글 트리 + CRUD를 관리하는 훅.
 *
 * @param {string} postId
 */
export const useComments = (postId) => {
  const { user, profile } = useAuth();

  const [tree, setTree] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await commentService.fetchTree(postId);
      setTree(data);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) reload();
  }, [postId, reload]);

  /**
   * 댓글/대댓글 작성.
   * 서버 응답으로 받은 정확한 객체를 트리에 삽입.
   */
  const createComment = useCallback(
    async ({ content, parentId = null }) => {
      if (!user) throw new Error('로그인이 필요합니다.');

      const newComment = await commentService.createComment({
        postId,
        authorId: user.id,
        content,
        parentId,
      });

      // 응답에 author가 join되어 옴. 트리에 삽입.
      setTree((prev) => {
        if (!parentId) {
          // 1단 댓글 — 끝에 추가
          return [...prev, { ...newComment, replies: [] }];
        }
        // 대댓글 — 해당 부모의 replies에 추가
        return prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...c.replies, newComment] }
            : c
        );
      });

      return newComment;
    },
    [postId, user]
  );

  /**
   * 댓글 수정. 본문만 즉시 업데이트.
   */
  const updateComment = useCallback(async (commentId, content) => {
    await commentService.updateComment(commentId, content);

    setTree((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return { ...c, content, updated_at: new Date().toISOString() };
        }
        // 대댓글에서도 찾기
        return {
          ...c,
          replies: c.replies.map((r) =>
            r.id === commentId
              ? { ...r, content, updated_at: new Date().toISOString() }
              : r
          ),
        };
      })
    );
  }, []);

  /**
   * 댓글 삭제 (soft delete).
   * UI에서는 "삭제된 댓글입니다"로 표시하기 위해 트리에서 제거하지 않고
   * is_deleted 플래그만 토글.
   */
  const deleteComment = useCallback(async (commentId) => {
    await commentService.deleteComment(commentId);

    setTree((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return { ...c, is_deleted: true };
        }
        return {
          ...c,
          replies: c.replies.map((r) =>
            r.id === commentId ? { ...r, is_deleted: true } : r
          ),
        };
      })
    );
  }, []);

  /**
   * 본인 댓글 여부 판단.
   */
  const isOwnComment = useCallback(
    (comment) => user && comment.author_id === user.id,
    [user]
  );

  return {
    tree,
    isLoading,
    error,
    reload,
    createComment,
    updateComment,
    deleteComment,
    isOwnComment,
    currentUser: { user, profile },
  };
};