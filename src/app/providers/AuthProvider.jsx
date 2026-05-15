// src/app/providers/AuthProvider.jsx
import { createContext, useContext, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authRepository } from '@/features/auth/api/authRepository';
import { profileRepository } from '@/features/auth/api/profileRepository';
import { hasArtisanAccess, isAdminRole } from '@/shared/lib/auth/roleUtils';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};

const PUBLIC_ONLY_PATHS = ['/login', '/signup'];

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('loading');

  // ✅ 현재 로드된 user의 id를 ref로도 보관 (이벤트 핸들러에서 즉시 비교 가능)
  const currentUserIdRef = useRef(null);

  const fetchProfile = async (userId) => {
    if (!userId) return null;
    try {
      const { data, error } = await profileRepository.getProfileById(userId);
      if (error) {
        console.error('[fetchProfile] error', error);
        return null;
      }
      return data;
    } catch (e) {
      console.error('[fetchProfile] threw', e);
      return null;
    }
  };

  /**
   * 사용자 변경(로그인/로그아웃/초기 로드)에 대응.
   * 같은 user의 단순 토큰 갱신에는 이 함수가 호출되지 않음.
   */
  const applyUserChange = async (nextUser) => {
    if (!nextUser) {
      currentUserIdRef.current = null;
      setUser(null);
      setProfile(null);
      setStatus('unauthenticated');
      return;
    }

    currentUserIdRef.current = nextUser.id;
    setUser(nextUser);
    setStatus('authenticating');

    const p = await fetchProfile(nextUser.id);

    // 응답 도착 시점에 다른 사용자로 바뀌었으면 무시 (race condition 방지)
    if (currentUserIdRef.current !== nextUser.id) return;

    setProfile(p);
    setStatus('authenticated');

    // 인증 페이지에 머물러 있으면 자동 리다이렉트
    if (PUBLIC_ONLY_PATHS.includes(location.pathname)) {
      const target = p && !p.profile_completed ? '/auth/complete-profile' : '/';
      navigate(target, { replace: true });
    }
  };

  /**
   * 같은 user의 정보만 조용히 갱신 (토큰 갱신 등).
   * status는 건드리지 않음 → 로딩 화면 깜빡임 없음.
   */
  const refreshUserSilently = (nextUser) => {
    if (!nextUser) return;
    setUser(nextUser);
    // profile은 안 건드림 (변경되지 않았다고 가정)
  };

  useEffect(() => {
    let unsub;
    let cancelled = false;

    const init = async () => {
      const { data } = await authRepository.getSession();
      if (cancelled) return;

      const initialUser = data?.session?.user ?? null;
      await applyUserChange(initialUser);
      if (cancelled) return;

      const { data: sub } = authRepository.onAuthStateChange((event, session) => {
        if (cancelled) return;

        const nextUser = session?.user ?? null;
        const prevUserId = currentUserIdRef.current;
        const nextUserId = nextUser?.id ?? null;

        // ✅ 이벤트 종류와 user_id 변경 여부에 따라 분기
        switch (event) {
          case 'SIGNED_IN':
            // user_id가 실제로 바뀐 경우에만 applyUserChange
            if (prevUserId !== nextUserId) {
              applyUserChange(nextUser);
            } else {
              // 같은 user의 SIGNED_IN은 토큰 갱신 직후 발화되는 케이스
              refreshUserSilently(nextUser);
            }
            break;

          case 'SIGNED_OUT':
            applyUserChange(null);
            break;

          case 'TOKEN_REFRESHED':
          case 'USER_UPDATED':
            // 같은 user의 정보 갱신만. 로딩 상태로 돌아가지 않음.
            refreshUserSilently(nextUser);
            break;

          case 'INITIAL_SESSION':
            // 보통 init()의 getSession에서 이미 처리됐으나, 만일을 대비
            if (prevUserId !== nextUserId) {
              applyUserChange(nextUser);
            }
            break;

          case 'PASSWORD_RECOVERY':
            // 비밀번호 재설정 페이지에서 처리 (status는 그대로)
            refreshUserSilently(nextUser);
            break;

          default:
            // 알 수 없는 이벤트는 안전하게 silent
            break;
        }
      });
      unsub = sub?.subscription?.unsubscribe;
    };

    init();
    return () => {
      cancelled = true;
      unsub?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshProfile = useCallback(async () => {
    const uid = currentUserIdRef.current;
    if (!uid) return;
    const p = await fetchProfile(uid);
    // 응답 도착 시점에 다른 사용자로 바뀌었으면 무시
    if (currentUserIdRef.current !== uid) return;
    setProfile(p);
  }, []);

  const signOut = useCallback(async () => {
    await authRepository.signOut();
  }, []);

  // ✅ derived state 계산
  const permissions = useMemo(
    () => ({
      isArtisan: hasArtisanAccess(profile),    // admin 포함
      isAdmin: isAdminRole(profile),
    }),
    [profile]
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      status,
      refreshProfile,
      signOut,

      // ✅ 권한 derived state
      isArtisan: permissions.isArtisan,
      isAdmin: permissions.isAdmin,
    }),
    [user, profile, status, permissions, refreshProfile, signOut]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};