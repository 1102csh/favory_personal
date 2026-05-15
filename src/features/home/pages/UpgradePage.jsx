// src/features/home/pages/UpgradePage.jsx
import { useNavigate } from 'react-router-dom';
import LegacyScope from '@/shared/ui/LegacyScope';
import { useResponsive } from '@/shared/hooks/useResponsive';
import SiteNav from '../components/SiteNav';

const PLANS = [
  {
    id: 'start',
    name: 'Start',
    price: '월 9,900원',
    description: '공방을 시작하는 작가를 위한 기본 플랜',
    features: ['상품 등록 20개', '소식 무제한', '기본 분석'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '월 29,900원',
    description: '성장하는 작가를 위한 추천 플랜',
    features: ['상품 등록 무제한', '클래스 운영', '고급 분석', '우선 노출'],
    recommended: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '월 79,900원',
    description: '전문 작가를 위한 모든 기능',
    features: ['모든 Growth 기능', '맞춤 도메인', '전담 매니저', 'API 액세스'],
  },
];

/**
 * 작가 구독 플랜 안내 페이지.
 * 일반 사용자가 ARTIST CENTER 클릭 시 또는 /dashboard 직접 접근 시 도달.
 *
 * ⚠️ Placeholder입니다. 추후 결제 연동 시:
 *   - features/subscription/ 도메인 신설
 *   - Stripe / 토스페이먼츠 / 카카오페이 등 PG 연동
 *   - profiles 테이블에 artisan_plan 컬럼 추가 후 업데이트 흐름 구현
 */
export default function UpgradePage() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  return (
    <LegacyScope style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <SiteNav isMobile={isMobile} />

      <div
        className="au"
        style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' }}
      >
        <header style={{ textAlign: 'center', marginBottom: '50px' }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: 4,
              color: 'var(--brand-dark)',
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            BECOME AN ARTIST
          </p>
          <h1
            style={{
              fontSize: isMobile ? 28 : 40,
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              color: 'var(--charcoal)',
              marginBottom: 12,
            }}
          >
            당신의 공방을 FAVORY에서 시작하세요
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: 14 }}>
            적합한 플랜을 선택하시면 작가 대시보드 이용이 가능합니다.
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className="lift"
              style={{
                background: '#FFF',
                borderRadius: 24,
                padding: 32,
                border: plan.recommended
                  ? '2px solid var(--brand)'
                  : '1px solid var(--line)',
                position: 'relative',
              }}
            >
              {plan.recommended && (
                <span
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--brand)',
                    color: '#FFF',
                    padding: '4px 16px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  RECOMMENDED
                </span>
              )}
              <h3
                style={{
                  fontSize: 24,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 700,
                  color: 'var(--charcoal)',
                  marginBottom: 8,
                }}
              >
                {plan.name}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--gray)',
                  marginBottom: 20,
                  minHeight: 40,
                }}
              >
                {plan.description}
              </p>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: 'var(--brand-dark)',
                  marginBottom: 24,
                }}
              >
                {plan.price}
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    style={{
                      fontSize: 13,
                      color: 'var(--charcoal)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ color: 'var(--brand)' }}>✓</span> {feat}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="press"
                onClick={() => alert(`${plan.name} 플랜 구독 (추후 결제 연동 예정)`)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 14,
                  background: plan.recommended ? 'var(--charcoal)' : '#FFF',
                  color: plan.recommended ? '#FFF' : 'var(--charcoal)',
                  border: plan.recommended ? 'none' : '1px solid var(--charcoal)',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: 0.5,
                }}
              >
                선택하기
              </button>
            </article>
          ))}
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: 40,
            fontSize: 13,
            color: 'var(--gray)',
          }}
        >
          이미 작가이신가요?{' '}
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brand-dark)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            홈으로 돌아가기
          </button>
        </p>
      </div>
    </LegacyScope>
  );
}