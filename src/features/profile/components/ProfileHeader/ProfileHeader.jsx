// src/features/profile/components/ProfileHeader/ProfileHeader.jsx
import React from 'react';
import { Bell, BadgeCheck } from 'lucide-react';
import ProfileTags from '../ProfileTags';
import ProfileSocialLinks from '../ProfileSocialLinks';

/**
 * 프로필 헤더.
 *
 * @param {object} props
 * @param {boolean} props.isMobile
 * @param {object} props.profile
 *   - { name, handle, intro, avatarUrl, badges, stats, tags, socialLinks }
 * @param {boolean} props.isOwnProfile
 * @param {boolean} props.isArtisan       - 작가/관리자 여부 (인증 마크 표시용)
 * @param {boolean} props.followed
 * @param {(next: boolean) => void} props.setFollowed
 * @param {() => void} [props.onContact]
 * @param {() => void} [props.onEdit]
 */
export default function ProfileHeader({
  isMobile,
  profile,
  isOwnProfile = false,
  isArtisan = false,
  followed,
  setFollowed,
  onContact,
  onEdit,
}) {
  const badgeBase = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: isMobile ? 24 : 28,
    padding: isMobile ? '0 11px' : '0 12px',
    borderRadius: 999,
    color: '#fff',
    fontSize: isMobile ? 12 : 12.5,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    flexShrink: 0,
  };

  const stats = profile?.stats ?? [];
  const badges = profile?.badges ?? [];
  const tags = profile?.tags ?? [];
  const socialLinks = profile?.socialLinks ?? {};

  return (
    <div
      className="au"
      style={{
        padding: isMobile ? '0 18px 20px' : '0 0 32px',
        marginTop: isMobile ? -54 : -92,
        borderBottom: '1px solid var(--line)',
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : 760,
          marginLeft: isMobile ? 0 : 48,
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 12 : 14,
        }}
      >
        {/* 프로필 이미지 + 칩·이름·핸들 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: isMobile ? 12 : 16,
          }}
        >
          {/* 프로필 이미지 */}
          <div
            style={{
              width: isMobile ? 64 : 88,
              height: isMobile ? 64 : 88,
              borderRadius: '50%',
              padding: isMobile ? 2 : 3,
              background:
                'linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)',
              boxShadow: '0 8px 22px rgba(212,163,115,0.22)',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                border: isMobile
                  ? '2px solid var(--bg-main)'
                  : '3px solid var(--bg-main)',
                background: 'var(--white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name ?? 'profile'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span
                  style={{
                    fontSize: isMobile ? 24 : 32,
                    fontWeight: 700,
                    color: 'var(--brand-dark)',
                  }}
                >
                  {profile?.name?.charAt(0) ?? '?'}
                </span>
              )}
            </div>
          </div>

          {/* 이름 + 인증마크 → @핸들 → 뱃지 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? 6 : 8,
              paddingTop: isMobile ? 2 : 6,
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? 6 : 7,
                flexWrap: 'wrap',
              }}
            >
              <h1
                style={{
                  fontSize: isMobile ? 19 : 24,
                  fontWeight: 800,
                  color: '#2b2118',
                  letterSpacing: '-0.04em',
                  lineHeight: 1.12,
                  margin: 0,
                }}
              >
                {profile?.name ?? '알 수 없음'}
              </h1>

              {isArtisan && (
                <BadgeCheck
                  size={isMobile ? 18 : 22}
                  color="var(--brand)"
                  fill="var(--brand-soft, #f7ecd9)"
                  strokeWidth={2.25}
                  aria-label="공식 작가 인증"
                />
              )}
            </div>

            {profile?.handle && (
              <p
                style={{
                  fontSize: isMobile ? 12.5 : 13,
                  fontWeight: 500,
                  color: 'rgba(70,52,38,0.72)',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                @{profile.handle}
              </p>
            )}

            {badges.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: isMobile ? 5 : 6,
                  marginTop: isMobile ? 2 : 2,
                }}
              >
                {badges.map((b) => (
                  <span key={b.label} style={{ ...badgeBase, background: b.bg }}>
                    {b.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 한줄 소개 */}
        {profile?.intro && (
          <p
            style={{
              fontSize: isMobile ? 13 : 14,
              color: '#5f4a38',
              lineHeight: isMobile ? 1.65 : 1.72,
              margin: 0,
              fontWeight: 400,
              wordBreak: 'keep-all',
              whiteSpace: 'pre-line',
            }}
          >
            {profile.intro}
          </p>
        )}

        {/* ✅ 신규: 태그 */}
        {tags.length > 0 && (
          <ProfileTags tags={tags} isMobile={isMobile} />
        )}

        {/* ✅ 신규: 소셜 링크 */}
        {Object.keys(socialLinks).length > 0 && (
          <ProfileSocialLinks
            links={socialLinks}
            isMobile={isMobile}
            variant="compact"
          />
        )}

        {/* 통계 */}
        {stats.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: isMobile ? 16 : 22,
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            {stats.map((item, i) => (
              <React.Fragment key={item.l}>
                {i > 0 && (
                  <div
                    style={{
                      width: 1,
                      height: isMobile ? 28 : 34,
                      background: 'var(--line)',
                      alignSelf: 'center',
                    }}
                  />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span
                    style={{
                      fontSize: isMobile ? 18 : 22,
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      lineHeight: 1,
                      letterSpacing: '-0.05em',
                    }}
                  >
                    {item.v}
                  </span>
                  <span
                    style={{
                      fontSize: isMobile ? 12 : 12.5,
                      fontWeight: 500,
                      color: 'var(--text-light)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {item.l}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* 액션 버튼 */}
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          {isOwnProfile ? (
            <button
              onClick={onEdit}
              className="press"
              style={{
                flex: 1,
                height: 44,
                borderRadius: 999,
                border: '1px solid var(--line)',
                background: 'var(--white)',
                color: 'var(--text-main)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              프로필 편집
            </button>
          ) : (
            <>
              <button
                onClick={() => setFollowed?.(!followed)}
                className="press"
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 999,
                  border: followed ? '1px solid var(--line)' : 'none',
                  background: followed
                    ? 'var(--white)'
                    : 'linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)',
                  color: followed ? 'var(--text-main)' : 'var(--primary-cta-text)',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: followed ? 'none' : '0 6px 16px rgba(212,163,115,0.24)',
                }}
              >
                {followed ? '팔로잉' : '+ 팔로우'}
              </button>

              <button
                onClick={onContact}
                className="press"
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 999,
                  border: '1px solid var(--line)',
                  background: 'var(--white)',
                  color: 'var(--text-main)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                문의하기
              </button>

              <button
                className="press"
                aria-label="알림 설정"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1px solid var(--line)',
                  background: 'var(--white)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                }}
              >
                <Bell size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}