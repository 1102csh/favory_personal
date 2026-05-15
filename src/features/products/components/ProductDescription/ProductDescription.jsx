// src/features/products/components/ProductDescription/ProductDescription.jsx
import styles from './ProductDescription.module.scss';

/**
 * 상품 설명 섹션.
 *
 * @param {object} props
 * @param {{ intro: string, bullets: string[] }} props.description
 */
export default function ProductDescription({ description }) {
  return (
    <section className={styles.section} aria-label="상품 설명">
      <h2 className={styles.title}>상품 설명</h2>
      <p className={styles.intro}>{description.intro}</p>
      <ul className={styles.bulletList}>
        {description.bullets.map((b) => (
          <li key={b} className={styles.bulletItem}>{b}</li>
        ))}
      </ul>
    </section>
  );
}
