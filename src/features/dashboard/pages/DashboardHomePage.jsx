import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react'; // 로딩 아이콘 추가
import { useResponsive } from '../../../shared/hooks/useResponsive';
import SalesSummary from '../components/widgets/SalesSummary';
import OrderStages from '../components/widgets/OrderStages';
import ChecklistCard from '../components/widgets/ChecklistCard';
import RecentReviewCard from '../components/widgets/RecentReviewCard';
import styles from './DashboardHomePage.module.scss';

// 💡 DB 통신을 담당할 리포지토리 불러오기
import { dashboardRepository } from '../api/dashboardRepository'; 

export default function DashboardHomePage() {
  const { isMobile } = useResponsive(); 

  // --- 🌟 상태 관리 (DB 데이터, 로딩, 에러) ---
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 🌟 DB 연동 로직 ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 리포지토리에서 대시보드 화면에 필요한 모든 데이터를 한 번에 가져옵니다.
        const result = await dashboardRepository.getHomeData();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 로딩 중 화면 처리
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="spinner" size={40} color="#D4A373" />
      </div>
    );
  }

  // 에러 발생 시 화면 처리
  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', color: '#EF4444' }}>
        <AlertCircle size={40} />
        <p>데이터를 불러오지 못했습니다: {error}</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <h2 className={styles.title}>공방 실시간 현황</h2>
      </header>

      <div className={styles.dashboardGrid}>
        {/* 🌟 가져온 데이터를 각 위젯에 props로 뿌려줍니다! */}
        
        <section className={styles.fullWidth}>
          {/* 매출 요약 위젯에 매출 데이터 전달 */}
          <SalesSummary isMobile={isMobile} data={data.sales} />
        </section>

        <section className={styles.fullWidth}>
          {/* 주문 단계 위젯에 주문 데이터 전달 */}
          <OrderStages isMobile={isMobile} data={data.orders} />
        </section>

        <div className={styles.bottomRow}>
          {/* 체크리스트와 리뷰 위젯에도 각각의 데이터 전달 */}
          <ChecklistCard data={data.checklists} />
          <RecentReviewCard data={data.reviews} />
        </div>
      </div>
    </div>
  );
}