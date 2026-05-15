// src/features/dashboard/components/widgets/RecentReviewCard/RecentReviewCard.jsx

const miniReviewStyle = {
  padding: '16px',
  borderRadius: '20px',
  background: 'white',
  border: '1px solid rgba(144,104,74,0.1)',
};

/**
 * 최근 구매평 위젯.
 * 추후 props로 리뷰 데이터를 받도록 변경 (현재는 mock).
 */
export default function RecentReviewCard() {
  return (
    <div className="card card-soft">
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '15px' }}>
        ✨ 최근 구매평
      </h3>
      <div style={miniReviewStyle}>
        <p style={{ color: 'var(--gold)', fontSize: '10px' }}>⭐⭐⭐⭐⭐</p>
        <p
          style={{
            fontSize: '12px',
            marginTop: '5px',
            lineHeight: 1.4,
            color: 'var(--text-main)',
          }}
        >
          "배송이 정말 빠르고 작가님 손편지에 감동했어요! 또 주문할게요."
        </p>
      </div>
    </div>
  );
}