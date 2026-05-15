// src/shared/hooks/useUnsavedChangesGuard.js
import { useEffect, useCallback } from 'react';
import { useBlocker } from 'react-router-dom';

const DEFAULT_MESSAGE = '작성 중인 내용이 사라집니다. 그래도 나가시겠습니까?';

/**
 * 저장되지 않은 변경사항이 있을 때 페이지 이탈을 막는 훅.
 *
 * 두 가지 이탈 방식 모두 처리:
 *  1) 브라우저 차원 (새로고침, 탭 닫기) - beforeunload
 *  2) 앱 내 라우팅 (Link, navigate, 뒤로가기) - useBlocker (Data Router 전용)
 *
 * useBlocker는 createBrowserRouter 기반에서만 동작.
 * BrowserRouter 패턴이면 beforeunload만 작동하고 라우팅 가드는 무시됨.
 *
 * @param {boolean} when                    - true면 가드 활성화
 * @param {string} [message]                - 라우팅 가드 confirm에 표시할 메시지
 *
 * @example
 *   const { formState: { isDirty } } = useForm(...);
 *   useUnsavedChangesGuard(isDirty);
 */
export const useUnsavedChangesGuard = (when, message = DEFAULT_MESSAGE) => {
  // 1) 브라우저 이탈 가드 (새로고침, 탭 닫기)
  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (e) => {
      // 브라우저는 커스텀 메시지를 무시하고 표준 다이얼로그를 표시
      // (returnValue 설정 자체가 트리거)
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [when]);

  // 2) 앱 내 라우팅 가드 (Data Router 전용)
  // useBlocker는 boolean 또는 함수를 받음. 함수형이면 매 navigation마다 호출됨.
  let blocker;
  try {
    blocker = useBlocker(when);
  } catch (e) {
    // BrowserRouter 환경 등에서 useBlocker 미지원 시 silent fail
    blocker = null;
  }

  useEffect(() => {
    if (!blocker || blocker.state !== 'blocked') return;

    const ok = window.confirm(message);
    if (ok) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker, message]);

  // 3) 외부에서 강제 해제 (submit 직전 호출용)
  // — 라우팅 가드를 즉시 통과시킨다.
  const release = useCallback(() => {
    if (blocker?.state === 'blocked') {
      blocker.proceed();
    }
  }, [blocker]);

  return { release };
};