// src/features/dashboard/components/DashboardLayout/DashboardLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import DashboardSidebar from '../DashboardSidebar';

/**
 * 작가 대시보드 레이아웃.
 * react-router의 <Outlet />으로 자식 라우트를 렌더링.
 *
 * 활성 탭은 URL pathname에서 파생 (단일 진실 원천).
 */
export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // pathname → activeTab 매핑
  // /dashboard          → home
  // /dashboard/feed     → feed
  // /dashboard/orders   → orders 등
  const activeTab = (() => {
    const match = location.pathname.match(/^\/dashboard\/?([^/]*)/);
    const segment = match?.[1] ?? '';
    return segment === '' ? 'home' : segment;
  })();

  const handleTabSelect = (id) => {
    setMenuOpen(false);
    navigate(id === 'home' ? '/dashboard' : `/dashboard/${id}`);
  };

  const handleBackToHome = () => navigate('/');

  return (
    <div
      className="dashboard-shell"
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {!isMobile && (
        <aside
          className="sidebar-surface"
          style={{
            width: '252px',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
          }}
        >
          <DashboardSidebar
            activeTab={activeTab}
            onTabClick={handleTabSelect}
            onBackToHome={handleBackToHome}
          />
        </aside>
      )}

      {isMobile && (
        <header
          className="sidebar-surface"
          style={{
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            flexShrink: 0,
          }}
        >
          <span style={{ fontWeight: 800, color: '#f7efe7', fontSize: '22px' }}>
            FAVORY
          </span>
          <Menu
            onClick={() => setMenuOpen(true)}
            style={{ cursor: 'pointer', color: '#c28a61' }}
          />
        </header>
      )}

      {isMobile && menuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{ width: '100%', height: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <DashboardSidebar
              activeTab={activeTab}
              onTabClick={handleTabSelect}
              isMobile={true}
              onClose={() => setMenuOpen(false)}
              onBackToHome={handleBackToHome}
            />
          </div>
        </div>
      )}

      <main
        style={{
          flex: 1,
          padding: isMobile ? '20px' : '44px 52px',
          overflowY: 'auto',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}