// src/features/community/components/LikeButton/LikeButton.jsx
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import styles from './LikeButton.module.scss';

/**
 * 좋아요 버튼.
 *
 * @param {object} props
 * @param {boolean} props.isLiked
 * @param {number} props.count
 * @param {boolean} [props.disabled]
 * @param {() => void} props.onClick
 * @param {'sm'|'md'} [props.size='md']
 */
const LikeButton = ({ isLiked, count, disabled, onClick, size = 'md' }) => {
  return (
    <button
      type="button"
      className={clsx(
        styles.button,
        styles[`size-${size}`],
        isLiked && styles.liked
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={isLiked ? '좋아요 취소' : '좋아요'}
      aria-pressed={isLiked}
    >
      <Heart
        size={size === 'sm' ? 16 : 18}
        fill={isLiked ? 'currentColor' : 'none'}
        className={styles.icon}
      />
      <span className={styles.count}>{count}</span>
    </button>
  );
};

export default LikeButton;