import React from 'react';

const ToBeContinue = ({ title = "통계 분석 서비스" }) => {
  const styles = {
    // 1. 레이아웃: 사이드바를 제외한 나머지 공간을 꽉 채움
    wrapper: {
      flex: 1,            // Flex 레이아웃에서 남는 공간을 모두 차지
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',  // 대시보드 중앙에 위치하도록 최소 높이 설정
      padding: '40px',
      position: 'relative',
      backgroundColor: '#f8f9fa', // 대시보드 배경색과 맞춤
    },
    // 2. 카드 디자인: FAVORY 브랜드 가이드 반영
    card: {
      backgroundColor: '#ffffff',
      padding: '60px 40px',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(0, 0, 0, 0.03)',
      textAlign: 'center',
      maxWidth: '480px',
      width: '100%',
    },
    badge: {
      backgroundColor: '#E8F2FF', // 부드러운 포인트 컬러
      color: '#007AFF',
      padding: '6px 16px',
      borderRadius: '100px',
      fontSize: '13px',
      fontWeight: '700',
      marginBottom: '24px',
      display: 'inline-block',
    },
    title: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#1A1A1A',
      marginBottom: '16px',
      letterSpacing: '-0.5px',
    },
    description: {
      fontSize: '16px',
      color: '#666',
      lineHeight: '1.6',
      marginBottom: '32px',
    },
    launchDate: {
      color: '#1A1A1A',
      fontWeight: '700',
      borderBottom: '2px solid #007AFF',
      paddingBottom: '2px',
    },
    footerLogo: {
      fontSize: '14px',
      fontWeight: '900',
      color: '#E0E0E0',
      letterSpacing: '4px',
      marginTop: '20px',
      textTransform: 'uppercase'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.badge}>Product Update</div>
        <p style={styles.description}>
          해당 기능은 현재 내부 고도화 작업 중입니다.<br />
          더 강력해진 기능을 <span style={styles.launchDate}>8월 정식 출시</span>에서 확인하세요.
        </p>
        <div style={styles.footerLogo}>FAVORY</div>
      </div>
    </div>
  );
};

export default ToBeContinue;