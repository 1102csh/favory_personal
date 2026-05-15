import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight, Loader2 } from 'lucide-react';
import LegacyScope from '@/shared/ui/LegacyScope/LegacyScope';
import { useResponsive } from '@/shared/hooks/useResponsive';

// 컴포넌트 및 API
import SiteNav from '../components/SiteNav/SiteNav';
import FeaturedBanner from '../components/FeaturedBanner/FeaturedBanner';
import MainFeedSection from '../components/MainFeedSection';
import { homeRepository } from '../api/homeRepository';

// 신규 작가 데이터 
const NEW_ARTISTS = [
  { id: 1, name: '스튜디오 결', category: '가죽공예', image: 'https://images.unsplash.com/photo-1499914485622-a88fac536970?auto=format&fit=crop&q=80&w=200' },
  { id: 2, name: '오후의 도자기', category: '도예', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=200' },
  { id: 3, name: '메리 우드', category: '목공', image: 'https://images.unsplash.com/photo-1611077544835-0814bfb22b13?auto=format&fit=crop&q=80&w=200' },
  { id: 4, name: '라탄의 온도', category: '라탄공예', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=200' },
  { id: 5, name: '은빛 아뜰리에', category: '금속공예', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' },
];

const HOME_THEME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,700&family=DM+Sans:wght@400;700&display=swap');
  :root { --brand-gold: #D4A373; --brand-dark: #2C2018; --bg-sand: #FDFAF6; --line-soft: #E8DCCF; }
  .fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .hover-lift { transition: all 0.3s ease; }
  .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(44,32,24,0.08); }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

const HomePage = () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      const bannerData = await homeRepository.getActiveBanners();

      if (!bannerData || bannerData.length === 0) {
        setBanners([{
          id: 'temp-1',
          title: '반가워요! 새로운 소식을 준비 중입니다',
          subtitle: 'FAVORY 마켓 플레이스',
          image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&q=80&w=1200',
          bgColor: '#FDF6F0'
        }]);
      } else {
        // 🌟 핵심 해결 포인트: 데이터 이름표를 강제로 예쁘게 맞춰줍니다.
        const formattedBanners = bannerData.map(item => ({
          id: item.id,
          title: item.title || item.name || '',
          subtitle: item.subtitle || item.category || '',
          image: item.image_url || item.image || '',
          link: item.link_url || item.link || '',
        }));
        setBanners(formattedBanners);
      }
      setLoading(false);
    };
    fetchHomeData();
  }, []);

  return (
    <LegacyScope style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      <style>{HOME_THEME_CSS}</style>
      <SiteNav isMobile={isMobile} />

      <div style={{ 
        maxWidth: 1200, margin: '0 auto',
        padding: isMobile ? '20px 16px 100px' : '40px 20px 100px',
        display: 'flex', flexDirection: 'column', gap: '48px' 
      }}>
        
        {/* 1. 메인 배너 섹션 (DB 연동) */}
        <div className="fade-up">
          {loading ? (
            <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', borderRadius: '24px' }}>
              <Loader2 className="spinner" size={32} color="#D4A373" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <FeaturedBanner artists={banners} isMobile={isMobile} />
          )}
        </div>

        {/* 2. 신규 작가 가로 스크롤 섹션 */}
        <section className="fade-up" style={{ animationDelay: '0.05s' }}>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '3px', color: 'var(--brand-gold)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>New Arrivals</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 600, color: 'var(--brand-dark)' }}>새롭게 합류한 작가님</h3>
          </div>

          <div className="hide-scrollbar" style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '8px 4px 24px', scrollSnapType: 'x mandatory' }}>
            {/* 작가 사전 등록 CTA */}
            <div className="hover-lift" onClick={() => navigate('/upgrade')} style={{ width: '200px', flexShrink: 0, scrollSnapAlign: 'start', cursor: 'pointer', border: '1px dashed var(--brand-gold)', borderRadius: '24px', padding: '24px 16px', textAlign: 'center', background: 'var(--bg-sand)' }}>
              <div style={{ width: '56px', height: '56px', background: '#FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(212,163,115,0.15)', color: 'var(--brand-gold)' }}><UserPlus size={24} /></div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '8px' }}>나도 작가가 되어볼까요?</h4>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.4', marginBottom: '16px' }}>특별한 혜택을 받으세요.</p>
              <button style={{ background: 'var(--brand-dark)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '24px', fontSize: '12px', fontWeight: 600 }}>사전 등록 <ArrowRight size={14} /></button>
            </div>

            {/* 작가 카드 리스트 */}
            {NEW_ARTISTS.map(artist => (
              <div key={artist.id} className="hover-lift" style={{ width: '150px', flexShrink: 0, scrollSnapAlign: 'start', cursor: 'pointer', background: '#FFFFFF', border: '1px solid var(--line-soft)', borderRadius: '24px', padding: '24px 12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(44,32,24,0.03)' }}>
                <div style={{ width: '84px', height: '84px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', border: '3px solid var(--bg-sand)', boxShadow: '0 8px 16px rgba(44,32,24,0.08)' }}>
                  <img src={artist.image} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ display: 'inline-block', fontSize: '11px', color: 'var(--brand-gold)', fontWeight: 700, marginBottom: '8px', background: 'var(--bg-sand)', padding: '4px 12px', borderRadius: '20px' }}>{artist.category}</span>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-dark)', margin: 0 }}>{artist.name}</h4>
              </div>
            ))}
            
            <div className="hover-lift" onClick={() => navigate('/artists')} style={{ width: '70px', flexShrink: 0, scrollSnapAlign: 'start', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--bg-sand)', border: '1px solid var(--line-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', color: 'var(--brand-dark)' }}><ArrowRight size={20} /></div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>더보기</span>
            </div>
          </div>
        </section>

        {/* 3. 피드 섹션 */}
        <section className="fade-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '3px', color: 'var(--brand-gold)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Handmade Story</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 600, color: 'var(--brand-dark)' }}>작가들의 새로운 소식</h3>
          </div>
          <MainFeedSection isMobile={isMobile} activeFilter="전체" />
        </section>
      </div>
    </LegacyScope>
  );
};

export default HomePage;