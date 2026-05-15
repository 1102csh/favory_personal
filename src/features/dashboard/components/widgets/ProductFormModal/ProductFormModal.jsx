import React, { useState, useEffect } from 'react';
import { X, Package, FileText, Calendar, MapPin, Truck } from 'lucide-react';
import  Button  from '@/shared/ui/Button';
import { productRepository } from '../../../api/productRepository';
import styles from './ProductFormModal.module.scss';

export default function ProductFormModal({ isOpen, onClose, onSuccess, initialData = null }) {
  const isEditMode = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '상품', // 도안, 상품, 클래스 중 선택
    title: '', price: '', stock: '', 
    shipping_fee: 3000, location: '', class_date: '', description: ''
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        category: initialData.category || '상품',
        title: initialData.title || '',
        price: initialData.price || '',
        stock: initialData.stock || '',
        shipping_fee: initialData.shipping_fee || 0,
        location: initialData.location || '',
        class_date: initialData.class_date ? initialData.class_date.split('T')[0] : '',
        description: initialData.description || ''
      });
    } else {
      setFormData({ category: '상품', title: '', price: '', stock: '', shipping_fee: 3000, location: '', class_date: '', description: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode) await productRepository.updateProduct(initialData.id, formData);
      else await productRepository.createProduct(formData);
      onSuccess();
      onClose();
    } catch (error) { alert(error.message); }
    finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{isEditMode ? '항목 수정' : '신규 등록'}</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </header>

        <form id="productForm" onSubmit={handleSubmit} className={styles.scrollBody}>
          <div className={styles.formBody}>
            {/* 1. 카테고리 선택 섹션 (상업용 3대 분류) */}
            <section className={styles.categoryGrid}>
              {[
                { id: '도안', icon: <FileText size={18} />, label: '디지털 도안' },
                { id: '상품', icon: <Package size={18} />, label: '실물 상품' },
                { id: '클래스', icon: <Calendar size={18} />, label: '원데이 클래스' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={formData.category === cat.id ? styles.active : ''}
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                >
                  {cat.icon} <span>{cat.label}</span>
                </button>
              ))}
            </section>

            <section className={styles.formSection}>
              <div className={styles.inputGroup}>
                <label>제목 *</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="상품/도안/클래스 명을 입력하세요" />
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>판매가(원) *</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>{formData.category === '클래스' ? '정원(명)' : '재고(개)'} *</label>
                  <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                </div>
              </div>

              {/* 2. 조건부 입력창: 상품일 때만 배송비 */}
              {formData.category === '상품' && (
                <div className={styles.inputGroup}>
                  <label><Truck size={14} /> 배송비</label>
                  <input type="number" value={formData.shipping_fee} onChange={e => setFormData({...formData, shipping_fee: e.target.value})} />
                </div>
              )}

              {/* 3. 조건부 입력창: 클래스일 때만 장소/일시 */}
              {formData.category === '클래스' && (
                <div className={styles.classFields}>
                  <div className={styles.inputGroup}>
                    <label><MapPin size={14} /> 장소</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="공방 주소 또는 장소" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label><Calendar size={14} /> 일시</label>
                    <input type="date" value={formData.class_date} onChange={e => setFormData({...formData, class_date: e.target.value})} />
                  </div>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label>상세 설명</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
              </div>
            </section>
          </div>
        </form>

        <footer className={styles.modalFooter}>
          <Button type="button" variant="outline" onClick={onClose}>취소</Button>
          <Button type="submit" form="productForm" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : isEditMode ? '정보 수정' : '등록 완료'}
          </Button>
        </footer>
      </div>
    </div>
  );
}