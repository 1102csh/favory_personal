import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, Users } from 'lucide-react';
import LegacyScope from '@/shared/ui/LegacyScope/LegacyScope';
import { useResponsive } from '@/shared/hooks/useResponsive';
import SiteNav from '../components/SiteNav/SiteNav';

// 임시 데이터 (나중에 DB 데이터로 교체)
const MOCK_ARTISTS = [
  { id: 1, name: '스튜디오 결', category: '가죽공예', followers: 1205, image: 'https://images.unsplash.com/photo-1499914485622-a88fac536970?auto=format&fit=crop&q=80&w=200' },
  { id: 2, name: '오후의 도자기', category: '도예', followers: 854, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=200' },
];

export default function FavoriteArtistsPage() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [artists, setArtists] = useState(MOCK_ARTISTS);

  return (
    <LegacyScope style={{ minHeight: '100vh', background: 'var(--bg-gray, #F8F9FA)' }}>
      <SiteNav isMobile={isMobile} />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '20px 16px' : '40px 24px', paddingBottom: '100px' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={24} color="#2C2018" />
          </button>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#2C2018' }}>관심 작가</h2>
        </header>

        {artists.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
            <Users size={48} color="#ddd" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>아직 등록된 관심 작가가 없어요</p>
            <p style={{ fontSize: '14px', marginBottom: '24px' }}>취향에 맞는 작가님을 팔로우 해보세요!</p>
            <button onClick={() => navigate('/artists')} style={{ background: '#2C2018', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}>
              작가 탐색하기
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {artists.map((artist) => (
              <div key={artist.id} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '16px', padding: '16px', border: '1px solid #eee', cursor: 'pointer' }} onClick={() => navigate(`/users/${artist.id}`)}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #FDFAF6', marginRight: '16px', flexShrink: 0 }}>
                  <img src={artist.image} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '11px', color: '#D4A373', fontWeight: 'bold', background: '#FDFAF6', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginBottom: '4px' }}>{artist.category}</span>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#2C2018' }}>{artist.name}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>팔로워 {artist.followers.toLocaleString()}명</p>
                </div>
                <button style={{ background: '#F8F9FA', border: '1px solid #ddd', padding: '8px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <UserCheck size={14} /> 팔로잉
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </LegacyScope>
  );
}