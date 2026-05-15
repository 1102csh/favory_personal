// src/features/profile/components/ProfileSidebar/ProfileSidebar.jsx

/**
 * 작가 프로필 사이드바.
 * 데스크톱(1080+)에서만 노출.
 *
 * @param {object} props
 * @param {Array} [props.policies]  - [{ l: '배송', v: '3일 이내' }, ...]
 * @param {object|null} [props.nextClass] - { title, date, time, spotsLeft, totalSpots, onApply }
 */
export default function ProfileSidebar({
  policies = DEFAULT_POLICIES,
  nextClass = DEFAULT_NEXT_CLASS,
}) {
  const cardBase = {
    background: 'var(--white)',
    borderRadius: 22,
    padding: '20px 22px',
    border: '1px solid var(--line)',
    boxShadow: 'var(--shadow-sm)',
  };

  return (
    <aside
      className="au d1"
      style={{
        width: 238,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* 정책 */}
      {policies.length > 0 && (
        <div style={cardBase}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.14em',
              color: 'var(--brand-dark)',
              fontWeight: 700,
              marginBottom: 14,
              textTransform: 'uppercase',
            }}
          >
            Policy
          </p>

          {policies.map((item, i, arr) => (
            <div
              key={item.l}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '9px 0',
                borderBottom:
                  i < arr.length - 1 ? '1px solid var(--bg-muted)' : 'none',
              }}
            >
              <span style={{ fontSize: 12.5, color: 'var(--text-light)' }}>
                {item.l}
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>
                {item.v}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 다음 클래스 */}
      {nextClass && (
        <div
          style={{
            borderRadius: 24,
            padding: '22px',
            position: 'relative',
            overflow: 'hidden',
            background:
              'linear-gradient(155deg, rgba(212,163,115,0.95) 0%, rgba(184,132,79,0.96) 100%)',
            boxShadow: '0 12px 30px rgba(212,163,115,0.24)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -26,
              right: -26,
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.14)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -14,
              left: -8,
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            }}
          />

          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.74)',
              fontWeight: 700,
              marginBottom: 10,
              textTransform: 'uppercase',
              position: 'relative',
            }}
          >
            Next Class
          </p>

          <p
            style={{
              fontSize: 15,
              color: '#fff',
              fontWeight: 700,
              marginBottom: 6,
              position: 'relative',
              letterSpacing: '-0.02em',
            }}
          >
            {nextClass.title}
          </p>

          <p
            style={{
              fontSize: 12.5,
              color: 'rgba(255,255,255,0.84)',
              lineHeight: 1.72,
              marginBottom: 17,
              position: 'relative',
              fontWeight: 500,
            }}
          >
            {nextClass.date}
            <br />
            {nextClass.time}
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              gap: 10,
            }}
          >
            <span
              style={{
                fontSize: 11.5,
                color: 'rgba(255,255,255,0.92)',
                fontWeight: 700,
              }}
            >
              잔여 {nextClass.spotsLeft} / {nextClass.totalSpots}
            </span>

            <button
              onClick={nextClass.onApply}
              className="press"
              style={{
                background: 'rgba(255,255,255,0.96)',
                color: 'var(--brand-dark)',
                border: 'none',
                borderRadius: 999,
                padding: '8px 16px',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              신청하기
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

// ============ 기본값 (현재는 mock; 추후 ProfilePage에서 props로 전달) ============
const DEFAULT_POLICIES = [
  { l: '배송',      v: '3일 이내' },
  { l: '교환/반품', v: '수령 후 7일' },
  { l: '도안',      v: '개인 사용 한정' },
];

const DEFAULT_NEXT_CLASS = {
  title: '입문 도자기 클래스',
  date: '2026. 04. 12 (일)',
  time: '14:00 — 17:00',
  spotsLeft: 3,
  totalSpots: 8,
};