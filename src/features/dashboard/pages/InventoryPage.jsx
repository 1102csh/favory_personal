import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Package, FileText, Calendar, 
  MapPin, Truck, AlertCircle, Loader2, Filter
} from 'lucide-react';
import  Card  from '@/shared/ui/Card';
import  Button  from '@/shared/ui/Button';
import { productRepository } from '../api/productRepository';
import ProductFormModal from '../components/widgets/ProductFormModal/ProductFormModal';
import styles from './InventoryPage.module.scss';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productRepository.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("로딩 실패:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAddModal = () => { setSelectedProduct(null); setIsModalOpen(true); };
  const openEditModal = (product) => { setSelectedProduct(product); setIsModalOpen(true); };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === '전체' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.container}>
      {/* 1. 상단 헤더: 타이틀과 등록 버튼 */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>인벤토리 관리</h2>
          <p className={styles.subtitle}>공방의 모든 자산을 한눈에 관리하세요.</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={openAddModal}>
          신규 등록
        </Button>
      </header>

      {/* 2. 통합 컨트롤 바: 카테고리 필터 + 검색창 (깔끔한 정렬) */}
      <div className={styles.controlBar}>
        <div className={styles.filterSegment}>
          {['전체', '도안', '상품', '클래스'].map(tab => (
            <button
              key={tab}
              className={`${styles.segmentBtn} ${activeCategory === tab ? styles.active : ''}`}
              onClick={() => setActiveCategory(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="상품명으로 검색..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* 3. 상품 목록 그리드 */}
      {loading ? (
        <div className={styles.loadingState}><Loader2 className={styles.spinner} /></div>
      ) : (
        <div className={styles.productGrid}>
          {filteredProducts.map(product => (
            <Card key={product.id} className={styles.productCard} onClick={() => openEditModal(product)}>
              <div className={styles.cardBadgeArea}>
                <span className={`${styles.typeTag} ${styles[product.category]}`}>
                  {product.category}
                </span>
                {product.stock < 5 && <span className={styles.lowStock}>품절임박</span>}
              </div>
              <h3 className={styles.productTitle}>{product.title}</h3>
              <div className={styles.cardInfo}>
                <span className={styles.price}>₩{product.price?.toLocaleString()}</span>
                <span className={styles.stock}>재고 {product.stock}개</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProducts} 
        initialData={selectedProduct} 
      />
    </div>
  );
}