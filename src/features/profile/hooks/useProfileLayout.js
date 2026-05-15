// src/features/profile/hooks/useProfileLayout.js
import { useResponsive } from '@/shared/hooks/useResponsive';

/**
 * ProfilePage 전용 레이아웃 정보.
 * 내부적으로 useResponsive를 사용. 원본 호출 코드 호환용 thin wrapper.
 *
 * 추후 ProfilePage가 안정화되면 모든 호출처를 useResponsive로 직접 변경하고
 * 이 파일을 제거할 수 있습니다.
 */
export default function useProfileLayout() {
  const { width, isMobile, isTablet, isPC, profileGridCols } = useResponsive();
  return {
    width,
    isMobile,
    isTablet,
    isPC,
    gridCols: profileGridCols,
  };
}