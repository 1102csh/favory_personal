// src/features/profile/pages/ProfilePage.jsx
import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import LegacyScope from '@/shared/ui/LegacyScope';
import { hasArtisanAccess } from '@/shared/lib/auth/roleUtils';
import SiteNav from '@/features/home/components/SiteNav';

import useProfileLayout from '../hooks/useProfileLayout';
import { useUserProfile } from '../hooks/useUserProfile';
import {
  products,
  reviews,
  notices,
  tabs,
  classes,
} from '../data/profileData';

import ProfileHeader from '../components/ProfileHeader';
import ProfileSidebar from '../components/ProfileSidebar';
import NoticeBox from '../components/NoticeBox';
import TabBar from '../components/TabBar';
import SecHead from '../components/SecHead';

import AllTabSection from '../sections/AllTabSection';
import NewsTabSection from '../sections/NewsTabSection';
import ProductGridSection from '../sections/ProductGridSection';
import ClassCalendar from '../sections/ClassCalendar';
import BookmarksTabSection from '../sections/BookmarksTabSection/BookmarksTabSection';

import defaultBg from '@/assets/background.jpg';

/**
 * 통합 프로필 페이지 (실데이터 버전).
 *
 * 라우트:
 *   /users/:id  - 임의 사용자 프로필 (본인/타인 자동 분기)
 *   /mypage     - 본인 프로필 리다이렉트
 *
 * 데이터:
 *   ✅ 헤더 정보 (name/handle/intro/avatar/cover/role/tags/social_links): 실데이터
 *   ✅ 작가 소식 (소식/후기 탭, AllTabSection 최근 소식): 실데이터 (posts 테이블)
 *   ⚠️  통계 (팔로워/판매작품/후기): 0으로 표시
 *   ⚠️  badges (작가 카테고리): 작가는 고정 3개, 일반은 빈 배열
 *   ⚠️  products: mock 유지 (products 도메인 정식화 후 교체)
 *   ⚠️  reviews: mock 유지 (reviews 도메인 정식화 후 교체)
 *   ⚠️  notices: mock 유지
 *   ⚠️  classes: mock 유지
 *   ⚠️  collections: mock 유지
 *   ⚠️  policies: mock 유지 (사이드바)
 */
