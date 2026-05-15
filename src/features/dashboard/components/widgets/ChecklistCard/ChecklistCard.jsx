// src/features/dashboard/components/widgets/ChecklistCard/ChecklistCard.jsx

const ALERTS = [
  { id: 'a1', text: '📦 제작 지연 주문 2건 확인 필요', actionLabel: '이동' },
  { id: 'a2', text: '💬 답변 대기 중인 문의글 1건',     actionLabel: '답변' },
];

const alertBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: '18px',
  background: 'white',
  border: '1px solid rgba(144,104,74,0.1)',
};

const alertBtnStyle = {
  fontSize: '10px',
  color: '#8f5734',
  background: 'rgba(184,121,79,0.1)',
  border: 'none',
  fontWeight: 700,
  cursor: 'pointer',
  padding: '6px 10px',
  borderRadius: '999px',
};

/**
 * 운영 체크리스트 위젯.
 *
 * @param {object} props
 * @param {(alertId: string) => void} [props.onAlertAction]
 */
export default function ChecklistCard({ onAlertAction }) {
  return (
    <div className="card card-soft">
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '15px' }}>
        🚨 운영 체크리스트
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {ALERTS.map((alert) => (
          <div key={alert.id} style={alertBoxStyle}>
            <p style={{ fontSize: '12px', flex: 1 }}>{alert.text}</p>
            <button
              type="button"
              style={alertBtnStyle}
              onClick={() => onAlertAction?.(alert.id)}
            >
              {alert.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}