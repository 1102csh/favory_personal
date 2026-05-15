// src/features/home/components/TrendingSidebar/TrendingSidebar.jsx

/**
 * 데스크톱 우측 사이드바 — 트렌딩 작가 + 라이브 리뷰.
 * 모바일에서는 사용하지 않음 (HomePage에서 조건부 렌더링).
 *
 * @param {object} props
 * @param {Array} props.artists  - { name, tags, followers, avatar, isFollowed }
 * @param {(artist: object) => void} [props.onFollowToggle]
 */
export default function TrendingSidebar({ artists, onFollowToggle }) {
  return (
    <aside style={{ width: 320, position: 'sticky', top: 100, flexShrink: 0 }}>
      {/* Trending Artists */}
      <div
        className="side-box au d1"
        style={{
          background: '#FFF',
          border: '1px solid var(--line)',
          borderRadius: 24,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <p
          style={{
            fontSize: 10,
            letterSpacing: 3,
            color: 'var(--brand-dark)',
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          TRENDING ARTISTS
        </p>
        {artists.map((a, i) => (
          <div
            key={a.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: i < 3 ? 'var(--brand-dark)' : 'var(--gray-light)',
                fontFamily: "'Cormorant Garamond', serif",
                width: 15,
              }}
            >
              {i + 1}
            </span>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1px solid var(--line)',
                flexShrink: 0,
              }}
            >
              <img
                src={a.avatar}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                alt={a.name}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--charcoal)',
                  marginBottom: 3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {a.name}
              </p>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {a.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 9,
                      padding: '1px 5px',
                      borderRadius: 4,
                      background: 'var(--bg2)',
                      color: 'var(--brand-dark)',
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="press"
              onClick={() => onFollowToggle?.(a)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '700',
                border: a.isFollowed ? '1px solid var(--line)' : 'none',
                background: a.isFollowed ? 'transparent' : 'var(--charcoal)',
                color: a.isFollowed ? 'var(--gray)' : '#FFF',
                cursor: 'pointer',
              }}
            >
              {a.isFollowed ? '팔로잉' : '팔로우'}
            </button>
          </div>
        ))}
      </div>

      {/* Live Reviews */}
      <div
        className="side-box au d2"
        style={{
          background: 'var(--charcoal)',
          borderRadius: 20,
          padding: 24,
          color: '#FFF',
        }}
      >
        <p
          style={{
            fontSize: 10,
            letterSpacing: 2,
            fontWeight: 700,
            marginBottom: 15,
          }}
        >
          LIVE REVIEWS 🔴
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.8 }}>
          "작가님의 정성이 느껴지는 포장이었습니다. 실물이 훨씬 예뻐요! 🥹"
        </p>
      </div>
    </aside>
  );
}