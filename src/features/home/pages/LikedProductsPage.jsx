import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import LegacyScope from '@/shared/ui/LegacyScope/LegacyScope';
import { useResponsive } from '@/shared/hooks/useResponsive';
import SiteNav from '../components/SiteNav/SiteNav';

// 임시 데이터 (나중에 DB 데이터로 교체)
const MOCK_LIKES = [
  { id: 1, title: '달빛 무드등 도자기', artist: '오후의 도자기', price: 45000, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=300' },
  { id: 2, title: '빈티지 가죽 다이어리', artist: '스튜디오 결', price: 32000, image: 'https://images.unsplash.com/photo-1499914485622-a88fac536970?auto=format&fit=crop&q=80&w=300' },
  { id: 3, title: '핸드메이드 우드 트레이', artist: '메리 우드', price: 28000, image: 'https://images.unsplash.com/photo-1611077544835-0814bfb22b13?auto=format&fit=crop&q=80&w=300' },
];

export default function LikedProductsPage() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [likes, setLikes] = useState(MOCK_LIKES);

  return (
    <LegacyScope style={{ minHeight: '100vh', background: 'var(--bg-gray, #F8F9FA)' }}>
      <SiteNav isMobile={isMobile} />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '20px 16px' : '40px 24px', paddingBottom: '100px' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={24} color="#2C2018" />
          </button>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#2C2018' }}>찜한 작품</h2>
        </header>

        {likes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
            <Heart size={48} color="#ddd" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>아직 찜한 작품이 없어요</p>
            <p style={{ fontSize: '14px', marginBottom: '24px' }}>마음에 드는 작품에 하트를 눌러보세요!</p>
            <button onClick={() => navigate('/categories')} style={{ background: '#2C2018', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}>
              작품 구경하러 가기
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px' }}>
            {likes.map((item) => (
              <div key={item.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => navigate(`/products/${item.id}`)}>
                <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#E05252' }}>
                    <Heart size={16} fill="#E05252" />
                  </button>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{item.artist}</p>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#2C2018', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h4>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#D4A373' }}>{item.price.toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LegacyScope>
  );
}