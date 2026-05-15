// src/features/community/components/MagazineCard/MagazineCard.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck, MoreHorizontal, Edit3, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/app/providers/AuthProvider';
import LikeButton from '../LikeButton';
import { POST_TYPE_LABELS, POST_TYPES } from '../../constants/postConstants';
import styles from './MagazineCard.module.scss';

const WORDS_PER_MINUTE = 500;   // 한글 분당 읽기 기준 (대략)

const estimateReadMinutes = (content) => {
  if (!content) return 1;
  const length = content.replace(/\s+/g, '').length;
  return Math.max(1, Math.round(length / WORDS_PER_MINUTE));
};

const formatRelativeOrDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffHours = (now - date) / (1000 * 60 * 60);

  if (diffHours < 24) return '오늘';
  if (diffHours < 48) return '어제';

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * 매거진 전용 카드.
 *
 * 디자인:
 *   - 상단에 큰 가로 이미지 (4:3 또는 5:4)
 *   - 본문 영역에 카테고리 칩 + 큰 제목 + 메타
 *   - 액션 바: 좋아요/댓글 + 북마크
 *
 * 일반 PostCard와의 주요 차이:
 *   - 작성자 아바타를 상단에 노출하지 않음
 *   - 제목이 본문보다 우선 (본문 미리보기 없음)
 *   - 큰 시각적 인상을 위한 비율
 */
const MagazineCard = ({
  post,
  onToggleLike,
  isLikePending = false,
  onToggleBookmark,
  isBookmarkPending = false,
  onDelete,
  linkToDetail = true,
  expandImages = false,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const author = post.author ?? {
    id: post.author_id,
    nickname: post.author_nickname,
    avatar_url: post.author_avatar_url,
    role: post.author_role,
  };

  const isAdmin = user && author.role === 'admin' && post.author_id === user.id;
  const isOwn = user && post.author_id === user.id;
  const canEdit = isOwn;

  // 이미지
  const images = post.attachments?.images ?? [];
  const coverImage = images[0]?.url;

  // 제목 — 매거진은 title 필드를 사용 (일반 글의 첫 줄 분리와 다름)
  const title = post.title || (post.content?.split('\n')[0] ?? '');

  // 메타
  const readMinutes = estimateReadMinutes(post.content);
  const dateLabel = formatRelativeOrDate(post.created_at);
  const authorLabel = author.nickname || 'FAVORY';

  const goToDetail = () => {
    if (linkToDetail) navigate(`/community/posts/${post.id}`);
  };

  const stopPropagation = (e) => e.stopPropagation();
  const isBookmarked = !!post.is_bookmarked_by_me;

  return (
    <article
      className={clsx(styles.card, linkToDetail && styles.clickable)}
      onClick={linkToDetail ? goToDetail : undefined}
      role={linkToDetail ? 'link' : undefined}
      tabIndex={linkToDetail ? 0 : undefined}
      onKeyDown={(e) => {
        if (linkToDetail && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          goToDetail();
        }
      }}
    >
      {/* 커버 이미지 */}
      {coverImage && (
        <div className={styles.imageBlock}>
          <img
            src={coverImage}
            alt=""
            className={styles.image}
            loading="lazy"
          />
        </div>
      )}

      {/* 본문 */}
      <div className={styles.body}>
        {/* 타입 칩 */}
        <div className={styles.chipRow}>
          <span className={styles.typeChip}>
            {POST_TYPE_LABELS[POST_TYPES.MAGAZINE]}
          </span>

          {canEdit && (
            <div className={styles.menuWrap} ref={menuRef} onClick={stopPropagation}>
              <button
                type="button"
                className={styles.menuTrigger}
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="더보기 메뉴"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <MoreHorizontal size={16} />
              </button>
              {menuOpen && (
                <div className={styles.menu} role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.menuItem}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      navigate(`/community/posts/${post.id}/edit`);
                    }}
                  >
                    <Edit3 size={14} /> 수정
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className={`${styles.menuItem} ${styles.menuItemDanger}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      if (window.confirm('이 매거진을 삭제하시겠습니까?')) {
                        onDelete?.(post.id);
                      }
                    }}
                  >
                    <Trash2 size={14} /> 삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 제목 */}
        <h3 className={styles.title}>{title}</h3>

        {/* 메타 */}
        <p className={styles.meta}>
          <span>{authorLabel}</span>
          <span className={styles.metaDivider}>·</span>
          <span>{readMinutes}분 읽기</span>
          {dateLabel && (
            <>
              <span className={styles.metaDivider}>·</span>
              <span>{dateLabel}</span>
            </>
          )}
        </p>
      </div>

      {/* 액션 바 */}
      <footer className={styles.actions} onClick={stopPropagation}>
        <div className={styles.actionsLeft}>
          <LikeButton
            isLiked={!!post.is_liked_by_me}
            count={post.like_count ?? 0}
            disabled={isLikePending || !user}
            onClick={() => onToggleLike?.(post)}
            size="sm"
          />
          <button
            type="button"
            className={styles.commentButton}
            onClick={goToDetail}
            aria-label="댓글 보기"
          >
            <span>💬</span>
            <span>{post.comment_count ?? 0}</span>
          </button>
        </div>

        <button
          type="button"
          className={clsx(styles.bookmarkButton, isBookmarked && styles.bookmarkButtonActive)}
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark?.(post);
          }}
          disabled={isBookmarkPending || !user}
          aria-label={isBookmarked ? '북마크 해제' : '북마크'}
          aria-pressed={isBookmarked}
        >
          {isBookmarked ? (
            <BookmarkCheck size={16} fill="currentColor" />
          ) : (
            <Bookmark size={16} />
          )}
        </button>
      </footer>
    </article>
  );
};

export default MagazineCard;