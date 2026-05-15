// src/features/profile/components/ProductCard/ProductCard.jsx
import { useNavigate } from 'react-router-dom';
import Badge from '../Badge';

/**
 * 상품 카드.
 *
 * @param {object} props
 * @param {object} props.p           - 상품 데이터 (id, type, name, price, status, img, ...)
 * @param {'sm'|'md'} [props.size='md']
 */
export default function ProductCard({ p, size = 'md' }) {
  const isSmall = size === 'sm';
  const navigate = useNavigate();

  const handleMoveDetail = () => {
    // 추후: 상품/도안/클래스 별도 라우트로 분기 가능
    navigate(`/products/${p.id}`);
  };

  return (
    <article
      className={`product-card ${isSmall ? 'product-card--sm' : ''}`}
      onClick={handleMoveDetail}
    >
      <div className="product-card__image-wrap">
        <img src={p.img} alt={p.name} className="product-card__image" />

        <div className="product-card__badge">
          <Badge type={p.type} />
        </div>

        {p.status === '마감' && (
          <div className="product-card__soldout">
            <span>SOLD OUT</span>
          </div>
        )}

        {p.type === '클래스' && (
          <div
            className={`product-card__scheduled ${
              p.location === '온라인' ? 'product-card__scheduled--online' : ''
            }`}
          >
            {p.location === '온라인' ? '온라인' : '오프라인'}
          </div>
        )}
      </div>

      <div className="product-card__body">
        <p className="product-card__name">{p.name}</p>

        {p.type === '상품' && p.delivery && (
          <p className="product-card__sub">{p.delivery}</p>
        )}
        {p.type === '도안' && p.pages && (
          <p className="product-card__sub">총 {p.pages}p</p>
        )}
        {p.type === '클래스' && p.location && (
          <p className="product-card__sub">{p.location} · {p.duration}</p>
        )}

        <div className="product-card__bottom">
          <span className="product-card__price">
            {p.price.toLocaleString()}
            <span className="product-card__price-unit">원</span>
          </span>
        </div>
      </div>
    </article>
  );
}