// src/features/community/components/CommentList/CommentList.jsx
import CommentItem from '../CommentItem';
import styles from './CommentList.module.scss';

/**
 * 댓글 트리(1단 + 대댓글) 렌더링.
 *
 * @param {object} props
 * @param {Array} props.tree                          - useComments가 반환하는 트리
 * @param {(comment) => boolean} props.isOwnComment
 * @param {(parentId, content) => Promise<void>} props.onReply
 * @param {(commentId) => Promise<void>} props.onDelete
 */
const CommentList = ({ tree, isOwnComment, onReply, onDelete }) => {
  if (tree.length === 0) {
    return (
      <p className={styles.empty}>아직 댓글이 없습니다. 첫 댓글을 남겨보세요.</p>
    );
  }

  return (
    <ul className={styles.list} aria-label="댓글 목록">
      {tree.map((comment) => (
        <li key={comment.id} className={styles.listItem}>
          <CommentItem
            comment={comment}
            canReply
            isOwn={isOwnComment(comment)}
            onReply={(content) => onReply(comment.id, content)}
            onDelete={onDelete}
          />
          {comment.replies.length > 0 && (
            <ul className={styles.replyList} aria-label="답글 목록">
              {comment.replies.map((reply) => (
                <li key={reply.id}>
                  <CommentItem
                    comment={reply}
                    isReply
                    isOwn={isOwnComment(reply)}
                    onDelete={onDelete}
                  />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CommentList;