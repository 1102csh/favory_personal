// src/features/profile/sections/NewsTabSection/NewsTabSection.jsx
import { useMemo, useState } from 'react';
import { useArtistPosts } from '../../hooks/useArtistPosts';
import { adaptPostsToProfileFeeds } from '../../lib/postAdapter';

const TAG_FILTERS = ['소식', '후기'];

/**
 * '소식/후기' 탭.
 *
 * 작가 소식: posts 테이블에서 실데이터 fetch (useArtistPosts)
 * 후기: 일단 props로 받은 mock 데이터 사용 (추후 reviews 도메인 정식화 시 교체)
 *
 * @param {object} props
 * @param {string} props.profileUserId  - 프로필 주인의 user_id (작가 소식 fetch용)
 * @param {Array} props.mockReviews     - 후기 mock 데이터 (추후 useArtistReviews로 교체)
 * @param {boolean} props.isMobile
 */
export default function NewsTabSection({ profileUserId, mockReviews = [], isMobile }) {
  const [activeTag, setActiveTag] = useState('소식');

  // 작가 소식 — 실데이터
  const {
    posts,
    isLoading: postsLoading,
    error: postsError,
  } = useArtistPosts(profileUserId, { limit: 20 });

  // posts → ProfilePage 형식으로 변환
  const artistFeeds = useMemo(() => adaptPostsToProfileFeeds(posts), [posts]);

  // 후기는 일단 mock
  const reviewFeeds = useMemo(
    () =>
      mockReviews.map((r, idx) => ({
        id: `review-${idx}`,
        type: 'review',
        tag: '후기',
        author: r.name,
        profileImg: r.avatar,
        timeAgo: r.time,
        title: '',
        content: r.text,
        img: r.img,
        taggedProduct: r.taggedProduct,
        likes: r.likes,
        comments: r.comments,
      })),
    [mockReviews]
  );

  const items = activeTag === '소식' ? artistFeeds : reviewFeeds;
  const isLoading = activeTag === '소식' && postsLoading;
  const error = activeTag === '소식' ? postsError : null;

  return (
    <section
      className="news-feed-section"
      style={{ padding: isMobile ? '0 18px 18px' : '0' }}
    >
      <div className="news-feed-filter">
        {TAG_FILTERS.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`news-feed-filter__btn ${activeTag === tag ? 'active' : ''}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 로딩 / 에러 / 빈 상태 처리 */}
      {error && (
        <p
          style={{
            padding: '24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 13,
          }}
        >
          소식을 불러오지 못했습니다.
        </p>
      )}

      {!error && isLoading && (
        <p
          style={{
            padding: '24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 13,
          }}
        >
          불러오는 중...
        </p>
      )}

      {!error && !isLoading && items.length === 0 && (
        <p
          style={{
            padding: '32px 24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 13,
          }}
        >
          {activeTag === '소식'
            ? '아직 작성한 소식이 없어요.'
            : '아직 받은 후기가 없어요.'}
        </p>
      )}

      <div className="news-feed-list">
        {items.map((feed) => (
          <article key={feed.id} className="news-feed-card">
            <header className="news-feed-card__header">
              <div className="news-feed-card__author">
                {feed.profileImg ? (
                  <img
                    src={feed.profileImg}
                    alt={feed.author}
                    className="news-feed-card__avatar"
                  />
                ) : (
                  <div
                    className="news-feed-card__avatar"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--brand-soft)',
                      color: 'var(--brand-dark)',
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {feed.author.charAt(0)}
                  </div>
                )}
                <div className="news-feed-card__author-meta">
                  <div className="news-feed-card__author-row">
                    <strong className="news-feed-card__author-name">
                      {feed.author}
                    </strong>
                  </div>
                  <span className="news-feed-card__time">{feed.timeAgo}</span>
                </div>
              </div>

              <button type="button" className="news-feed-card__more" aria-label="더보기">
                ⋮
              </button>
            </header>

            <div className="news-feed-card__body">
              {feed.title && (
                <h3 className="news-feed-card__title">{feed.title}</h3>
              )}

              {feed.content && (
                <p className="news-feed-card__text">{feed.content}</p>
              )}

              {feed.img && (
                <div className="news-feed-card__image-wrap">
                  <img
                    src={feed.img}
                    alt={feed.title || 'feed image'}
                    className="news-feed-card__image"
                  />
                </div>
              )}
            </div>

            {feed.taggedProduct && (
              <div className="news-feed-card__product-tag">
                <img
                  src={feed.taggedProduct.img}
                  alt={feed.taggedProduct.name}
                  className="news-feed-card__product-tag-img"
                />
                <div className="news-feed-card__product-tag-info">
                  <p className="news-feed-card__product-tag-name">
                    {feed.taggedProduct.name}
                  </p>
                  <p className="news-feed-card__product-tag-price">
                    {feed.taggedProduct.price > 0
                      ? `${feed.taggedProduct.price.toLocaleString()}원`
                      : '가격 정보 없음'}
                  </p>
                </div>
                <span className="news-feed-card__product-tag-arrow">›</span>
              </div>
            )}

            <footer className="news-feed-card__footer">
              <button type="button" className="news-feed-card__action">
                ♡ <span>{feed.likes}</span>
              </button>
              <button type="button" className="news-feed-card__action">
                💬 <span>{feed.comments}</span>
              </button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}