// src/features/products/components/ArtistIntro/ArtistIntro.jsx
import styles from './ArtistIntro.module.scss';

/**
 * 상품 상세 하단의 작가 소개 섹션.
 *
 * @param {object} props
 * @param {{ intro: string }} props.artist
 */
export default function ArtistIntro({ artist }) {
  return (
    <section className={styles.section} aria-label="작가 소개">
      <h2 className={styles.title}>작가 소개</h2>
      <p className={styles.intro}>{artist.intro}</p>
    </section>
  );
}
