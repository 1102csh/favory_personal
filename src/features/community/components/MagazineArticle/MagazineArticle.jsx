// src/features/community/components/MagazineArticle/MagazineArticle.jsx
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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useAuth } from '@/app/providers/AuthProvider';
import { formatRelativeTime } from '@/shared/lib/formatters/relativeTime';
import LikeButton from '../LikeButton';

import styles from './MagazineArticle.module.scss';

const WORDS_PER_MINUTE = 500;

const estimateReadMinutes = (content) => {
  if (!content) return 1;
  const length = content.replace(/\s+/g, '').length;
  return Math.max(1, Math.round(length / WORDS_PER_MINUTE));
};

/**
 * 매거진 상세 렌더링. PostDetailPage에서 post_type === MAGAZINE일 때 사용.
 *
 * 일반 PostCard와 차이:
 *   - 상단에 큰 표지 이미지(hero)
 *   - 카테고리 + 큰 제목 + 작성자/시간/예상 읽기 시간 메타
 *   - 본문은 ReactMarkdown으로 렌더 (이미지·헤딩·인용 자유 배치)
 *   - 이미지 그리드 / 칩 / 본문 textarea 같은 일반 글 UI 미사용
 */
const MagazineArticle = ({
  post,
  onToggleLike,
  isLikePending = false,
  onToggleBookmark,
  isBookmarkPending = false,
  onShare,
  onDelete,
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

  const isOwn = user && post.author_id === user.id;
  const isBookmarked = !!post.is_bookmarked_by_me;
  const coverUrl =
    post.attachments?.cover_url ?? post.attachments?.images?.[0]?.url ?? null;
  const readMinutes = estimateReadMinutes(post.content);
  const initial = (author?.nickname ?? '?').charAt(0);

  return (
    <article className={styles.article}>
      {/* 헤더 영역 — 표지 + 메타 + 제목 */}
      <header className={styles.header}>
        {coverUrl && (
          <div className={styles.coverWrap}>
            <img src={coverUrl} alt="" className={styles.cover} />
          </div>
        )}

        <div className={styles.headerBody}>
          <div className={styles.topRow}>
            <span className={styles.label}>FAVORY MAGAZINE</span>
            {post.category && (
              <span className={styles.category}>{post.category}</span>
            )}
          </div>

          <h1 className={styles.title}>{post.title}</h1>

          <div className={styles.metaRow}>
            <div
              className={styles.authorBlock}
              role={author.id ? 'button' : undefined}
              tabIndex={author.id ? 0 : undefined}
              onClick={() => author.id && navigate(`/users/${author.id}`)}
            >
              {author.avatar_url ? (
                <img src={author.avatar_url} alt="" className={styles.authorAvatar} />
              ) : (
                <span className={styles.authorAvatarFallback}>{initial}</span>
              )}
              <div className={styles.authorMeta}>
                <p className={styles.authorName}>{author.nickname ?? '편집부'}</p>
                <p className={styles.authorSub}>
                  {formatRelativeTime(post.created_at)} · {readMinutes}분 읽기
                </p>
              </div>
            </div>

            {isOwn && (
              <div className={styles.menuWrap} ref={menuRef}>
                <button
                  type="button"
                  className={styles.menuTrigger}
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label="더보기 메뉴"
                >
                  <MoreHorizontal size={18} />
                </button>
                {menuOpen && (
                  <div className={styles.menu} role="menu">
                    <button
                      type="button"
                      role="menuitem"
                      className={styles.menuItem}
                      onClick={() => {
                        setMenuOpen(false);
                        navigate(`/admin/magazine/${post.id}/edit`);
                      }}
                    >
                      <Edit3 size={14} /> 수정
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className={`${styles.menuItem} ${styles.menuItemDanger}`}
                      onClick={() => {
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
        </div>
      </header>

      {/* 본문 — Markdown */}
      <div className={styles.body}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content ?? ''}
        </ReactMarkdown>
      </div>

      {/* 액션 바 */}
      <footer className={styles.actions}>
        <div className={styles.actionsLeft}>
          <LikeButton
            isLiked={!!post.is_liked_by_me}
            count={post.like_count ?? 0}
            disabled={isLikePending || !user}
            onClick={() => onToggleLike?.(post)}
            size="md"
          />
          <button
            type="button"
            className={styles.commentButton}
            aria-label="댓글로 이동"
            onClick={() => {
              const target = document.querySelector('[aria-label="댓글"]');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <MessageCircle size={18} />
            <span>{post.comment_count ?? 0}</span>
          </button>
        </div>

        <div className={styles.actionsRight}>
          {onShare && (
            <button
              type="button"
              className={styles.iconActionButton}
              onClick={() => onShare(post)}
              aria-label="공유"
              title="링크 복사"
            >
              <Share2 size={18} />
            </button>
          )}
          <button
            type="button"
            className={clsx(
              styles.bookmarkButton,
              isBookmarked && styles.bookmarkButtonActive
            )}
            onClick={() => onToggleBookmark?.(post)}
            disabled={isBookmarkPending || !user}
            aria-label={isBookmarked ? '북마크 해제' : '북마크'}
            aria-pressed={isBookmarked}
          >
            {isBookmarked ? (
              <BookmarkCheck size={18} fill="currentColor" />
            ) : (
              <Bookmark size={18} />
            )}
          </button>
        </div>
      </footer>
    </article>
  );
};

export default MagazineArticle;
