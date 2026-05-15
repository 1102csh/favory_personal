import React from 'react';
import { TrendingUp, ShoppingBag, ArrowUpRight } from 'lucide-react';
import styles from './SalesSummary.module.scss';

export default function SalesSummary({ isMobile, data }) {
  // 데이터가 아직 로드되지 않았을 경우를 대비한 방어 코드
  if (!data) return null;

  return (
    <div className={styles.card}>
      {/* 위젯 헤더 */}
      <div className={styles.header}>
        <h3 className={styles.title}>실시간 매출 요약</h3>
        <span className={styles.dateBadge}>
          {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 기준
        </span>
      </div>

      {/* 데이터 표시 영역 */}
      <div className={`${styles.contentGrid} ${isMobile ? styles.mobileGrid : ''}`}>
        
        {/* 1. 총 매출 박스 */}
        <div className={styles.statBox}>
          <div className={styles.statHeader}>
            <div className={`${styles.iconWrapper} ${styles.revenueIcon}`}>
              <TrendingUp size={20} />
            </div>
            <span className={styles.statLabel}>이번 달 총 매출</span>
          </div>
          
          <div className={styles.statBody}>
            <h2 className={styles.statValue}>
              {data.totalRevenue?.toLocaleString() || 0}
              <span className={styles.unit}>원</span>
            </h2>
            {/* 상업용 디테일: 전일/전월 대비 상승률 UI (현재는 시각적 예시) */}
            <div className={styles.trendUp}>
              <ArrowUpRight size={14} />
              <span>12%</span>
            </div>
          </div>
        </div>

        {/* 2. 오늘 들어온 주문 박스 */}
        <div className={styles.statBox}>
          <div className={styles.statHeader}>
            <div className={`${styles.iconWrapper} ${styles.orderIcon}`}>
              <ShoppingBag size={20} />
            </div>
            <span className={styles.statLabel}>오늘 신규 주문</span>
          </div>
          
          <div className={styles.statBody}>
            <h2 className={styles.statValue}>
              {data.todayOrders || 0}
              <span className={styles.unit}>건</span>
            </h2>
            {data.todayOrders > 0 && (
              <div className={styles.badge}>
                배송 준비 필요
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}