// src/features/home/components/FeedList/FeedList.jsx
import { useMemo, useState } from 'react';
import { FEED_FILTERS } from '../../data/mockData';

/**
 * 작가 소식 필터 + 리스트.
 *
 * @param {object} props
 * @param {Array} props.feeds                    - { id, artist, avatar, time, text, img, category }
 * @param {boolean} props.isMobile
 * @param {() => void} [props.onLoadMore]
 * @param {(feed: object) => void} [props.onSelectFeed]
 */
export default function FeedList({ feeds, isMobile, onLoadMore, onSelectFeed }) {
  const [activeFilter, setActiveFilter] = useState('전체');

  const filteredFeeds = useMemo(
    () => (activeFilter === '전체' ? feeds : feeds.filter((f) => f.category === activeFilter)),
    [feeds, activeFilter]
  );

  return (
    <section className="au d1">
      <div style={{ marginBottom: 18 }}>
        <p
          style={{
            fontSize: 9,
            letterSpacing: 4,
            color: 'var(--brand-dark)',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          Weekly Hot
        </p>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 21,
            fontWeight: 600,
          }}
        >
          이번 주의 인기 작가 소식
        </h3>
      </div>

      {/* 필터 바 */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {FEED_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className="press"
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: '600',
              border: '1px solid',
              borderColor: activeFilter === filter ? 'var(--brand)' : 'var(--line)',
              background: activeFilter === filter ? 'var(--brand)' : '#FFF',
              color: activeFilter === filter ? '#FFF' : 'var(--gray)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 리스트 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: isMobile ? '100%' : '600px',
          margin: isMobile ? '0' : '0 auto',
        }}
      >
        {filteredFeeds.map((post) => (
          <article
            key={post.id}
            className="lift"
            onClick={() => onSelectFeed?.(post)}
            style={{
              background: '#FFF',
              borderRadius: 20,
              border: '1px solid var(--line)',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 15px',
              }}
            >
              <img
                src={post.avatar}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                alt=""
              />
              <span
                style={{ fontWeight: 700, fontSize: 13, color: 'var(--charcoal)' }}
              >
                {post.artist}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: 'var(--brand-dark)',
                  background: 'var(--brand-light)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  marginLeft: 'auto',
                }}
              >
                {post.category}
              </span>
            </div>
            <p
              style={{
                padding: '0 15px 12px',
                fontSize: 13,
                color: '#444',
                lineHeight: 1.5,
              }}
            >
              {post.text}
            </p>
            <div
              style={{
                width: '100%',
                position: 'relative',
                paddingTop: '100%',
                overflow: 'hidden',
              }}
            >
              <img
                src={post.img}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                alt=""
              />
            </div>
          </article>
        ))}

        {onLoadMore && (
          <button
            type="button"
            onClick={onLoadMore}
            className="all-feeds-btn press"
          >
            작가 소식 더보기 →
          </button>
        )}
      </div>
    </section>
  );
}