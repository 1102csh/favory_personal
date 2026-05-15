// src/features/community/components/CommentItem/CommentItem.jsx
import { useState } from 'react';
import { Trash2, MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import PostAuthorInfo from '../PostAuthorInfo';
import CommentInput from '../CommentInput';
import styles from './CommentItem.module.scss';

/**
 * 댓글 한 칸. 1단/대댓글 둘 다 사용.
 *
 * @param {object} props
 * @param {object} props.comment
 * @param {boolean} [props.isReply=false]    - 대댓글 여부 (들여쓰기 적용)
 * @param {boolean} [props.canReply=false]   - 답글 달기 버튼 노출 (1단에만 true)
 * @param {boolean} props.isOwn
 * @param {(content) => Promise<void>} [props.onReply]   - canReply=true일 때만 사용
 * @param {(commentId) => Promise<void>} [props.onDelete]
 */
const CommentItem = ({
  comment,
  isReply = false,
  canReply = false,
  isOwn,
  onReply,
  onDelete,
}) => {
  const [replying, setReplying] = useState(false);

  if (comment.is_deleted) {
    return (
      <div className={clsx(styles.deleted, isReply && styles.reply)}>
        삭제된 댓글입니다.
      </div>
    );
  }

  return (
    <div className={clsx(styles.item, isReply && styles.reply)}>
      <PostAuthorInfo
        author={comment.author}
        timestamp={comment.created_at}
        size="sm"
      />
      <p className={styles.content}>{comment.content}</p>

      <div className={styles.actions}>
        {canReply && (
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => setReplying((r) => !r)}
            aria-expanded={replying}
          >
            <MessageCircle size={13} />
            {replying ? '답글 취소' : '답글'}
          </button>
        )}
        {isOwn && (
          <button
            type="button"
            className={clsx(styles.actionBtn, styles.danger)}
            onClick={() => {
              if (window.confirm('이 댓글을 삭제하시겠습니까?')) {
                onDelete?.(comment.id);
              }
            }}
          >
            <Trash2 size={13} />
            삭제
          </button>
        )}
      </div>

      {replying && canReply && (
        <div className={styles.replyForm}>
          <CommentInput
            placeholder="답글을 입력해주세요"
            autoFocus
            submitLabel="답글 달기"
            onSubmit={async (content) => {
              await onReply(content);
              setReplying(false);
            }}
            onCancel={() => setReplying(false)}
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem;