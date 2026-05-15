// src/features/community/components/CommunitySidebar/widgets/WelcomeWidget.jsx
import styles from './WelcomeWidget.module.scss';

const ROADMAP = [
  { month: '5월', label: '매거진 + 작가 소식' },
  { month: '6월', label: '사진과 글쓰기' },
  { month: '7월', label: '작가샵 결제' },
];

/**
 * FAVORY 베타 안내 위젯.
 * 사이드바 첫 위젯으로 사용자에게 현재 단계와 향후 일정 안내.
 *
 * 추후 시즌별로 콘텐츠를 데이터 기반으로 관리하려면
 * announcements 테이블 또는 CMS 연동.
 */
const WelcomeWidget = () => {
  return (
    <section className={styles.widget} aria-label="FAVORY 안내">
      <header className={styles.header}>
        <div className={styles.icon} aria-hidden>
          ✦
        </div>
        <div>
          <h3 className={styles.title}>FAVORY 베타 진행 중</h3>
          <p className={styles.description}>
            공방 작가와 손님이 만나는 새로운 공간을 만들고 있어요.
          </p>
        </div>
      </header>

      <ul className={styles.roadmap}>
        {ROADMAP.map((item) => (
          <li key={item.month} className={styles.roadmapItem}>
            <span className={styles.roadmapMonth}>{item.month}</span>
            <span className={styles.roadmapLabel}>{item.label}</span>
          </li>
        ))}
      </ul>

      <button type="button" className={styles.cta}>
        업데이트 알림 받기
      </button>
    </section>
  );
};

export default WelcomeWidget;