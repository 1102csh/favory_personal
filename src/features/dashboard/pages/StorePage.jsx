import React, { useState, useEffect } from 'react';
import { Camera, Save, Phone, Globe, Info, Loader2 } from 'lucide-react';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import  Card  from '@/shared/ui/Card';
import  Button  from '@/shared/ui/Button';
import { storeRepository } from '../api/storeRepository';
import styles from './StorePage.module.scss';

export default function StorePage() {
  const { isMobile } = useResponsive();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. 스토어 데이터 상태 관리
  const [storeInfo, setStoreInfo] = useState({
    name: '',
    description: '',
    phone: '',
    instagram: ''
  });

  // 2. 초기 데이터 로드 (컴포넌트 마운트 시)
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        setLoading(true);
        const data = await storeRepository.getStoreInfo();
        if (data) {
          setStoreInfo({
            name: data.name || '',
            description: data.description || '',
            phone: data.phone || '',
            instagram: data.instagram || ''
          });
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadStoreData();
  }, []);

  // 3. 입력값 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo(prev => ({ ...prev, [name]: value }));
  };

  // 4. 데이터 저장 핸들러 (Upsert 방식)[cite: 1]
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!storeInfo.name.trim()) {
      alert("공방 이름은 필수 항목입니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      await storeRepository.updateStoreInfo(storeInfo);
      alert('스토어 정보가 성공적으로 저장되었습니다!');
    } catch (error) {
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} />
        <p>스토어 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <h2 className={styles.title}>스토어 설정</h2>
        <p className={styles.subtitle}>고객에게 보여질 공방의 브랜드 프로필을 관리하세요.</p>
      </header>

      <form onSubmit={handleSave} className={styles.formLayout}>
        {/* 기본 프로필 섹션 */}
        <Card variant="soft" padding={isMobile ? 'md' : 'lg'}>
          <h3 className={styles.sectionTitle}>기본 정보</h3>
          
          <div className={styles.profileUploadArea}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                {storeInfo.name ? storeInfo.name.substring(0, 2).toUpperCase() : 'FA'}
              </div>
              <button type="button" className={styles.cameraBtn} title="이미지 변경">
                <Camera size={14} />
              </button>
            </div>
            <div className={styles.uploadText}>
              <p className={styles.uploadTitle}>로고 / 프로필 이미지</p>
              <p className={styles.uploadDesc}>상점에 표시될 대표 이미지를 설정하세요.</p>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>
              공방 이름 <span className={styles.required}>*</span>
            </label>
            <input 
              type="text" 
              name="name" 
              value={storeInfo.name} 
              onChange={handleChange}
              placeholder="예) FAVORY Studio"
              maxLength={20}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>공방 소개</label>
            <textarea 
              name="description" 
              value={storeInfo.description} 
              onChange={handleChange}
              placeholder="브랜드 스토리나 공방의 특징을 적어주세요."
              rows={4}
              maxLength={500}
            />
            <span className={styles.charLimit}>{storeInfo.description.length}/500</span>
          </div>
        </Card>

        {/* 소셜 및 연락처 섹션 */}
        <Card variant="soft" padding={isMobile ? 'md' : 'lg'}>
          <h3 className={styles.sectionTitle}>채널 및 연락처</h3>
          
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label>
                <Phone size={14} className={styles.labelIcon} /> 고객 센터 번호
              </label>
              <input 
                type="tel" 
                name="phone" 
                value={storeInfo.phone} 
                onChange={handleChange}
                placeholder="010-0000-0000"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>
                <Globe size={14} className={styles.labelIcon} /> 인스타그램 아이디
              </label>
              <input 
                type="text" 
                name="instagram" 
                value={storeInfo.instagram} 
                onChange={handleChange}
                placeholder="@username"
              />
            </div>
          </div>
          
          <div className={styles.infoAlert}>
            <Info size={16} />
            <p>입력하신 정보는 상점 메인 페이지와 상품 상세 페이지에 노출됩니다.</p>
          </div>
        </Card>

        {/* 하단 액션 버튼 */}
        <div className={styles.actionArea}>
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            icon={<Save size={18} />}
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '변경사항 저장'}
          </Button>
        </div>
      </form>
    </div>
  );
}