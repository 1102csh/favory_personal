// src/features/community/components/WriteButton/WriteButton.jsx
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import clsx from 'clsx';
import styles from './WriteButton.module.scss';

/**
 * 게시글 작성 진입 버튼.
 *
 * @param {object} props
 * @param {'inline'|'fab'} [props.variant='inline']
 *   - inline: 헤더/툴바 인라인용
 *   - fab: 화면 우하단 고정 pill — 모바일·데스크톱 공통
 */
const WriteButton = ({ variant = 'inline' }) => {
  const navigate = useNavigate();

  if (variant === 'fab') {
    return (
      <button
        type="button"
        className={styles.fab}
        onClick={() => navigate('/community/write')}
      >
        <Pencil size={18} strokeWidth={2.25} aria-hidden />
        <span className={styles.fabLabel}>글쓰기</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={clsx(styles.button, styles.inline)}
      onClick={() => navigate('/community/write')}
    >
      <Pencil size={16} />
      <span>글쓰기</span>
    </button>
  );
};

export default WriteButton;