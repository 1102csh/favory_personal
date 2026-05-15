// src/features/search/pages/SearchPage.jsx
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

import LegacyScope from '@/shared/ui/LegacyScope';
import Alert from '@/shared/ui/Alert';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import SiteNav from '@/features/home/components/SiteNav';

import { useSearch } from '../hooks/useSearch';
import { useSearchInput } from '../hooks/useSearchInput';

import SearchInput from '../components/SearchInput';
import SearchResultUsers from '../components/SearchResultUsers';
import SearchResultPosts from '../components/SearchResultPosts';
import SearchEmptyState from '../components/SearchEmptyState';

import { usePostLike } from '@/features/community/hooks/usePostLike';
import { usePostBookmark } from '@/features/community/hooks/usePostBookmark';

import styles from './SearchPage.module.scss';

/**
 * /search?q=... | /search?tag=...
 *
 * mode: 'query' | 'tag' | 'idle'
 *   - query: 게시글 + 작가 통합 검색
 *   - tag:   해당 태그를 가진 작가의 게시글
 *   - idle:  파라미터 없음 → 빈 상태 (인기 검색어 + 최근 검색어)
 */
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const queryParam = searchParams.get('q')?.trim() || '';
  const tagParam = searchParams.get('tag')?.trim() || '';

  const {
    mode,
    activeTerm,
    posts,
    users,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    replacePost,
  } = useSearch({ query: queryParam, tag: tagParam });

  const { toggleLike, isPending: isLikePending } = usePostLike({
    onLocalUpdate: replacePost,
  });
  const { toggleBookmark, isPending: isBookmarkPending } = usePostBookmark({
    onLocalUpdate: replacePost,
  });

  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled: hasMore && !isLoading && !isLoadingMore,
  });

  // 검색 입력 (페이지 자체 검색창)
  const { inputValue, setInputValue, handleSubmit } = useSearchInput({
    initialValue: queryParam,
  });

  return (
    <LegacyScope className={styles.page}>
      <SiteNav isMobile={isMobile} />

      <div className={styles.container}>
        {/* 헤더 — 큰 검색창 */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            {mode === 'tag' && (
              <>
                <span className={styles.tagLabel}>#{tagParam}</span> 태그 검색
              </>
            )}
            {mode === 'query' && (
              <>
                <span className={styles.queryLabel}>“{queryParam}”</span> 검색 결과
              </>
            )}
            {mode === 'idle' && '검색'}
          </h1>

          <SearchInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            placeholder="작가, 작품, 키워드로 검색"
            autoFocus={mode === 'idle'}
          />
        </header>

        {error && (
          <Alert tone={error.code === 'TOO_SHORT' ? 'warning' : 'danger'}>
            {error.message}
          </Alert>
        )}

        {/* 본문 */}
        {mode === 'idle' ? (
          <SearchEmptyState onSelect={(term, type) => navigate(`/search?${type}=${encodeURIComponent(term)}`)} />
        ) : (
          <main className={styles.main}>
            {/* 작가 결과 (query 모드일 때만) */}
            {mode === 'query' && users.length > 0 && (
              <SearchResultUsers users={users} />
            )}

            {/* 게시글 결과 */}
            <SearchResultPosts
              posts={posts}
              isLoading={isLoading}
              activeTerm={activeTerm}
              mode={mode}
              onToggleLike={toggleLike}
              isLikePending={isLikePending}
              onToggleBookmark={toggleBookmark}
              isBookmarkPending={isBookmarkPending}
            />

            <div ref={sentinelRef} aria-hidden style={{ height: 1 }} />

            {isLoadingMore && (
              <p className={styles.loadingMore}>불러오는 중...</p>
            )}
          </main>
        )}
      </div>
    </LegacyScope>
  );
};

export default SearchPage;