// src/features/profile/components/PickCarousel/PickCarousel.jsx
import ProductCard from '../ProductCard';

export default function PickCarousel({ products }) {
  return (
    <div className="pick-carousel">
      {products.map((product) => (
        <ProductCard key={product.id} p={product} size="sm" />
      ))}
    </div>
  );
}