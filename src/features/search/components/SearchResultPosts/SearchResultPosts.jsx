// src/features/search/components/SearchResultPosts/SearchResultPosts.jsx
import { Search as SearchIcon } from 'lucide-react';
import PostCard from '@/features/community/components/PostCard';
import styles from './SearchResultPosts.module.scss';

/**
 * 검색된 게시글 목록.
 *
 * @param {object} props
 * @param {object[]} props.posts
 * @param {boolean} props.isLoading
 * @param {string} props.activeTerm
 * @param {'query'|'tag'} props.mode
 * @param {(post) => void} props.onToggleLike
 * @param {(postId: string) => boolean} props.isLikePending
 * @param {(post) => void} props.onToggleBookmark
 * @param {(postId: string) => boolean} props.isBookmarkPending
 */
const SearchResultPosts = ({
  posts,
  isLoading,
  activeTerm,
  mode,
  onToggleLike,
  isLikePending,
  onToggleBookmark,
  isBookmarkPending,
}) => {
  if (isLoading && posts.length === 0) {
    return (
      <div className={styles.message}>
        <p>검색 중...</p>
      </div>
    );
  }

  if (!isLoading && posts.length === 0) {
    return (
      <div className={styles.empty}>
        <SearchIcon size={32} className={styles.emptyIcon} aria-hidden />
        <p className={styles.emptyTitle}>
          {mode === 'tag'
            ? `#${activeTerm} 태그를 가진 게시글이 없어요`
            : `"${activeTerm}"에 해당하는 게시글이 없어요`}
        </p>
        <p className={styles.emptyHint}>
          {mode === 'tag'
            ? '다른 태그를 시도해보세요.'
            : '다른 단어로 다시 검색해보세요.'}
        </p>
      </div>
    );
  }

  return (
    <section className={styles.section} aria-label="게시글 검색 결과">
      <header className={styles.header}>
        <h2 className={styles.title}>
          게시글 <span className={styles.count}>{posts.length}{!isLoading && '+'}</span>
        </h2>
      </header>

      <ul className={styles.list}>
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard
              post={post}
              onToggleLike={onToggleLike}
              isLikePending={isLikePending(post.id)}
              onToggleBookmark={onToggleBookmark}
              isBookmarkPending={isBookmarkPending(post.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SearchResultPosts;