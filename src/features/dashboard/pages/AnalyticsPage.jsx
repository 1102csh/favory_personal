import React from 'react';
import { TrendingUp, Users, Eye, MousePointerClick } from 'lucide-react';
import Card from '@/shared/ui/Card';
import styles from './AnalyticsPage.module.scss';

// 상용 앱에서는 analyticsRepository를 통해 백엔드에서 집계된 데이터를 가져옵니다.
const MOCK_CHART_DATA = [
  { day: '월', value: 40 }, { day: '화', value: 70 }, 
  { day: '수', value: 45 }, { day: '목', value: 90 }, 
  { day: '금', value: 65 }, { day: '토', value: 100 }, { day: '일', value: 30 }
];

export default function AnalyticsPage() {
  const maxChartValue = Math.max(...MOCK_CHART_DATA.map(d => d.value));

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <h2 className={styles.title}>분석 통계 데이터</h2>
        <p className={styles.subtitle}>공방의 방문자 추이와 전환율을 확인하세요.</p>
      </header>

      {/* 핵심 지표(KPI) 요약 카드 */}
      <div className={styles.kpiGrid}>
        <Card padding="md" className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>이번 주 방문자</span>
            <Users size={18} className={styles.kpiIcon} />
          </div>
          <p className={styles.kpiValue}>1,248<span className={styles.unit}>명</span></p>
          <p className={styles.kpiTrend}><TrendingUp size={14} /> 전주 대비 15% 상승</p>
        </Card>
        
        <Card padding="md" className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>상품 조회수</span>
            <Eye size={18} className={styles.kpiIcon} />
          </div>
          <p className={styles.kpiValue}>4,502<span className={styles.unit}>회</span></p>
          <p className={styles.kpiTrend}><TrendingUp size={14} /> 전주 대비 8% 상승</p>
        </Card>

        <Card padding="md" className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>구매 전환율</span>
            <MousePointerClick size={18} className={styles.kpiIcon} />
          </div>
          <p className={styles.kpiValue}>3.2<span className={styles.unit}>%</span></p>
          <p className={`${styles.kpiTrend} ${styles.down}`} /* 하락일 경우 클래스 분기 */>
            전주 대비 0.4% 하락
          </p>
        </Card>
      </div>

      {/* 방문자 추이 차트 영역 */}
      <Card variant="soft" padding="lg" className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>📈 주간 방문자 추이</h3>
          <span className={styles.chartMeta}>최근 7일 기준</span>
        </div>
        
        <div className={styles.barChart}>
          {MOCK_CHART_DATA.map((data, idx) => {
            const heightPercent = (data.value / maxChartValue) * 100;
            const isToday = idx === 3; // 임시로 '목'요일을 오늘(강조)로 설정

            return (
              <div key={data.day} className={styles.barWrapper}>
                <div className={styles.barBackground}>
                  <div 
                    className={`${styles.barFill} ${isToday ? styles.activeBar : ''}`} 
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className={`${styles.barLabel} ${isToday ? styles.activeLabel : ''}`}>
                  {data.day}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}