// src/features/community/components/CommunitySidebar/widgets/FeaturedArtistsWidget.jsx
import { useNavigate } from 'react-router-dom';
import styles from './FeaturedArtistsWidget.module.scss';

/**
 * 추천 작가 위젯 (placeholder).
 *
 * ⚠️ 임시 데이터입니다. 추후 다음으로 교체 예정:
 *   - 새 RPC: get_featured_artists(p_limit) — 활동량/팔로워 기준
 *   - features/community/hooks/useFeaturedArtists.js
 *
 * 클릭 시 작가 프로필로 이동.
 */
const MOCK_ARTISTS = [
  { id: 'mock-1', nickname: '봄결도예',    handle: 'bomgyeol',   tags: ['도자기', '서울'],  color: '#A8B89F' },
  { id: 'mock-2', nickname: '달빛블로지스트', handle: 'moonlight',  tags: ['클래스', '서울'],  color: '#D7A6A1' },
  { id: 'mock-3', nickname: '초록도예',    handle: 'green_studio', tags: ['소품', '부산'],   color: '#C6A878' },
  { id: 'mock-4', nickname: '책공노트',    handle: 'bookgong',     tags: ['책상', '제주'],   color: '#9A8C7E' },
];

const FeaturedArtistsWidget = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.widget} aria-label="추천 작가">
      <header className={styles.header}>
        <h3 className={styles.title}>주목할 작가</h3>
      </header>

      <ul className={styles.list}>
        {MOCK_ARTISTS.map((artist) => (
          <li key={artist.id} className={styles.item}>
            <button
              type="button"
              className={styles.artistBtn}
              onClick={() => navigate(`/users/${artist.id}`)}
            >
              <span
                className={styles.avatar}
                style={{ background: artist.color }}
                aria-hidden
              >
                {artist.nickname.charAt(0)}
              </span>
              <span className={styles.meta}>
                <span className={styles.name}>{artist.nickname}</span>
                <span className={styles.tags}>
                  {artist.tags.map((t) => `#${t}`).join(' · ')}
                </span>
              </span>
            </button>
            <button type="button" className={styles.followBtn}>
              팔로우
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FeaturedArtistsWidget;