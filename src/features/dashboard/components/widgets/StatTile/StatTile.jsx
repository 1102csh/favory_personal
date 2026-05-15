// src/features/dashboard/components/widgets/StatTile/StatTile.jsx

/**
 * 대시보드 작은 통계 카드.
 * 레거시 .stat-tile 클래스 활용.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {string} [props.color]   - 값 색상 (기본 var(--text-main))
 */
const StatTile = ({ label, value, color }) => (
  <div
    className="stat-tile"
    style={{
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}
  >
    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
      {label}
    </span>
    <p style={{ fontSize: '18px', fontWeight: 700, color: color ?? 'var(--text-main)' }}>
      {value}
    </p>
  </div>
);

export default StatTile;