export default function ProfilePage() {
  const { id: routeUserId } = useParams();
  const navigate = useNavigate();

  const { profile, isLoading, error, isOwnProfile } = useUserProfile(routeUserId);

  const [tab, setTab] = useState('홈');
  const [followed, setFollowed] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  const { isMobile, isTablet, isPC, gridCols } = useProfileLayout();

  // ====== 작가 여부 ======
  const isArtisan = useMemo(
    () => hasArtisanAccess(profile),
    [profile]
  );

  // ====== 헤더 표시용 데이터 ======
  // useUserProfile이 이미 normalize했으므로 그대로 사용 가능.
  // 다만 ProfileHeader가 기대하는 형식(badges, stats)을 추가로 만들어줘야 함.
  const headerProfile = useMemo(() => {
    if (!profile) return null;

    return {
      name: profile.nickname,
      handle: profile.handle ?? null,
      intro: profile.bio || (isOwnProfile ? '아직 자기소개가 없어요.' : ''),
      avatarUrl: profile.avatarUrl,
      tags: profile.tags,
      socialLinks: profile.socialLinks,

      // 작가 뱃지 — 추후 작가의 활동 카테고리 컬럼이 추가되면 동적으로 변경
      badges: isArtisan
        ? [
          { label: '상품', bg: 'var(--brand)' },
          { label: '도안', bg: '#2a2017' },
          { label: '클래스', bg: '#7f6245' },
        ]
        : [],

      // 통계 — 추후 follows / products / reviews 도메인 정식화 시 실데이터로
      stats: isArtisan
        ? [
          { v: '0', l: '팔로워' },
          { v: '0', l: '판매작품' },
          { v: '0', l: '후기' },
        ]
        : [],
    };
  }, [profile, isArtisan, isOwnProfile]);

  // ====== 보여줄 탭 ======
  // 본인 프로필일 때만 '저장' 탭 노출
  // 추후에 소식/후기 변경 혹은 소식, 후기 별도로 분리
  const visibleTabs = isOwnProfile
    ? isArtisan
      ? [...tabs, '저장']
      : ['홈', '소식', '저장']
    : isArtisan
      ? tabs
      : ['홈', '소식'];

  // ====== 상품 필터 (mock 유지) ======
  const filteredProducts =
    ['홈', '소식'].includes(tab)
      ? products
      : products.filter((p) => p.type === tab);

  // ====== 커버 이미지 ======
  const coverUrl = profile?.coverImageUrl || defaultBg;

  // ====== 로딩/에러 처리 ======
  if (isLoading) {
    return (
      <LegacyScope>
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
          <SiteNav isMobile={isMobile} />
          <div
            style={{
              padding: '120px 24px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 14,
            }}
          >
            프로필 정보를 불러오는 중...
          </div>
        </div>
      </LegacyScope>
    );
  }

  if (error || !profile) {
    return (
      <LegacyScope>
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
          <SiteNav isMobile={isMobile} />
          <div
            style={{
              padding: '120px 24px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 14,
            }}
          >
            <p style={{ marginBottom: 16 }}>
              {error?.message ?? '프로필을 찾을 수 없습니다.'}
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="press"
              style={{
                background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))',
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                padding: '10px 22px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              홈으로
            </button>
          </div>
        </div>
      </LegacyScope>
    );
  }

  return (
    <LegacyScope>
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-main)',
          fontFamily: 'Pretendard, sans-serif',
        }}
      >
        <SiteNav isMobile={isMobile} />

        {/* 커버 이미지 */}
        <div
          className="zoom"
          style={{
            position: 'relative',
            height: isMobile ? 260 : 440,
            overflow: 'hidden',
            marginTop: isMobile ? -54 : 0,
          }}
        >
          <img
            src={coverUrl}
            alt="cover"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                linear-gradient(
                  to bottom,
                  rgba(253,250,246,0) 0%,
                  rgba(253,250,246,0.05) 30%,
                  rgba(253,250,246,0.12) 50%,
                  rgba(253,250,246,0.25) 65%,
                  rgba(253,250,246,0.5) 78%,
                  rgba(253,250,246,0.75) 88%,
                  rgba(253,250,246,0.92) 95%,
                  rgba(253,250,246,1) 100%
                )
              `,
            }}
          />
        </div>

        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: isMobile ? '0 0 120px' : '0 52px 88px',
          }}
        >
          {/* 헤더 */}
          <ProfileHeader
            isMobile={isMobile}
            profile={headerProfile}
            isOwnProfile={isOwnProfile}
            isArtisan={isArtisan}
            followed={followed}
            setFollowed={setFollowed}
            onContact={() => {
              // 추후 문의하기 기능
            }}
            onEdit={() => navigate('/settings/profile')}
          />

          {/* 본문 */}
          <div
            style={{
              display: 'flex',
              gap: 38,
              marginTop: isMobile ? 0 : 32,
              alignItems: 'flex-start',
            }}
          >
            {/* 사이드바 — 작가 + PC에서만 (정책/Next Class는 mock) */}
            {isPC && isArtisan && <ProfileSidebar />}

            <main style={{ flex: 1, minWidth: 0 }}>
              {/* 공지 — 작가만 (mock) */}
              {isArtisan && (
                <div style={{ padding: isMobile ? '20px 18px 0' : '0' }}>
                  <NoticeBox
                    notices={notices}
                    noticeOpen={noticeOpen}
                    setNotice={setNoticeOpen}
                  />
                </div>
              )}

              {/* 탭 바 */}
              <div style={{ padding: isMobile ? '0 18px' : '0' }}>
                <TabBar
                  tabs={visibleTabs}
                  tab={tab}
                  setTab={setTab}
                  isMobile={isMobile}
                />
              </div>

              {/* 탭별 컨텐츠 */}
              {tab === '저장' && isOwnProfile ? (
                <BookmarksTabSection isMobile={isMobile} />
              ) : tab === '소식' ? ( // 추후에 소식/후기 변경 혹은 소식, 후기 별도로 분리
                <NewsTabSection
                  profileUserId={routeUserId}
                  mockReviews={isArtisan ? reviews : []}
                  isMobile={isMobile}
                />
              ) : tab === '홈' ? (
                <AllTabSection
                  profileUserId={routeUserId}
                  products={isArtisan ? products : []}
                  reviews={isArtisan ? reviews : []}
                  isMobile={isMobile}
                  isTablet={isTablet}
                  setTab={setTab}
                />
              ) : tab === '클래스' ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: isMobile ? 36 : 44,
                  }}
                >
                  <div style={{ padding: isMobile ? '8px 18px 0' : '8px 0 0' }}>
                    <SecHead ko="클래스 일정" />
                    <ClassCalendar classes={classes} isMobile={isMobile} />
                  </div>
                  <div>
                    <div style={{ padding: isMobile ? '0 18px 12px' : '0 0 12px' }}>
                      <SecHead ko="클래스 상품" />
                    </div>
                    <ProductGridSection
                      products={filteredProducts}
                      gridCols={gridCols}
                      isMobile={isMobile}
                    />
                  </div>
                </div>
              ) : (
                // 상품/도안 탭
                <>
                  <div style={{ padding: isMobile ? '8px 18px 12px' : '8px 0 12px' }}>
                    <p className="tab-count-label">
                      {tab} {filteredProducts.length}개
                    </p>
                  </div>
                  <ProductGridSection
                    products={filteredProducts}
                    gridCols={gridCols}
                    isMobile={isMobile}
                  />
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </LegacyScope>
  );
}