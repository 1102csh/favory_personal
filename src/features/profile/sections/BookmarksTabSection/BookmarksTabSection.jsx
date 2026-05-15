// src/features/profile/sections/BookmarksTabSection/BookmarksTabSection.jsx
import { useMyBookmarks } from '@/features/community/hooks/useMyBookmarks';
import { usePostBookmark } from '@/features/community/hooks/usePostBookmark';
import { usePostLike } from '@/features/community/hooks/usePostLike';
import PostCard from '@/features/community/components/PostCard';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

import styles from './BookmarksTabSection.module.scss';

/**
 * 본인이 저장한 게시글 목록.
 *
 * 본인 프로필에서만 노출. ProfilePage에서 분기 처리.
 */
const BookmarksTabSection = ({ isMobile }) => {
  const {
    posts,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    replacePost,
  } = useMyBookmarks({ pageSize: 20 });

  const { toggleLike, isPending: isLikePending } = usePostLike({
    onLocalUpdate: replacePost,
  });

  const { toggleBookmark, isPending: isBookmarkPending } = usePostBookmark({
    onLocalUpdate: replacePost,
  });

  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled: hasMore && !isLoading && !isLoadingMore,
  });

  return (
    <div
      className={styles.section}
      style={{ padding: isMobile ? '20px 18px 18px' : '0' }}
    >
      {error && (
        <p className={styles.message} style={{ color: 'var(--color-danger)' }}>
          저장한 글을 불러올 수 없습니다.
        </p>
      )}

      {isLoading && posts.length === 0 && (
        <p className={styles.message}>불러오는 중...</p>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <div className={styles.empty}>
          <p>저장한 게시글이 없어요.</p>
          <p className={styles.emptyHint}>
            관심 있는 게시글의 북마크 아이콘을 눌러 저장해보세요.
          </p>
        </div>
      )}

      {posts.length > 0 && (
        <ul className={styles.list} aria-label="저장한 게시글">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard
                post={post}
                onToggleLike={toggleLike}
                isLikePending={isLikePending(post.id)}
                onToggleBookmark={toggleBookmark}
                isBookmarkPending={isBookmarkPending(post.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <div ref={sentinelRef} aria-hidden style={{ height: 1 }} />

      {isLoadingMore && (
        <p className={styles.message} aria-live="polite">
          불러오는 중...
        </p>
      )}
    </div>
  );
};

export default BookmarksTabSection;