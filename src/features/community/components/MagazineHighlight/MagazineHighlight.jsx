// src/features/community/components/MagazineHighlight/MagazineHighlight.jsx
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import styles from './MagazineHighlight.module.scss';

const WORDS_PER_MINUTE = 500;

const estimateReadMinutes = (content) => {
  if (!content) return 1;
  const length = content.replace(/\s+/g, '').length;
  return Math.max(1, Math.round(length / WORDS_PER_MINUTE));
};

/**
 * 피드 상단 매거진 큐레이션 캐러셀.
 * "전체" 세그먼트에서만 노출.
 *
 * @param {object} props
 * @param {Array} props.magazines           - useFeaturedMagazines가 반환한 post 배열
 * @param {() => void} [props.onMore]       - "모두 보기" 클릭 시 (매거진 세그먼트로 전환)
 */
const MagazineHighlight = ({ magazines, onMore }) => {
  if (!magazines || magazines.length === 0) return null;

  return (
    <section className={styles.section} aria-label="이주의 매거진">
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <BookOpen size={18} className={styles.titleIcon} aria-hidden />
          <h2 className={styles.title}>이주의 매거진</h2>
        </div>
        {onMore && (
          <button
            type="button"
            className={styles.moreButton}
            onClick={onMore}
          >
            모두 보기
            <ArrowRight size={14} />
          </button>
        )}
      </header>

      <div className={styles.scroll}>
        <ul className={styles.track}>
          {magazines.map((post) => {
            const cover = post.attachments?.images?.[0]?.url;
            const title = post.title || (post.content?.split('\n')[0] ?? '');
            const author =
              post.author?.nickname ?? post.author_nickname ?? 'FAVORY';
            const readMinutes = estimateReadMinutes(post.content);

            return (
              <li key={post.id} className={styles.item}>
                <Link
                  to={`/community/posts/${post.id}`}
                  className={styles.card}
                >
                  <div className={styles.imageWrap}>
                    {cover ? (
                      <img
                        src={cover}
                        alt=""
                        className={styles.image}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.imageFallback}>
                        <BookOpen size={28} aria-hidden />
                      </div>
                    )}
                    <span className={styles.badge}>MAGAZINE</span>
                  </div>

                  <div className={styles.body}>
                    <h3 className={styles.cardTitle}>{title}</h3>
                    <p className={styles.meta}>
                      <span>{author}</span>
                      <span className={styles.metaDivider}>·</span>
                      <span>{readMinutes}분 읽기</span>
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default MagazineHighlight;
