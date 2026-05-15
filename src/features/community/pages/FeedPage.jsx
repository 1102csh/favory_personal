// src/features/community/pages/FeedPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PencilLine } from 'lucide-react';

import LegacyScope from '@/shared/ui/LegacyScope';
import Alert from '@/shared/ui/Alert';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { usePostBookmark } from '../hooks/usePostBookmark';
import SiteNav from '@/features/home/components/SiteNav';

import PostCard from '../components/PostCard';
import CategoryTabs from '../components/CategoryTabs';
import WriteButton from '../components/WriteButton';
import CommunitySidebar from '../components/CommunitySidebar';
import MagazineCard from '../components/MagazineCard';
import FeedSegments, { FEED_SEGMENTS } from '../components/FeedSegments';
import MagazineHighlight from '../components/MagazineHighlight';
import { POST_TYPES } from '../constants/postConstants';

import { useFeed } from '../hooks/useFeed';
import { usePostLike } from '../hooks/usePostLike';
import { useFeaturedMagazines } from '../hooks/useFeaturedMagazines';
import { postService } from '../services/postService';

import styles from './FeedPage.module.scss';

// 세그먼트 → useFeed의 postType 인자 매핑
//   전체: 필터 없음 (캐러셀은 별도 강조 표면)
//   매거진: 매거진만
//   소식: 매거진 제외
const SEGMENT_TO_POST_TYPE = {
  [FEED_SEGMENTS.ALL]: null,
  [FEED_SEGMENTS.MAGAZINE]: 'magazine',
  [FEED_SEGMENTS.NEWS]: 'exclude_magazine',
};

/**
 * /community — 메인 피드 페이지.
 *
 * 레이아웃:
 *   - 데스크톱: 2단 (피드 + 사이드바)
 *   - 태블릿/모바일: 단일 컬럼 (사이드바 숨김)
 *
 * 작성 진입:
 *   - 데스크톱: 헤더 우측 "글쓰기" 버튼
 *   - 모바일: 우하단 FAB
 */
