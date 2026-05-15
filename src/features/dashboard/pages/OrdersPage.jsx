import React, { useState, useEffect } from 'react';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import Card from '@/shared/ui/Card';
import { orderRepository } from '../api/orderRepository';
import styles from './OrdersPage.module.scss';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isMobile } = useResponsive();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // 복잡한 통신 코드는 Repository가 알아서 처리합니다.
        const data = await orderRepository.getOrders();
        setOrders(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const stats = {
    new: orders.filter(o => o.status === '신규주문').length,
    making: orders.filter(o => o.status === '제작중').length,
    ready: orders.filter(o => o.status === '배송준비').length,
    shipping: orders.filter(o => o.status === '배송중').length,
  };

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <h2 className={styles.title}>주문 및 제작 관리</h2>
      </header>

      {/* 통계 타일 영역 */}
      <div className={styles.statsGrid}>
        {[
          { label: '신규주문', count: stats.new, colorClass: styles.textBrand },
          { label: '제작중', count: stats.making, colorClass: styles.textGold },
          { label: '배송준비', count: stats.ready, colorClass: styles.textGreen },
          { label: '배송중', count: stats.shipping, colorClass: styles.textBlue }
        ].map(stat => (
          <Card key={stat.label} padding="md" className={styles.statTile}>
            <span className={styles.statLabel}>{stat.label}</span>
            <p className={`${styles.statValue} ${stat.colorClass}`}>{stat.count}</p>
          </Card>
        ))}
      </div>

      {/* 주문 리스트 테이블 */}
      <Card variant="soft" padding="md" className={styles.tableCard}>
        {loading ? (
          <p className={styles.emptyMessage}>주문 내역 로딩 중...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.orderTable}>
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>주문자</th>
                  <th>상품명</th>
                  <th>결제금액</th>
                  <th>상태</th>
                  <th>날짜</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={styles.emptyMessage}>아직 들어온 주문이 없습니다.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className={styles.orderId}>{order.orderId || 'N/A'}</td>
                      <td>{order.buyerName}</td>
                      <td>{order.productName}</td>
                      <td>₩{order.totalAmount?.toLocaleString()}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[`status-${order.status}`]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className={styles.dateText}>
                        {new Date(order.ordered_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}