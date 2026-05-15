// src/features/products/components/ProductInfoPanel/ProductInfoPanel.jsx
import { Heart, Bookmark, ArrowUpRight, Plus, Check } from 'lucide-react';
import clsx from 'clsx';
import styles from './ProductInfoPanel.module.scss';

/**
 * 상품 상세 우측 정보 패널.
 *
 * 작가 행 / 제목 / 가격 / 변형 박스 / 외부 결제 안내 / 액션 버튼군 까지 담당.
 *
 * @param {object} props
 * @param {object} props.product
 * @param {object} props.currentVariant         - { id, label, size, image }
 * @param {boolean} props.liked
 * @param {boolean} props.saved
 * @param {boolean} props.followed
 * @param {()=>void} props.onToggleLike
 * @param {()=>void} props.onToggleSave
 * @param {()=>void} props.onToggleFollow
 */
export default function ProductInfoPanel({
  product,
  currentVariant,
  liked,
  saved,
  followed,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
}) {
  return (
    <section className={styles.info} aria-label="상품 정보">
      <ArtistRow artist={product.artist} followed={followed} onToggle={onToggleFollow} />

      <h1 className={styles.title}>{product.name}</h1>
      <p className={styles.price}>{product.price.toLocaleString()}원</p>

      <div className={styles.variantSection}>
        <span className={styles.sectionLabel}>색상</span>
        <div className={styles.variantBox}>
          {currentVariant.label}
          <span className={styles.variantDot}>·</span>
          {currentVariant.size}
        </div>
      </div>

      <div className={styles.notice} role="note">
        <span className={styles.noticeTitle}>외부 판매 채널 임시 연결</span>
        <p className={styles.noticeBody}>
          FAVORY 베타 기간엔 작가의 기존 판매 채널로 연결됩니다. 작가가 직접 운영하는
          채널이며, 정식 결제는 8월 이후 도입 예정입니다.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={clsx(styles.iconBtn, liked && styles.iconBtnActive)}
          onClick={onToggleLike}
          aria-pressed={liked}
          aria-label="좋아요"
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          className={clsx(styles.iconBtn, saved && styles.iconBtnActive)}
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label="저장"
        >
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.8} />
        </button>
        <a
          href={product.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.buyBtn}
        >
          구매하러가기
          <ArrowUpRight size={16} strokeWidth={2.2} />
        </a>
      </div>

      <p className={styles.buyNote}>버튼 클릭 시 외부 사이트로 이동합니다</p>
    </section>
  );
}

// 정보 패널 상단의 작가 행 — 패널과만 사용되므로 내부에 둠
function ArtistRow({ artist, followed, onToggle }) {
  return (
    <header className={styles.artistRow}>
      <img
        src={artist.avatar}
        alt={`${artist.name} 프로필`}
        className={styles.artistAvatar}
      />
      <div className={styles.artistMeta}>
        <span className={styles.artistNameLine}>
          {artist.name}
          {artist.isArtisan && <span className={styles.artistBadge}>작가</span>}
        </span>
        <span className={styles.artistHandle}>
          {artist.handle}
          <span className={styles.dot}>·</span>
          팔로워 {artist.followers}
        </span>
      </div>
      <button
        type="button"
        className={clsx(styles.followBtn, followed && styles.followBtnActive)}
        onClick={onToggle}
        aria-pressed={followed}
      >
        {followed ? (
          <>
            <Check size={14} strokeWidth={2.4} />
            팔로잉
          </>
        ) : (
          <>
            <Plus size={14} strokeWidth={2.4} />
            팔로우
          </>
        )}
      </button>
    </header>
  );
}
