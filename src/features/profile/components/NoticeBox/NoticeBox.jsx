// src/features/profile/components/NoticeBox/NoticeBox.jsx

export default function NoticeBox({ notices, noticeOpen, setNotice }) {
  return (
    <div className="au d2" style={{ marginBottom: 20 }}>
      <div
        style={{
          background: 'var(--white)',
          borderRadius: 18,
          border: '1px solid var(--line)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          onClick={() => setNotice((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            cursor: 'pointer',
            userSelect: 'none',
            background: noticeOpen ? 'var(--bg-soft)' : 'var(--white)',
            transition: 'background 0.22s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              minWidth: 0,
              flex: 1,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--brand)',
                flexShrink: 0,
              }}
            />

            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--brand-dark)',
                letterSpacing: '-0.01em',
                flexShrink: 0,
              }}
            >
              공지사항
            </span>

            {!noticeOpen && (
              <span
                style={{
                  fontSize: 12.5,
                  color: 'var(--text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                }}
              >
                {notices[0]}
              </span>
            )}
          </div>

          <span
            style={{
              fontSize: 11,
              color: 'var(--brand)',
              display: 'inline-block',
              transition: 'transform 0.25s ease',
              transform: noticeOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              marginLeft: 8,
              flexShrink: 0,
            }}
          >
            ▾
          </span>
        </div>

        <div className={`notice-body ${noticeOpen ? 'open' : ''}`}>
          <div
            style={{
              borderTop: '1px solid var(--line)',
              padding: '4px 18px 14px',
              background: 'rgba(255,255,255,0.75)',
            }}
          >
            {notices.map((notice, index, arr) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '11px 0',
                  borderBottom:
                    index < arr.length - 1 ? '1px solid var(--bg-muted)' : 'none',
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--brand)',
                    marginTop: 1,
                    flexShrink: 0,
                    fontWeight: 700,
                  }}
                >
                  —
                </span>

                <span
                  style={{
                    fontSize: 13.5,
                    color: 'var(--text-sub)',
                    lineHeight: 1.68,
                    fontWeight: 400,
                    wordBreak: 'keep-all',
                  }}
                >
                  {notice}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}