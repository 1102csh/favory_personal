// src/features/profile/components/ProfileTags/ProfileTags.jsx
import { useNavigate } from 'react-router-dom';
import { formatTagDisplay } from '../../lib/tagUtils';

/**
 * 프로필 태그 목록 (칩).
 *
 * @param {object} props
 * @param {string[]} props.tags
 * @param {boolean} [props.isMobile]
 * @param {boolean} [props.clickable=true]   - 클릭 시 태그 검색 이동 여부
 */
export default function ProfileTags({ tags, isMobile, clickable = true }) {
  const navigate = useNavigate();

  if (!Array.isArray(tags) || tags.length === 0) return null;

  const handleClick = (tag) => {
    if (!clickable) return;
    // 추후 태그 검색 페이지 라우트 (현재는 placeholder URL)
    navigate(`/search?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: isMobile ? 6 : 7,
      }}
    >
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => handleClick(tag)}
          className={clickable ? 'press' : undefined}
          style={{
            background: 'var(--bg-soft)',
            color: 'var(--brand-dark)',
            border: '1px solid var(--line)',
            borderRadius: 999,
            padding: isMobile ? '5px 11px' : '6px 12px',
            fontSize: isMobile ? 11.5 : 12,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            cursor: clickable ? 'pointer' : 'default',
            transition: 'background 0.18s, border-color 0.18s',
          }}
        >
          {formatTagDisplay(tag)}
        </button>
      ))}
    </div>
  );
}