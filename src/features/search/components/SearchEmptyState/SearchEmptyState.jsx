// src/features/search/components/SearchEmptyState/SearchEmptyState.jsx
import { useEffect, useState, useCallback } from 'react';
import { Clock, TrendingUp, X, Trash2 } from 'lucide-react';
import { searchHistory } from '../../lib/searchHistory';
import { POPULAR_SEARCHES } from '../../data/popularSearches';
import styles from './SearchEmptyState.module.scss';

/**
 * 검색 페이지의 빈 상태 (q도 tag도 없을 때).
 *
 * 두 영역:
 *   1) 최근 검색어 (localStorage)
 *   2) 인기 검색어 (mock, 추후 RPC)
 *
 * @param {object} props
 * @param {(term: string, type: 'q'|'tag') => void} props.onSelect
 */
const SearchEmptyState = ({ onSelect }) => {
  const [history, setHistory] = useState([]);

  const refreshHistory = useCallback(() => {
    setHistory(searchHistory.list());
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const handleRemove = (item) => {
    searchHistory.remove(item.query, item.type);
    refreshHistory();
  };

  const handleClearAll = () => {
    if (!window.confirm('최근 검색 기록을 모두 삭제할까요?')) return;
    searchHistory.clear();
    refreshHistory();
  };

  return (
    <div className={styles.wrap}>
      {/* 최근 검색 */}
      {history.length > 0 && (
        <section className={styles.section} aria-label="최근 검색">
          <header className={styles.header}>
            <div className={styles.headerTitle}>
              <Clock size={16} aria-hidden />
              <h2 className={styles.title}>최근 검색</h2>
            </div>
            <button
              type="button"
              className={styles.clearAllBtn}
              onClick={handleClearAll}
            >
              <Trash2 size={13} aria-hidden />
              <span>전체 삭제</span>
            </button>
          </header>

          <ul className={styles.chipList}>
            {history.map((item) => (
              <li key={`${item.type}:${item.query}`} className={styles.chip}>
                <button
                  type="button"
                  className={styles.chipBtn}
                  onClick={() => onSelect?.(item.query, item.type)}
                >
                  {item.type === 'tag' ? '#' : ''}
                  {item.query}
                </button>
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={() => handleRemove(item)}
                  aria-label={`${item.query} 검색 기록 삭제`}
                >
                  <X size={12} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 인기 검색어 */}
      <section className={styles.section} aria-label="인기 검색어">
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <TrendingUp size={16} aria-hidden />
            <h2 className={styles.title}>지금 많이 찾는</h2>
          </div>
        </header>

        <ol className={styles.popularList}>
          {POPULAR_SEARCHES.map((item, i) => (
            <li key={`${item.type}:${item.term}`}>
              <button
                type="button"
                className={styles.popularBtn}
                onClick={() => onSelect?.(item.term, item.type)}
              >
                <span className={styles.rank}>{i + 1}</span>
                <span className={styles.popularTerm}>
                  {item.type === 'tag' ? '#' : ''}{item.term}
                </span>
                <TrendIcon trend={item.trend} />
              </button>
            </li>
          ))}
        </ol>

        <p className={styles.notice}>
          ※ 임시 데이터입니다. 검색 통계 RPC 도입 후 교체될 예정이에요.
        </p>
      </section>
    </div>
  );
};

const TrendIcon = ({ trend }) => {
  if (trend === 'up') {
    return <span className={`${styles.trend} ${styles.trendUp}`}>▲</span>;
  }
  if (trend === 'down') {
    return <span className={`${styles.trend} ${styles.trendDown}`}>▼</span>;
  }
  return <span className={`${styles.trend} ${styles.trendFlat}`}>—</span>;
};

export default SearchEmptyState;