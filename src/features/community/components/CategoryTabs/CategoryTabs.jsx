// src/features/community/components/CategoryTabs/CategoryTabs.jsx
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { POST_CATEGORIES } from '../../constants/postConstants';
import styles from './CategoryTabs.module.scss';

const ALL_TABS = [
  { key: null, label: '전체' },
  ...POST_CATEGORIES.map((c) => ({ key: c, label: c })),
];

/**
 * 가로 탭 — 카테고리 필터.
 *
 * 활성 탭 아래에 indicator 바.
 * 모바일에서 가로 스크롤.
 *
 * @param {object} props
 * @param {string|null} props.value
 * @param {(value: string|null) => void} props.onChange
 */
const CategoryTabs = ({ value, onChange }) => {
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  // 활성 탭이 바뀌면 화면에 보이도록 스크롤
  useEffect(() => {
    if (!activeRef.current || !containerRef.current) return;
    activeRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [value]);

  return (
    <div className={styles.wrapper} role="tablist" aria-label="카테고리">
      <div className={styles.scroll} ref={containerRef}>
        {ALL_TABS.map((tab) => {
          const active = value === tab.key;
          return (
            <button
              key={tab.key ?? '__all'}
              ref={active ? activeRef : null}
              type="button"
              role="tab"
              aria-selected={active}
              className={clsx(styles.tab, active && styles.tabActive)}
              onClick={() => onChange(tab.key)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className={styles.divider} aria-hidden />
    </div>
  );
};

export default CategoryTabs;