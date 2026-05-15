// src/features/dashboard/components/widgets/OrderStages/OrderStages.jsx

const STAGES = [
  { label: '신규주문',   count: 3, color: 'var(--brand)' },
  { label: '제작중',     count: 5, color: 'var(--gold)' },
  { label: '배송준비',   count: 2, color: 'var(--green)' },
  { label: '배송중',     count: 4, color: 'var(--blue)' },
  { label: '구매확정',   count: 7, color: '#8a77ad' },
];

/**
 * 주문/제작 단계별 카운트 위젯.
 *
 * @param {object} props
 * @param {boolean} props.isMobile
 */
export default function OrderStages({ isMobile }) {
  const totalCount = STAGES.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="card card-soft">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>주문/제작 진행 단계</h3>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--brand-deep)',
            fontWeight: 700,
            background: 'white',
            padding: '6px 12px',
            borderRadius: '999px',
            border: '1px solid var(--line)',
          }}
        >
          {totalCount}건 진행 중
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5, 1fr)',
          gap: '12px',
        }}
      >
        {STAGES.map((stage) => (
          <div
            key={stage.label}
            className="stat-tile"
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-muted)',
              }}
            >
              {stage.label}
            </span>
            <p style={{ fontSize: '26px', fontWeight: 800, color: stage.color }}>
              {stage.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}