const FeedPage = () => {
  const navigate = useNavigate();
  const { isDesktop } = useResponsive();
  const [segment, setSegment] = useState(FEED_SEGMENTS.ALL);
  const [category, setCategory] = useState(null);

  const postTypeFilter = SEGMENT_TO_POST_TYPE[segment];
  const showMagazineHighlight = segment === FEED_SEGMENTS.ALL;

  const {
    posts,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    replacePost,
    removePost,
  } = useFeed({ category, postType: postTypeFilter });

  // 매거진 캐러셀 — '전체' 세그먼트에서만 fetch
  const { magazines } = useFeaturedMagazines({
    limit: 5,
    enabled: showMagazineHighlight,
  });

  const { toggleLike, isPending: isLikePending } = usePostLike({
    onLocalUpdate: replacePost,
  });

  // ✅ 북마크 훅
  const { toggleBookmark, isPending: isBookmarkPending } = usePostBookmark({
    onLocalUpdate: replacePost,
  });

  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled: hasMore && !isLoading && !isLoadingMore,
  });

  const handleDelete = async (postId) => {
    try {
      await postService.deletePost(postId);
      removePost(postId);
    } catch (e) {
      alert(e.message ?? '삭제에 실패했습니다.');
    }
  };

  return (
    <LegacyScope className={styles.page}>
      <SiteNav isMobile={!isDesktop} />

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* 메인 영역 */}
          <main className={styles.main}>
            <header className={styles.pageHeader}>
              <h1 className={styles.title}>소식</h1>
              <button
                type="button"
                className={styles.iconAction}
                onClick={() => navigate('/search')}
                aria-label="검색"
                title="검색"
              >
                <Search size={18} />
              </button>
            </header>

            {/* 1차 세그먼트 — post_type */}
            <div className={styles.segmentsWrap}>
              <FeedSegments value={segment} onChange={setSegment} />
            </div>

            {/* 2차 카테고리 — sticky */}
            <div className={styles.tabsWrap}>
              <CategoryTabs value={category} onChange={setCategory} />
            </div>

            {/* 매거진 캐러셀 — 전체 세그먼트에서만 */}
            {showMagazineHighlight && (
              <MagazineHighlight
                magazines={magazines}
                onMore={() => setSegment(FEED_SEGMENTS.MAGAZINE)}
              />
            )}

            {error && (
              <Alert tone="danger">
                {error.message ?? '피드를 불러오는 중 오류가 발생했습니다.'}
              </Alert>
            )}

            {isLoading && posts.length === 0 ? (
              <FeedSkeleton />
            ) : posts.length === 0 ? (
              <EmptyFeed
                category={category}
                segment={segment}
                onWrite={() => navigate('/community/write')}
              />
            ) : (
              <ul className={styles.feedList} aria-label="피드">

                {posts.map((post) => (
                  <li key={post.id}>
                    {post.post_type === POST_TYPES.MAGAZINE ? (
                      <MagazineCard
                        post={post}
                        onToggleLike={toggleLike}
                        isLikePending={isLikePending(post.id)}
                        onToggleBookmark={toggleBookmark}
                        isBookmarkPending={isBookmarkPending(post.id)}
                        onDelete={handleDelete}
                      />
                    ) : (
                      <PostCard
                        post={post}
                        onToggleLike={toggleLike}
                        isLikePending={isLikePending(post.id)}
                        onToggleBookmark={toggleBookmark}
                        isBookmarkPending={isBookmarkPending(post.id)}
                        onDelete={handleDelete}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* 무한 스크롤 센티넬 */}
            <div ref={sentinelRef} aria-hidden style={{ height: 1 }} />

            {isLoadingMore && (
              <p className={styles.loadingMore} aria-live="polite">
                불러오는 중...
              </p>
            )}

            {!hasMore && posts.length > 0 && (
              <p className={styles.endMessage}>모든 게시글을 확인했습니다.</p>
            )}
          </main>

          {/* 사이드바 (데스크톱만) */}
          {isDesktop && <CommunitySidebar />}
        </div>
      </div>

      {/* 모바일 FAB */}
      <WriteButton variant="fab" />
    </LegacyScope>
  );
};

const FeedSkeleton = () => (
  <ul className={styles.feedList} aria-hidden>
    {Array.from({ length: 3 }).map((_, i) => (
      <li key={i} className={styles.skeletonCard}>
        <div className={styles.skeletonHeader}>
          <div className={styles.skeletonAvatar} />
          <div className={styles.skeletonAuthor}>
            <div className={styles.skeletonAuthorName} />
            <div className={styles.skeletonAuthorTime} />
          </div>
        </div>
        <div className={styles.skeletonBody}>
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLineShort} />
        </div>
        <div className={styles.skeletonChipRow}>
          <div className={styles.skeletonChip} />
          <div className={styles.skeletonChip} />
        </div>
        <div className={styles.skeletonActions}>
          <div className={styles.skeletonActionItem} />
          <div className={styles.skeletonActionItem} />
        </div>
      </li>
    ))}
  </ul>
);

const EmptyFeed = ({ category, segment, onWrite }) => {
  const title = category
    ? `'${category}' 카테고리에 아직 글이 없어요`
    : segment === FEED_SEGMENTS.MAGAZINE
      ? '아직 매거진이 없어요'
      : '아직 게시글이 없어요';

  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon} aria-hidden>
        <PencilLine size={28} strokeWidth={1.75} />
      </div>
      <p className={styles.emptyTitle}>{title}</p>
      <p className={styles.emptyHint}>첫 글의 주인공이 되어보세요.</p>
      <button
        type="button"
        className={styles.emptyCta}
        onClick={onWrite}
      >
        <PencilLine size={16} />
        <span>글쓰기</span>
      </button>
    </div>
  );
};

export default FeedPage;