import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// ✨ Menu, X 아이콘 추가
import { User, LogOut, Settings, UserCircle, Search, Menu, X } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useSearchInput } from '@/features/search/hooks/useSearchInput';

import logoImg from '@/assets/LOGO.png';

export default function SiteNav({ isMobile }) {
  const navigate = useNavigate();
  const { profile, signOut, isArtisan, isAdmin } = useAuth();
  const { inputValue, setInputValue, handleSubmit } = useSearchInput();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // ✨ 모바일 햄버거 메뉴 상태 추가
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // ✨ 공통으로 사용할 네비게이션 링크 배열
  // 추후 활성화 예정 — 작가탐색/카테고리는 현재 비노출 처리
  const NAV_LINKS = [
    { label: '홈', path: '/' },
    { label: '작가탐색', path: '/artists', disabled: true },
    { label: '카테고리', path: '/categories', disabled: true },
    { label: '소식', path: '/community' },
  ].filter((menu) => !menu.disabled);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleArtistCenterClick = () => {
    if (isArtisan) {
      navigate('/dashboard');
    } else {
      navigate('/upgrade');
    }
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const profileImg = profile?.avatar_url ?? null;

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 300,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(18px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
        borderBottom: '1px solid var(--line)',
        height: isMobile ? 54 : 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          padding: isMobile ? '0 18px' : '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* ── 왼쪽: 햄버거 메뉴(모바일) 및 로고 ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 16 : 44 }}>
          
          {/* ✨ 모바일에서만 보이는 햄버거 메뉴 버튼 */}
          {isMobile && (
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              {isMobileMenuOpen ? <X size={24} color="var(--text-main)" /> : <Menu size={24} color="var(--text-main)" />}
            </button>
          )}

          <div
            onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <img
              src={logoImg}
              alt="FAVORY"
              style={{ height: isMobile ? 16 : 20, width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </div>

          {/* PC 버전 메인 메뉴 */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: 28 }}>
              {NAV_LINKS.map((menu) => (
                <span
                  key={menu.label}
                  className="nav-link"
                  onClick={() => navigate(menu.path)}
                  style={{ fontSize: '14px', fontWeight: 500, cursor: 'pointer', color: 'var(--text-main)' }}
                >
                  {menu.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── 오른쪽: 검색 및 프로필 ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 16, position: 'relative' }}>
          {!isMobile && (
            <form onSubmit={handleSubmit} role="search" style={{ position: 'relative', width: 280, marginLeft: 'auto', marginRight: 16 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="작가, 작품, 키워드 검색"
                autoComplete="off"
                style={{
                  width: '100%', height: 38, padding: '0 14px 0 38px', borderRadius: 999,
                  border: '1px solid var(--line)', background: 'var(--bg-soft)',
                  fontSize: 13.5, fontFamily: 'inherit', color: 'var(--text-main)', outline: 'none'
                }}
              />
            </form>
          )}

          {isMobile && (
            <button
              type="button" onClick={() => { navigate('/search'); setIsMobileMenuOpen(false); }}
              style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'transparent', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Search size={20} />
            </button>
          )}

          {/* PC 버전 권한별 버튼 */}
          {!isMobile && (
            <>
              {isAdmin ? (
                <button
                  onClick={() => navigate('/admin')}
                  style={{ background: 'var(--management-bg)', color: 'var(--management-text)', border: 'none', padding: '9px 18px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  MANAGEMENT
                </button>
              ) : (
                <button
                  onClick={handleArtistCenterClick}
                  style={{ background: 'var(--primary-cta-bg)', color: 'var(--primary-cta-text)', border: 'none', padding: '9px 18px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {isArtisan ? 'ARTIST CENTER' : 'BECOME AN ARTIST'}
                </button>
              )}
            </>
          )}

          {/* 프로필 영역 */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <div
              onClick={() => { setIsMenuOpen(!isMenuOpen); setIsMobileMenuOpen(false); }}
              style={{
                width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius: '50%',
                border: isMenuOpen ? '2px solid var(--brand)' : '1px solid var(--line)',
                cursor: 'pointer', background: 'var(--avatar-ring-bg)', display: 'flex', justifyContent: 'center',
                alignItems: 'center', overflow: 'hidden',
              }}
            >
              {profileImg ? (
                <img src={profileImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="profile" />
              ) : (
                <User size={isMobile ? 18 : 22} color="var(--text-main)" />
              )}
            </div>

            {/* 프로필 드롭다운 */}
            {isMenuOpen && (
              <div
                style={{
                  position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '180px',
                  background: 'var(--white)', border: '1px solid var(--line)', borderRadius: '16px',
                  boxShadow: 'var(--shadow-md)', padding: '8px', zIndex: 1000,
                }}
              >
                {profile?.nickname && (
                  <>
                    <div style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'block', color: 'var(--text-main)', fontWeight: 700 }}>
                        {profile.nickname} {isAdmin && <span style={{ color: 'var(--management-bg)', fontSize: '10px' }}>(관리자)</span>}
                      </span>
                      {profile.email}
                    </div>
                    <div style={{ height: '1px', background: 'var(--line)', margin: '6px 8px' }} />
                  </>
                )}
                <button style={dropdownItemStyle} onClick={() => { navigate('/mypage'); setIsMenuOpen(false); }}>
                  <UserCircle size={15} style={{ marginRight: 8 }} /> 마이페이지
                </button>
                <button style={dropdownItemStyle} onClick={() => { navigate('/settings'); setIsMenuOpen(false); }}>
                  <Settings size={15} style={{ marginRight: 8 }} /> 설정
                </button>
                <div style={{ height: '1px', background: 'var(--line)', margin: '6px 8px' }} />
                <button style={{ ...dropdownItemStyle, color: 'var(--management-bg)' }} onClick={handleLogout}>
                  <LogOut size={15} style={{ marginRight: 8 }} /> 로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✨ 모바일 전용 햄버거 메뉴 (아래로 펼쳐짐) */}
      {isMobile && isMobileMenuOpen && (
        <div style={{
          position: 'absolute', top: '54px', left: 0, width: '100%', background: 'var(--bg-main)',
          borderBottom: '1px solid var(--line)', padding: '24px', display: 'flex', flexDirection: 'column',
          gap: '24px', boxShadow: 'var(--shadow-sm)', zIndex: 299
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {NAV_LINKS.map((menu) => (
              <span
                key={menu.label}
                onClick={() => { navigate(menu.path); setIsMobileMenuOpen(false); }}
                style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}
              >
                {menu.label}
              </span>
            ))}
          </div>

          <div style={{ height: '1px', background: 'var(--line)' }} />

          {/* 모바일 화면에서 숨겨져 있던 관리자/작가 버튼 */}
          {isAdmin ? (
            <button
              onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }}
              style={{ width: '100%', background: 'var(--management-bg)', color: 'var(--management-text)', border: 'none', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold' }}
            >
              MANAGEMENT
            </button>
          ) : (
            <button
              onClick={() => { handleArtistCenterClick(); setIsMobileMenuOpen(false); }}
              style={{ width: '100%', background: 'var(--primary-cta-bg)', color: 'var(--primary-cta-text)', border: 'none', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold' }}
            >
              {isArtisan ? 'ARTIST CENTER' : 'BECOME AN ARTIST'}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

const dropdownItemStyle = {
  width: '100%', padding: '10px 12px', fontSize: '13px', color: 'var(--text-main)', background: 'none',
  border: 'none', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', display: 'flex',
  alignItems: 'center', transition: 'all 0.2s', fontFamily: 'inherit',
};