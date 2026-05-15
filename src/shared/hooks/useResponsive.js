// src/shared/hooks/useResponsive.js
import { useEffect, useState } from 'react';

const TABLET_BREAKPOINT = 768;
const PROFILE_PC_BREAKPOINT = 1080;     // ProfilePage 전용 (사이드바 노출 기준)
const DESKTOP_BREAKPOINT = 1024;

const getViewportInfo = () => {
  if (typeof window === 'undefined') {
    return {
      width: 0,
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isPC: false,
      profileGridCols: 2,
    };
  }
  const width = window.innerWidth;
  const isPC = width >= PROFILE_PC_BREAKPOINT;
  return {
    width,
    isMobile: width < DESKTOP_BREAKPOINT,
    isTablet: width >= TABLET_BREAKPOINT && width < DESKTOP_BREAKPOINT,
    isDesktop: width >= DESKTOP_BREAKPOINT,
    isPC,                                                    // ProfilePage가 사이드바 노출용으로 사용 (1080+)
    profileGridCols: isPC ? 4 : width >= 640 ? 3 : 2,        // ProductGrid 컬럼 수
  };
};

/**
 * 화면 너비를 추적하는 훅.
 *
 * @returns {{
 *   width: number,
 *   isMobile: boolean,
 *   isTablet: boolean,
 *   isDesktop: boolean,
 *   isPC: boolean,                  // 1080+ (ProfilePage 사이드바)
 *   profileGridCols: number,        // ProfilePage 상품 그리드 컬럼 수
 * }}
 */
export const useResponsive = () => {
  const [info, setInfo] = useState(getViewportInfo);

  useEffect(() => {
    const handleResize = () => setInfo(getViewportInfo());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return info;
};