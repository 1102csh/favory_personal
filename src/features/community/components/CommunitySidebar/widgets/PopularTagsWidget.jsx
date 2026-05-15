// src/features/community/components/CommunitySidebar/widgets/PopularTagsWidget.jsx
import { useNavigate } from 'react-router-dom';
import styles from './PopularTagsWidget.module.scss';

/**
 * 인기 태그 위젯 (placeholder).
 *
 * ⚠️ 임시 데이터입니다. 추후 다음으로 교체 예정:
 *   - 새 RPC: get_popular_tags(p_limit, p_period)
 *   - features/community/hooks/usePopularTags.js
 *
 * 클릭 시 추후 /search?tag={tag} 페이지로 이동.
 */
const MOCK_TAGS = [
  { tag: '도자기',       count: 24 },
  { tag: '뜨개',         count: 18 },
  { tag: '캔들',         count: 15 },
  { tag: '자수',         count: 12 },
  { tag: '원데이클래스', count: 11 },
  { tag: '서울',         count: 9 },
  { tag: '핸드메이드',   count: 8 },
];

const PopularTagsWidget = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.widget} aria-label="인기 태그">
      <header className={styles.header}>
        <h3 className={styles.title}>이번 주 인기 태그</h3>
      </header>

      <ul className={styles.list}>
        {MOCK_TAGS.map((item, i) => (
          <li key={item.tag}>
            <button
              type="button"
              className={styles.tagBtn}
              onClick={() => navigate(`/search?tag=${encodeURIComponent(item.tag)}`)}
            >
              <span className={styles.rank}>{i + 1}</span>
              <span className={styles.tagName}>#{item.tag}</span>
              <span className={styles.count}>{item.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PopularTagsWidget;