import React from 'react';
import { 
  Home, BarChart3, MessageSquare, Store, Package, 
  ClipboardList, CreditCard, Calendar, Users, Heart, LogOut, X 
} from 'lucide-react';
import styles from './DashboardSidebar.module.scss';

// 뱃지 기능이 제거된 깔끔한 NavItem
const NavItem = ({ icon, label, active, onClick }) => (
  <div 
    className={`${styles.navItem} ${active ? styles.active : ''}`} 
    onClick={onClick}
  >
    {icon} 
    <span>{label}</span>
  </div>
);

export default function DashboardSidebar({ activeTab, onTabClick, isMobile, onClose, onBackToHome }) {
  return (
    <aside className={styles.sidebarContainer}>
      {/* 로고 영역 */}
      <div className={styles.header}>
        <div>
          <div className={styles.logoText}>FAVORY</div>
          <div className={styles.subText}>ARTIST STUDIO</div>
        </div>
        {isMobile && <X size={20} className={styles.closeBtn} onClick={onClose} />}
      </div>
      
      {/* 네비게이션 메뉴들 */}
      <div className={styles.groupTitle}>OVERVIEW</div>
      <NavItem active={activeTab === 'home'} icon={<Home size={18}/>} label="홈 현황" onClick={() => onTabClick('home')} />
      <NavItem active={activeTab === 'analytics'} icon={<BarChart3 size={18}/>} label="분석 통계" onClick={() => onTabClick('countinue')} />
      
      <div className={styles.groupTitle}>CONTENT</div>
      <NavItem active={activeTab === 'feed'} icon={<MessageSquare size={18}/>} label="소식 관리" onClick={() => onTabClick('feed')} />
      <NavItem active={activeTab === 'store'} icon={<Store size={18}/>} label="스토어 설정" onClick={() => onTabClick('store')} />
      
      <div className={styles.groupTitle}>BUSINESS</div>
      <NavItem active={activeTab === 'inventory'} icon={<Package size={18}/>} label="상품 관리" onClick={() => onTabClick('inventory')} />
      <NavItem active={activeTab === 'orders'} icon={<ClipboardList size={18}/>} label="주문·제작" onClick={() => onTabClick('countinue')} />
      <NavItem active={activeTab === 'sales'} icon={<CreditCard size={18}/>} label="판매/정산" onClick={() => onTabClick('countinue')} />
      <NavItem active={activeTab === 'calendar'} icon={<Calendar size={18}/>} label="일정표" onClick={() => onTabClick('calendar')} />
      
      <div className={styles.groupTitle}>COMMUNITY</div>
      <NavItem active={activeTab === 'customers'} icon={<Users size={18}/>} label="고객 관리" onClick={() => onTabClick('customers')} />
      <NavItem active={activeTab === 'reviews'} icon={<Heart size={18}/>} label="리뷰 피드백" onClick={() => onTabClick('countinue')} />
      
      {/* 하단 로그아웃/홈 이동 버튼 */}
      <div className={styles.logoutBtn} onClick={onBackToHome}>
        <LogOut size={16} style={{ marginRight: '8px' }} /> 사용자 홈으로
      </div>
    </aside>
  );
}