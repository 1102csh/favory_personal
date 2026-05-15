// src/features/community/components/PostCard/PostCard.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit3,
  MessageCircle,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  Trash2,
  Share2,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/app/providers/AuthProvider';
import LikeButton from '../LikeButton';
import PostAuthorInfo from '../PostAuthorInfo';
import PostAttachments from '../PostAttachments';
import { POST_TYPE_LABELS, POST_TYPES } from '../../constants/postConstants';
import styles from './PostCard.module.scss';

/**
 * 일반 게시글 카드.
 *
 * 레이아웃 순서 (위 → 아래):
 *   1) 작성자 + 메뉴
 *   2) 본문 텍스트 (첫 줄 제목 + 미리보기)
 *   3) 이미지 (있을 때만)
 *   4) 게시글 분류 칩 (타입/카테고리) — 액션 바 바로 위
 *   5) 액션 바 (좋아요/댓글/북마크)
 *
 * @param {object} props
 * @param {object} props.post
 * @param {(post) => void} [props.onToggleLike]
 * @param {boolean} [props.isLikePending]
 * @param {(post) => void} [props.onToggleBookmark]
 * @param {boolean} [props.isBookmarkPending]
 * @param {(postId) => void} [props.onDelete]
 * @param {boolean} [props.linkToDetail=true]
 * @param {boolean} [props.expandImages=false]
 *   - true: 모든 이미지 노출 (상세 페이지용)
 *   - false: 첫 이미지만 + "+N" 표시 (피드용)
 * @param {boolean} [props.expanded=false]
 *   - true: 제목/본문 line-clamp 해제 (상세 페이지용)
 * @param {() => void} [props.onShare]
 *   - 제공 시 액션 바에 공유 버튼 노출
 */
const PostCard = ({
  post,
  onToggleLike,
  isLikePending = false,
  onToggleBookmark,
  isBookmarkPending = false,
  onDelete,
  onShare,
  linkToDetail = true,
  expandImages = false,
  expanded = false,
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

  // 작성자 정보 (RPC 평탄형 + nested 형 모두 지원)
  const author = post.author ?? {
    id: post.author_id,
    nickname: post.author_nickname,
    avatar_url: post.author_avatar_url,
    role: post.author_role,
  };

  const isOwn = user && post.author_id === user.id;
  const showTypeBadge = post.post_type && post.post_type !== POST_TYPES.GENERAL;

  // 이미지
  const images = post.attachments?.images ?? [];
  const firstImage = images[0]?.url;
  const hasMultipleImages = images.length > 1;
  // 외부 링크
  const externalLinks = post.attachments?.external_links ?? [];
  const showAllImages = expandImages && hasMultipleImages;
  // 피드 모드(상세 페이지가 아닌 경우)에서 다중 이미지 그리드 노출용
  const gridImages = images.slice(0, 4);
  const gridOverflow = Math.max(0, images.length - gridImages.length);

  // 본문 — 첫 줄을 제목으로, 나머지는 미리보기
  const lines = (post.content ?? '').split('\n').filter(Boolean);
  const firstLine = lines[0] ?? '';
  const restText = lines.slice(1).join('\n');

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
      {/* ===== 1) 헤더: 작성자 + 메뉴 ===== */}
      <header className={styles.header}>
        <PostAuthorInfo
          author={author}
          timestamp={post.created_at}
          size="sm"
        />

        {/* 본인 글: 더보기 메뉴 */}
        {isOwn && (
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
                    if (window.confirm('이 게시글을 삭제하시겠습니까?')) {
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
      </header>

      {/* ===== 2) 본문 텍스트 ===== */}
      {(firstLine || restText) && (
        <div className={styles.content}>
          {firstLine && (
            <p className={clsx(styles.title, expanded && styles.titleExpanded)}>
              {firstLine}
            </p>
          )}
          {restText && (
            <p className={clsx(styles.text, expanded && styles.textExpanded)}>
              {restText}
            </p>
          )}
        </div>
      )}

      {/* ===== 3) 이미지 ===== */}
      {/* 피드 모드: 1장은 풀폭, 2장 이상은 그리드 (최대 4장 + 초과분 오버레이) */}
      {!showAllImages && images.length === 1 && (
        <div className={styles.imageBlock}>
          <img
            src={firstImage}
            alt=""
            className={styles.image}
            loading="lazy"
          />
        </div>
      )}

      {!showAllImages && images.length >= 2 && (
        <div
          className={styles.imageGrid}
          data-count={gridImages.length}
        >
          {gridImages.map((img, idx) => {
            const isLastVisible = idx === gridImages.length - 1;
            const showOverlay = isLastVisible && gridOverflow > 0;
            return (
              <div key={`${img.url}-${idx}`} className={styles.imageCell}>
                <img
                  src={img.url}
                  alt=""
                  className={styles.imageCellImg}
                  loading="lazy"
                />
                {showOverlay && (
                  <div className={styles.imageCellOverlay} aria-hidden>
                    <span>+{gridOverflow}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 갤러리 모드 (상세 페이지) */}
      {showAllImages && (
        <div className={styles.galleryBlock}>
          {images.map((img, idx) => (
            <img
              key={`${img.url}-${idx}`}
              src={img.url}
              alt=""
              className={styles.galleryImage}
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* ===== 외부 링크 카드 ===== */}
      {externalLinks.length > 0 && (
        <div className={styles.linkSection} onClick={stopPropagation}>
          <PostAttachments attachments={{ external_links: externalLinks }} />
        </div>
      )}

      {/* ===== 4) 게시글 분류 칩 — 액션 바 바로 위 ===== */}
      {(showTypeBadge || post.category) && (
        <div className={styles.chipRow}>
          {showTypeBadge && (
            <span className={styles.typeBadge}>
              {POST_TYPE_LABELS[post.post_type]}
            </span>
          )}
          {post.category && (
            <span className={styles.categoryBadge}>#{post.category}</span>
          )}
        </div>
      )}

      {/* ===== 5) 액션 바 ===== */}
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
            <MessageCircle size={16} />
            <span>{post.comment_count ?? 0}</span>
          </button>
        </div>

        <div className={styles.actionsRight}>
          {onShare && (
            <button
              type="button"
              className={styles.iconActionButton}
              onClick={(e) => {
                e.stopPropagation();
                onShare(post);
              }}
              aria-label="공유"
              title="링크 복사"
            >
              <Share2 size={16} />
            </button>
          )}

          <button
            type="button"
            className={clsx(
              styles.bookmarkButton,
              isBookmarked && styles.bookmarkButtonActive
            )}
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
        </div>
      </footer>
    </article>
  );
};

export default PostCard;