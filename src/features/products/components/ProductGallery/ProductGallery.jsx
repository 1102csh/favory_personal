// src/features/products/components/ProductGallery/ProductGallery.jsx
import clsx from 'clsx';
import styles from './ProductGallery.module.scss';

/**
 * 상품 메인 이미지 + 컬러 변형 썸네일 그리드.
 *
 * @param {object}   props
 * @param {string}   props.mainImage              - 현재 표시할 메인 이미지 URL
 * @param {string}   props.mainAlt                - 메인 이미지 alt
 * @param {Array<{id:string,label:string,image:string}>} props.variants
 * @param {string}   props.activeId               - 선택된 variant id
 * @param {(id:string)=>void} props.onSelect      - 썸네일 클릭 핸들러
 */
export default function ProductGallery({
  mainImage,
  mainAlt,
  variants,
  activeId,
  onSelect,
}) {
  return (
    <section className={styles.gallery} aria-label="상품 이미지">
      <div className={styles.mainImageWrap}>
        <img
          src={mainImage}
          alt={mainAlt}
          className={styles.mainImage}
          key={mainImage}
        />
      </div>

      <div className={styles.thumbList} role="radiogroup" aria-label="컬러 선택">
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={v.id === activeId}
            aria-label={v.label}
            className={clsx(styles.thumb, v.id === activeId && styles.thumbActive)}
            onClick={() => onSelect(v.id)}
          >
            <img src={v.image} alt="" />
          </button>
        ))}
      </div>
    </section>
  );
}
