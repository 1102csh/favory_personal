import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function FeaturedBanner({ artists = [], isMobile }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 배너 자동 슬라이드 (4초마다)
  useEffect(() => {
    if (artists.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % artists.length);
    }, 4000);
    
    // ✨ 사용자가 점을 클릭해서 currentIndex가 바뀌면 타이머를 초기화해서 4초 시간을 다시 줍니다!
    return () => clearInterval(timer);
  }, [artists.length, currentIndex]); 

  if (!artists || artists.length === 0) return null;

  const currentBanner = artists[currentIndex];

  return (
    <div 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: isMobile ? '360px' : '440px', 
        borderRadius: '24px', 
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
      }}
    >
      {/* 🌟 배너 클릭 영역 (점을 제외한 배경이나 글씨 클릭 시 이동) */}
      <div 
        style={{ width: '100%', height: '100%', cursor: currentBanner.link ? 'pointer' : 'default' }}
        onClick={() => currentBanner.link && navigate(currentBanner.link)}
      >
        <img 
          src={currentBanner.image} 
          alt={currentBanner.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            transition: 'transform 0.5s ease'
          }}
        />
        
        {/* 어두운 그라데이션 덮개 */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)'
        }} />

        {/* 텍스트 영역 */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: isMobile ? '24px' : '40px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {currentBanner.subtitle && (
            <span style={{ 
              fontSize: isMobile ? '12px' : '14px', 
              fontWeight: 700, 
              letterSpacing: '1px', 
              textTransform: 'uppercase',
              color: '#D4A373' 
            }}>
              {currentBanner.subtitle}
            </span>
          )}
          <h2 style={{ 
            fontSize: isMobile ? '28px' : '42px', 
            fontWeight: 800, 
            margin: 0,
            lineHeight: 1.2,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}>
            {currentBanner.title}
          </h2>
          
          {currentBanner.link && (
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              marginTop: '12px', 
              fontSize: '14px', 
              fontWeight: 600,
              opacity: 0.9 
            }}>
              자세히 보기 <ChevronRight size={16} />
            </div>
          )}
        </div>
      </div>

      {/* 🌟 하단 점(Pagination) 클릭 가능하도록 수정 */}
      {artists.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: isMobile ? '24px' : '40px',
          right: isMobile ? '24px' : '40px',
          display: 'flex',
          gap: '8px',
          zIndex: 10, // 점이 클릭 가능하도록 제일 위로 올리기
          padding: '10px' // 클릭하기 쉽게 여백을 줌
        }}>
          {artists.map((_, idx) => (
            <div 
              key={idx}
              onClick={(e) => {
                e.stopPropagation(); // ✨ 점을 눌렀을 때 배너의 자세히 보기 링크로 넘어가는 것을 막아줍니다!
                setCurrentIndex(idx); // 선택한 점의 인덱스로 슬라이드 변경
              }}
              style={{
                width: currentIndex === idx ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentIndex === idx ? '#D4A373' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer', // ✨ 마우스를 올리면 클릭 손가락 모양으로 변경
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}