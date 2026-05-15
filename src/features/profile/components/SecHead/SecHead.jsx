// src/features/profile/components/SecHead/SecHead.jsx

/**
 * 섹션 헤더.
 *
 * @param {object} props
 * @param {string} [props.en]   - 영문 부제 (현재 미사용, 추후 디자인 확장 대비)
 * @param {string} props.ko     - 한글 제목
 * @param {() => void} [props.onMore]
 */
export default function SecHead({ en, ko, onMore }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 18,
      }}
    >
      <h3
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--text-main)',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
        }}
      >
        {ko}
      </h3>

      {onMore && (
        <button
          onClick={onMore}
          className="press"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            color: 'var(--text-muted)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          전체보기 <span style={{ fontSize: 14 }}>→</span>
        </button>
      )}
    </div>
  );
}