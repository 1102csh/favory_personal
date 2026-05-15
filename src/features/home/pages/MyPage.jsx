import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, ChevronRight, Heart, User, Bell, HelpCircle, LogOut, Sparkles, Loader2, AlertCircle, Camera 
} from 'lucide-react';
import LegacyScope from '@/shared/ui/LegacyScope/LegacyScope';
import { useResponsive } from '@/shared/hooks/useResponsive';
import SiteNav from '../components/SiteNav/SiteNav'; 
import { myPageRepository } from '../api/myPageRepository';
import { supabase } from '@/shared/api/supabaseClient';
import styles from './MyPage.module.scss';

const MY_PAGE_THEME = `
  :root {
    --brand-gold: #D4A373;
    --brand-dark: #2C2018;
    --bg-sand: #FDFAF6;
    --line-soft: #E8DCCF;
    --bg-gray: #F8F9FA;
  }
`;

export default function MyPage() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✨ 이미지 업로드 상태 및 input 참조
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchMyPageData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await myPageRepository.getMyPageData();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPageData();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      await supabase.auth.signOut();
      navigate('/login');
    }
  };

  // ✨ 프로필 클릭 핸들러 (숨겨진 file input 대신 클릭)
  const handleImageClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  // ✨ 이미지 파일 선택 시 자동 업로드 핸들러
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const newImageUrl = await myPageRepository.uploadProfileImage(userData.id, file);
      
      setUserData(prev => ({
        ...prev,
        profileImage: newImageUrl
      }));

      // 상단 네비게이션바 동기화를 위해 페이지 새로고침
      window.location.reload(); 
    } catch (err) {
      alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <LegacyScope style={{ minHeight: '100vh', background: 'var(--bg-gray)' }}>
        <SiteNav isMobile={isMobile} />
        <div className={styles.centerWrapper}>
          <Loader2 className={styles.spinner} size={40} color="var(--brand-gold)" style={{ animation: 'spin 1s linear infinite' }} />
          <p>내 정보를 불러오는 중입니다...</p>
        </div>
      </LegacyScope>
    );
  }

  if (error || !userData) {
    return (
      <LegacyScope style={{ minHeight: '100vh', background: 'var(--bg-gray)' }}>
        <SiteNav isMobile={isMobile} />
        <div className={styles.centerWrapper}>
          <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#333', fontWeight: 'bold' }}>정보를 불러오지 못했습니다.</p>
          <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>{error}</p>
          <button onClick={() => navigate('/login')} className={styles.retryBtn}>다시 로그인하기</button>
        </div>
      </LegacyScope>
    );
  }

  return (
    <LegacyScope style={{ minHeight: '100vh', background: 'var(--bg-gray)' }}>
      <style>{MY_PAGE_THEME}</style>
      <SiteNav isMobile={isMobile} />
      
      <div className={styles.container} style={{ paddingTop: isMobile ? '20px' : '40px', paddingBottom: '100px' }}>
        
        <section className={styles.profileSection}>
          <div className={styles.profileHeader}>
            <div className={styles.userInfo}>
              
              {/* ✨ 클릭 가능한 프로필 이미지 영역 */}
              <div className={styles.avatarContainer} onClick={handleImageClick}>
                <div className={styles.avatar}>
                  <img 
                    src={userData.profileImage || 'https://via.placeholder.com/150'} 
                    alt="프로필" 
                    loading="lazy" 
                    style={{ opacity: isUploading ? 0.5 : 1 }} 
                  />
                </div>
                
                <div className={styles.avatarOverlay}>
                  {isUploading ? (
                    <Loader2 size={20} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Camera size={20} color="#fff" />
                  )}
                </div>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  hidden 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                />
              </div>

              <div className={styles.textGroup}>
                <h2 className={styles.userName}>
                  <strong>{userData.nickname}</strong> 님
                  {userData.isSeller && <span className={styles.sellerBadge}>입점 작가</span>}
                </h2>
                <p className={styles.userEmail}>{userData.email}</p>
              </div>
            </div>
            <button className={styles.iconBtn} onClick={() => navigate('/settings')} aria-label="설정">
              <Settings size={24} color="var(--brand-dark)" />
            </button>
          </div>

          <div className={styles.benefitBox}>
            <div className={styles.benefitItem}>
              <span>적립금</span>
              <strong>{userData.points?.toLocaleString() || 0} <small>P</small></strong>
            </div>
            <div className={styles.divider} />
            <div className={styles.benefitItem}>
              <span>쿠폰</span>
              <strong>{userData.coupons?.toLocaleString() || 0} <small>장</small></strong>
            </div>
          </div>
        </section>

        {/* ✨ 수정된 부분: 내 공방 관리하기 -> 내 프로필 */}
        {userData.isSeller ? (
          <section className={styles.sellerBanner} onClick={() => navigate('/profile')}>
            <div className={styles.sellerBannerContent}>
              <User size={22} className={styles.bannerIcon} />
              <div className={styles.bannerText}>
                <h4>내 프로필</h4>
                <p><strong>{userData.nickname}</strong>님의 프로필을 확인하고 관리해보세요.</p>
              </div>
            </div>
            <ChevronRight size={20} className={styles.arrowIcon} />
          </section>
        ) : (
          <section className={styles.applyBanner} onClick={() => navigate('/upgrade')}>
            <div className={styles.sellerBannerContent}>
              <Sparkles size={22} className={styles.applyIcon} />
              <div className={styles.bannerText}>
                <h4 className={styles.applyTitle}>나만의 공방을 열어보세요!</h4>
                <p>FAVORY 작가 입점하고 수수료 혜택 받기</p>
              </div>
            </div>
            <ChevronRight size={20} className={styles.arrowIcon} />
          </section>
        )}

        <section className={styles.menuListSection}>
          <div className={styles.menuGroup}>
            <h4 className={styles.menuTitle}>나의 활동</h4>

            <button className={styles.menuItem} onClick={() => navigate('/mypage/likes')}>
              <Heart size={20} className={styles.menuIcon} /> 찜한 작품 <ChevronRight size={20} className={styles.arrowIcon} />
            </button>

            <button className={styles.menuItem} onClick={() => navigate('/mypage/following')}>
              <User size={20} className={styles.menuIcon} /> 관심 작가 <ChevronRight size={20} className={styles.arrowIcon} />
            </button>
          </div>

          <div className={styles.menuGroup}>
            <h4 className={styles.menuTitle}>고객센터</h4>
            {/* ✨ onClick 추가 */}
            <button className={styles.menuItem} onClick={() => navigate('/mypage/notices')}>
              <Bell size={20} className={styles.menuIcon} /> 공지사항 <ChevronRight size={20} className={styles.arrowIcon} />
            </button>
            {/* ✨ onClick 추가 */}
            <button className={styles.menuItem} onClick={() => navigate('/mypage/inquiries')}>
              <HelpCircle size={20} className={styles.menuIcon} /> 1:1 문의 내역 <ChevronRight size={20} className={styles.arrowIcon} />
            </button>
          </div>
        </section>

        <div className={styles.bottomActions}>
          <button className={styles.logoutBtn} onClick={handleLogout}><LogOut size={16} /> 로그아웃</button>
        </div>

      </div>
    </LegacyScope>
  );
}