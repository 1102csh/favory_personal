// src/features/profile/components/ProfileSocialLinks/ProfileSocialLinks.jsx
import {
  SOCIAL_PLATFORMS,
  SOCIAL_PLATFORM_KEYS,
  formatSocialDisplay,
} from '../../constants/socialPlatforms';

/**
 * 프로필 소셜 링크 아이콘 버튼 모음.
 *
 * social_links jsonb의 키를 SOCIAL_PLATFORM_KEYS 순서로 표시.
 * 등록되지 않은 키는 자동 숨김.
 *
 * @param {object} props
 * @param {Record<string, string>} props.links  - { instagram: 'url', ... }
 * @param {boolean} [props.isMobile]
 * @param {'compact'|'detailed'} [props.variant='compact']
 *   compact: 아이콘만 (이미지 2와 동일한 형태)
 *   detailed: 아이콘 + 라벨 + URL (프로필 편집용)
 */
export default function ProfileSocialLinks({
  links = {},
  isMobile,
  variant = 'compact',
}) {
  // 등록된 링크만 추출 (정의된 플랫폼 순서 유지)
  const entries = SOCIAL_PLATFORM_KEYS
    .map((key) => ({ key, url: links[key] }))
    .filter((e) => Boolean(e.url));

  if (entries.length === 0) return null;

  if (variant === 'detailed') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.map(({ key, url }) => {
          const platform = SOCIAL_PLATFORMS[key];
          const Icon = platform.icon;
          return (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="press"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                background: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                color: 'var(--text-main)',
                fontSize: 13.5,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              <Icon size={18} color={platform.color} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>
                  {platform.label}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11.5,
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatSocialDisplay(key, url)}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    );
  }

  // compact 변형 — 사용자가 보여준 두 번째 이미지 형태
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: isMobile ? 6 : 8,
      }}
    >
      {entries.map(({ key, url }) => {
        const platform = SOCIAL_PLATFORMS[key];
        const Icon = platform.icon;
        const size = isMobile ? 36 : 40;

        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="press"
            aria-label={`${platform.label} 링크 열기`}
            title={`${platform.label} · ${formatSocialDisplay(key, url)}`}
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              background: 'var(--white)',
              border: '1px solid var(--line)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
              transition: 'border-color 0.18s, background 0.18s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = platform.color;
              e.currentTarget.style.color = platform.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--line)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
          >
            <Icon size={isMobile ? 16 : 18} />
          </a>
        );
      })}
    </div>
  );
}