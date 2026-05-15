// src/features/profile/sections/AllTabSection/AllTabSection.jsx
import { useMemo } from 'react';
import { useArtistPosts } from '../../hooks/useArtistPosts';
import { adaptPostsToProfileFeeds } from '../../lib/postAdapter';

import SecHead from '../../components/SecHead';
import StreamCard from '../../components/StreamCard';
import PickCarousel from '../../components/PickCarousel';
import ProductCard from '../../components/ProductCard';
import CollectionSection from '../CollectionSection';

/**
 * '홈' 탭의 All 섹션.
 *
 * - 대표 작품: mock 유지 (products 도메인 정식화 후 교체) — 최대 4개 노출
 * - 컬렉션: mock 유지
 * - 최근 소식: 실데이터 (useArtistPosts) — 그리드, 최대 4개
 * - 구매자 후기: mock 유지 — 그리드, 최대 4개
 *
 * @param {object} props
 * @param {string} props.profileUserId  - 프로필 주인의 user_id
 * @param {Array} props.products        - mock products
 * @param {Array} props.reviews         - mock reviews (구매자 후기 영역용)
 */
const FEATURED_LIMIT = 4;
const STREAM_LIMIT = 4;

export default function AllTabSection({
  profileUserId,
  products,
  reviews,
  isMobile,
  isTablet,
  setTab,
}) {
  // 최근 소식 — 실데이터 (그리드 노출 — 최대 STREAM_LIMIT)
  const { posts, isLoading: postsLoading } = useArtistPosts(profileUserId, {
    limit: STREAM_LIMIT,
  });

  const recentFeeds = useMemo(() => adaptPostsToProfileFeeds(posts), [posts]);

  // 대표 작품 — 상단 노출용으로 개수 축소
  const featuredProducts = useMemo(
    () => products.slice(0, FEATURED_LIMIT),
    [products]
  );

  const recentReviews = useMemo(
    () => reviews.slice(0, STREAM_LIMIT),
    [reviews]
  );

  return (
    <div
      className="au d4"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 38 : 48,
        padding: isMobile ? '0 18px' : '0',
      }}
    >
      {/* 대표 작품 — 가장 상단, 최대 4개 */}
      {featuredProducts.length > 0 && (
        <>
          <section>
            <SecHead en="Signature Works" ko="대표 작품" />

            {isMobile ? (
              <PickCarousel products={featuredProducts} />
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isTablet ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
                  gap: 14,
                }}
              >
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} p={product} size="sm" />
                ))}
              </div>
            )}
          </section>

          <div className="divider" />
        </>
      )}

      {/* 컬렉션 — 대표 작품 다음 */}
      <CollectionSection isMobile={isMobile} />

      <div className="divider" />

      {/* 최근 소식 — 실데이터 */}
      <section>
        <SecHead
          en="From the Studio"
          ko="최근 소식"
          onMore={() => setTab('소식')}
        />

        {postsLoading ? (
          <p
            style={{
              padding: '20px 0',
              color: 'var(--text-muted)',
              fontSize: 13,
            }}
          >
            불러오는 중...
          </p>
        ) : recentFeeds.length === 0 ? (
          <p
            style={{
              padding: '20px 0',
              color: 'var(--text-muted)',
              fontSize: 13,
            }}
          >
            아직 작성한 소식이 없어요.
          </p>
        ) : (
          <div className="stream-grid">
            {recentFeeds.map((feed) => (
              <StreamCard key={feed.id} post={feed} isReview={false} />
            ))}
          </div>
        )}
      </section>

      {/* 구매자 후기 — 일단 mock */}
      {recentReviews.length > 0 && (
        <>
          <div className="divider" />

          <section>
            <SecHead
              en="Real Stories"
              ko="구매자 후기"
              onMore={() => setTab('소식')}
            />

            <div className="stream-grid">
              {recentReviews.map((review, index) => (
                <StreamCard key={index} post={review} isReview={true} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}