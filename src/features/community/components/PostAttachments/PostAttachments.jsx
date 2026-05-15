// src/features/community/components/PostAttachments/PostAttachments.jsx
import clsx from 'clsx';
import styles from './PostAttachments.module.scss';

/**
 * 게시글의 첨부물 표시.
 * - images: 이미지 그리드 (1/2/3+ 레이아웃 자동)
 * - attached_products: 상품 카드 (placeholder; products 테이블 정식화 후 보강)
 * - external_links: 링크 프리뷰 카드
 *
 * @param {object} props
 * @param {object} props.attachments
 */
const PostAttachments = ({ attachments }) => {
  if (!attachments) return null;
  const { images = [], attached_products = [], external_links = [] } = attachments;

  const hasAny = images.length > 0 || attached_products.length > 0 || external_links.length > 0;
  if (!hasAny) return null;

  return (
    <div className={styles.wrapper}>
      {images.length > 0 && <ImageGrid images={images} />}

      {external_links.length > 0 && (
        <div className={styles.linkList}>
          {external_links.map((link, i) => (
            <a
              key={`${link.url}-${i}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkCard}
            >
              {link.thumbnail && (
                <img src={link.thumbnail} alt="" className={styles.linkThumb} />
              )}
              <div className={styles.linkBody}>
                <p className={styles.linkTitle}>{link.title ?? link.url}</p>
                <p className={styles.linkUrl}>{new URL(link.url).hostname}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {attached_products.length > 0 && (
        <div className={styles.productList}>
          {attached_products.map((productId) => (
            <ProductCardPlaceholder key={productId} productId={productId} />
          ))}
        </div>
      )}
    </div>
  );
};

const ImageGrid = ({ images }) => {
  const layout = images.length === 1 ? 'one' : images.length === 2 ? 'two' : 'many';

  return (
    <div className={clsx(styles.imageGrid, styles[`layout-${layout}`])}>
      {images.slice(0, 4).map((img, i) => (
        <div key={`${img.url}-${i}`} className={styles.imageCell}>
          <img src={img.url} alt={img.alt ?? ''} loading="lazy" />
          {i === 3 && images.length > 4 && (
            <div className={styles.imageMore}>+{images.length - 4}</div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * 상품 카드 placeholder.
 * products 테이블이 정식화되면 useProduct 훅으로 데이터 로드해 교체.
 */
const ProductCardPlaceholder = ({ productId }) => (
  <div className={styles.productCard}>
    <div className={styles.productThumb}>
      <span aria-hidden>🎁</span>
    </div>
    <div className={styles.productBody}>
      <p className={styles.productName}>상품 #{productId.slice(0, 8)}</p>
      <p className={styles.productNote}>상품 등록 기능 준비 중</p>
    </div>
  </div>
);

export default PostAttachments;