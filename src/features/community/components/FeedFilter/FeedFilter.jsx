// src/features/community/components/FeedFilter/FeedFilter.jsx
import clsx from 'clsx';
import { POST_CATEGORIES } from '../../constants/postConstants';
import styles from './FeedFilter.module.scss';

/**
 * 카테고리 필터 바.
 *
 * @param {object} props
 * @param {string|null} props.value
 * @param {(value: string|null) => void} props.onChange
 */
const FeedFilter = ({ value, onChange }) => {
  const all = [{ key: null, label: '전체' }].concat(
    POST_CATEGORIES.map((c) => ({ key: c, label: c }))
  );

  return (
    <div
      className={styles.bar}
      role="tablist"
      aria-label="카테고리 필터"
    >
      {all.map((item) => {
        const active = value === item.key;
        return (
          <button
            key={item.key ?? '__all'}
            type="button"
            role="tab"
            aria-selected={active}
            className={clsx(styles.chip, active && styles.active)}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default FeedFilter;