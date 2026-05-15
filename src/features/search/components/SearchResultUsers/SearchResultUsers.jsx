// src/features/search/components/SearchResultUsers/SearchResultUsers.jsx
import { useNavigate } from 'react-router-dom';
import { hasArtisanAccess } from '@/shared/lib/auth/roleUtils';
import styles from './SearchResultUsers.module.scss';

/**
 * 검색된 작가/사용자 목록.
 *
 * @param {object} props
 * @param {object[]} props.users   - normalize된 user 객체 배열
 *   { id, nickname, handle, bio, avatarUrl, role, tags }
 */
const SearchResultUsers = ({ users }) => {
  const navigate = useNavigate();
  if (!users?.length) return null;

  return (
    <section className={styles.section} aria-label="작가 검색 결과">
      <header className={styles.header}>
        <h2 className={styles.title}>작가 · 사용자 {users.length}명</h2>
      </header>

      <ul className={styles.list}>
        {users.map((u) => (
          <li key={u.id}>
            <button
              type="button"
              className={styles.userBtn}
              onClick={() => navigate(`/users/${u.id}`)}
            >
              {u.avatarUrl ? (
                <img
                  src={u.avatarUrl}
                  alt=""
                  className={styles.avatar}
                />
              ) : (
                <span className={styles.avatarFallback}>
                  {u.nickname?.charAt(0) ?? '?'}
                </span>
              )}

              <span className={styles.meta}>
                <span className={styles.metaTop}>
                  <span className={styles.nickname}>{u.nickname}</span>
                  {hasArtisanAccess(u) && (
                    <span className={styles.roleBadge}>작가</span>
                  )}
                </span>

                {u.handle && (
                  <span className={styles.handle}>@{u.handle}</span>
                )}

                {u.bio && (
                  <span className={styles.bio}>{u.bio}</span>
                )}

                {u.tags?.length > 0 && (
                  <span className={styles.tags}>
                    {u.tags.slice(0, 4).map((t) => (
                      <span key={t} className={styles.tagChip}>#{t}</span>
                    ))}
                    {u.tags.length > 4 && (
                      <span className={styles.tagMore}>+{u.tags.length - 4}</span>
                    )}
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SearchResultUsers;