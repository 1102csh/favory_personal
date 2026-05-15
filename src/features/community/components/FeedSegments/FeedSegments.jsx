// src/features/community/components/FeedSegments/FeedSegments.jsx
import clsx from 'clsx';
import styles from './FeedSegments.module.scss';

export const FEED_SEGMENTS = Object.freeze({
  ALL: 'all',
  MAGAZINE: 'magazine',
  NEWS: 'news',
});

const SEGMENT_LIST = [
  { key: FEED_SEGMENTS.ALL, label: '전체' },
  { key: FEED_SEGMENTS.MAGAZINE, label: '매거진' },
  { key: FEED_SEGMENTS.NEWS, label: '소식' },
];

/**
 * 피드 1차 세그먼트 — post_type 기반 필터.
 * CategoryTabs(2차 카테고리)와 시각적으로 구분되도록 pill 스타일.
 *
 * @param {object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 */
const FeedSegments = ({ value, onChange }) => {
  return (
    <div role="tablist" aria-label="피드 구분" className={styles.wrapper}>
      {SEGMENT_LIST.map((seg) => {
        const active = value === seg.key;
        return (
          <button
            key={seg.key}
            type="button"
            role="tab"
            aria-selected={active}
            className={clsx(styles.segment, active && styles.segmentActive)}
            onClick={() => onChange(seg.key)}
          >
            {seg.label}
          </button>
        );
      })}
    </div>
  );
};

export default FeedSegments;
