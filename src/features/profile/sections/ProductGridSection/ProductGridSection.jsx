// src/features/profile/sections/ProductGridSection/ProductGridSection.jsx
import ProductCard from '../../components/ProductCard';

/**
 * 상품/도안/클래스 탭의 그리드 레이아웃.
 *
 * @param {object} props
 * @param {Array} props.products
 * @param {number} props.gridCols
 * @param {boolean} props.isMobile
 */
export default function ProductGridSection({ products, gridCols, isMobile }) {
  return (
    <div
      className="product-grid-wrap"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gap: isMobile ? 12 : 18,
        padding: isMobile ? '0 18px' : '0',
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} p={product} />
      ))}
    </div>
  );
}