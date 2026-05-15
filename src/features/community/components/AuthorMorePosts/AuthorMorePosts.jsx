// src/features/community/components/AuthorMorePosts/AuthorMorePosts.jsx
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ImageOff } from 'lucide-react';

import { useArtistPosts } from '@/features/profile/hooks/useArtistPosts';
import { formatRelativeTime } from '@/shared/lib/formatters/relativeTime';

import styles from './AuthorMorePosts.module.scss';

const MORE_LIMIT = 4;
// 현재 글을 제외할 수 있도록 한 개 더 받아옴
const FETCH_LIMIT = MORE_LIMIT + 1;

const getTitle = (post) => {
  if (post.title) return post.title;
  const firstLine = (post.content ?? '').split('\n').find((l) => l.trim());
  return firstLine ?? '제목 없음';
};

/**
 * 상세 페이지 하단에 노출되는 "이 작가의 다른 글" 섹션.
 *
 * @param {object} props
 * @param {string} props.authorId        - 작가 사용자 id
 * @param {string} props.authorName      - 작가 닉네임 (제목 표시용)
 * @param {string} props.excludePostId   - 현재 상세 페이지 글의 id (목록에서 제외)
 */
const AuthorMorePosts = ({ authorId, authorName, excludePostId }) => {
  const { posts, isLoading } = useArtistPosts(authorId, { limit: FETCH_LIMIT });

  const otherPosts = useMemo(
    () => posts.filter((p) => p.id !== excludePostId).slice(0, MORE_LIMIT),
    [posts, excludePostId]
  );

  // 로딩 중 / 다른 글 없음 → 섹션 자체를 렌더링하지 않음
  if (isLoading || otherPosts.length === 0) return null;

  return (
    <section className={styles.section} aria-label="이 작가의 다른 글">
      <header className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.author}>{authorName}</span>
          <span className={styles.titleTail}>의 다른 글</span>
        </h2>
        <Link to={`/users/${authorId}`} className={styles.moreLink}>
          프로필 보기 <ArrowRight size={14} />
        </Link>
      </header>

      <ul className={styles.grid}>
        {otherPosts.map((post) => {
          const image = post.attachments?.images?.[0]?.url;
          return (
            <li key={post.id}>
              <Link
                to={`/community/posts/${post.id}`}
                className={styles.card}
              >
                <div className={styles.thumbnail}>
                  {image ? (
                    <img src={image} alt="" loading="lazy" />
                  ) : (
                    <div className={styles.thumbnailFallback} aria-hidden>
                      <ImageOff size={20} />
                    </div>
                  )}
                </div>
                <div className={styles.body}>
                  <h3 className={styles.cardTitle}>{getTitle(post)}</h3>
                  <p className={styles.meta}>
                    <span>{formatRelativeTime(post.created_at)}</span>
                    <span className={styles.dot} aria-hidden>·</span>
                    <span>♡ {post.like_count ?? 0}</span>
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default AuthorMorePosts;
