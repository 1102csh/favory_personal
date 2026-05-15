// src/features/community/components/PostAuthorInfo/PostAuthorInfo.jsx
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { formatRelativeTime } from '@/shared/lib/formatters/relativeTime';
import { hasArtisanAccess } from '@/shared/lib/auth/roleUtils';
import styles from './PostAuthorInfo.module.scss';

/**
 * 작성자 아바타 + 닉네임 + 작성 시간.
 *
 * @param {object} props
 * @param {object} props.author          - { id, nickname, avatar_url, role }
 * @param {string} props.timestamp       - ISO datetime
 * @param {'sm'|'md'} [props.size='md']
 */
const PostAuthorInfo = ({ author, timestamp, size = 'md' }) => {
  const isArtisan = hasArtisanAccess(author);
  const initial = (author?.nickname ?? '?').charAt(0);

  return (
    <div className={clsx(styles.wrapper, styles[`size-${size}`])}>
      <Link
        to={`/users/${author?.id}`}
        className={styles.avatar}
        aria-label={`${author?.nickname} 프로필 보기`}
      >
        {author?.avatar_url ? (
          <img src={author.avatar_url} alt="" className={styles.avatarImg} />
        ) : (
          <span className={styles.avatarFallback}>{initial}</span>
        )}
      </Link>

      <div className={styles.meta}>
        <div className={styles.nameRow}>
          <Link to={`/users/${author?.id}`} className={styles.name}>
            {author?.nickname ?? '알 수 없음'}
          </Link>
          {isArtisan && <span className={styles.badge}>작가</span>}
        </div>
        <time className={styles.time} dateTime={timestamp}>
          {formatRelativeTime(timestamp)}
        </time>
      </div>
    </div>
  );
};

export default PostAuthorInfo;