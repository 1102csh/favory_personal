import React, { useState } from 'react';
import { TrendingUp, Download } from 'lucide-react';
import Card from '@/shared/ui/Card';
import Button from '@/shared/ui/Button';
import styles from './SalesPage.module.scss';

const MOCK_SETTLEMENT = [
  { id: 1, date: "2026-05-01", amount: 450000, status: "정산예정", method: "신용카드" },
  { id: 2, date: "2026-04-15", amount: 1280000, status: "정산완료", method: "계좌이체" },
  { id: 3, date: "2026-04-01", amount: 890000, status: "정산완료", method: "신용카드" },
];

export default function SalesPage() {
  const [history] = useState(MOCK_SETTLEMENT);

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>판매/정산</h2>
          <p className={styles.subtitle}>수익 현황을 확인하고 정산 일정을 관리하세요.</p>
        </div>
        <Button variant="outline" icon={<Download size={16} />}>
          보고서 다운로드
        </Button>
      </header>

      {/* 상단 매출 요약 3단 카드 */}
      <div className={styles.summaryGrid}>
        <Card variant="dark" padding="lg" className={styles.highlightCard}>
          <p className={styles.cardLabel}>이번 달 예상 정산액</p>
          <h3 className={styles.cardAmount}>450,000원</h3>
          <div className={styles.trendInfo}>
            <TrendingUp size={14} /> 전월 대비 12% 상승
          </div>
        </Card>

        <Card variant="soft" padding="lg">
          <p className={styles.cardLabelDark}>누적 판매 금액</p>
          <h3 className={styles.cardAmountDark}>15,420,000원</h3>
          <p className={styles.cardSubText}>총 124건의 거래</p>
        </Card>

        <Card variant="soft" padding="lg">
          <p className={styles.cardLabelDark}>다음 정산 예정일</p>
          <h3 className={styles.cardAmountDark}>05. 15</h3>
          <p className={styles.cardSubTextDark}>매월 15일, 30일 정산</p>
        </Card>
      </div>

      {/* 정산 내역 테이블 */}
      <Card padding="md" className={styles.tableCard}>
        <h3 className={styles.sectionTitle}>상세 내역</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.salesTable}>
            <thead>
              <tr>
                <th>정산일</th>
                <th>결제 방식</th>
                <th>정산 상태</th>
                <th className={styles.alignRight}>정산 금액</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td className={styles.methodText}>{item.method}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${item.status === '정산완료' ? styles.statusDone : styles.statusPending}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className={`${styles.alignRight} ${styles.amountText}`}>
                    {item.amount.toLocaleString()}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}