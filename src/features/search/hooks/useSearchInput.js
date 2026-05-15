// src/features/search/hooks/useSearchInput.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEARCH_LIMITS, SEARCH_MESSAGES } from '../constants/searchConstants';

/**
 * 검색 입력 처리 훅.
 * SiteNav, SearchPage 양쪽에서 재사용.
 *
 * 제출 시:
 *   - 빈 문자열  → 조용히 무시 (사용자가 의도하지 않은 제출일 수 있음)
 *   - 2자 미만   → tooShort 알림 표시
 *   - 그 외      → /search?q=... 로 이동
 *
 * 반환값:
 *   inputValue, setInputValue   - 입력 상태/세터
 *   handleSubmit                - <form onSubmit>에 연결
 *   error                       - 검증 실패 메시지 (string | null) — 컴포넌트가 인라인 표시 가능
 *   clearError                  - 외부에서 에러 닫기
 */
export const useSearchInput = ({ initialValue = '' } = {}) => {
  const [inputValue, setInputValueState] = useState(initialValue);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 값 변경 시 이전 에러 자동 무효화
  const setInputValue = useCallback((next) => {
    setInputValueState(next);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      const trimmed = inputValue.trim();

      // 완전히 비어있으면 조용히 무시 — 우발적 Enter 입력 대응
      if (trimmed.length === 0) {
        setError(null);
        return;
      }

      // 한 글자만 입력 → 사용자에게 안내
      if (trimmed.length < SEARCH_LIMITS.minQueryLength) {
        setError(SEARCH_MESSAGES.tooShort);
        // 인라인 에러 노출이 안 된 컨텍스트(SiteNav 등)를 위해 즉시 알림도 제공
        if (typeof window !== 'undefined') {
          window.alert(SEARCH_MESSAGES.tooShort);
        }
        return;
      }

      setError(null);
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [inputValue, navigate]
  );

  return {
    inputValue,
    setInputValue,
    handleSubmit,
    error,
    clearError,
  };
};