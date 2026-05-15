// src/features/profile/constants/socialPlatforms.js
import { Globe, Mail, BookOpen, Edit3 } from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';

/**
 * 지원하는 소셜 플랫폼.
 *
 * 키는 안정적이어야 함 (DB에 저장됨).
 * label, icon, color 등은 UI 표시용이라 자유롭게 변경 가능.
 *
 * urlPrefix: 사용자가 username만 입력하면 자동으로 풀 URL 만들 수 있음
 *            null이면 사용자가 직접 풀 URL 입력해야 함.
 */
export const SOCIAL_PLATFORMS = Object.freeze({
  instagram: {
    key: 'instagram',
    label: 'Instagram',
    icon: FaInstagram,
    color: '#E1306C',
    urlPrefix: 'https://instagram.com/',
    placeholder: '아이디 또는 https://instagram.com/...',
  },
  youtube: {
    key: 'youtube',
    label: 'YouTube',
    icon: FaYoutube,
    color: '#FF0000',
    urlPrefix: null,                              // 채널 URL 형태가 다양해서 직접 입력
    placeholder: 'https://youtube.com/@...',
  },
  naverBlog: {
    key: 'naverBlog',
    label: 'Naver Blog',
    icon: BookOpen,
    color: '#03C75A',
    urlPrefix: 'https://blog.naver.com/',
    placeholder: '아이디 또는 https://blog.naver.com/...',
  },
  tistory: {
    key: 'tistory',
    label: 'Tistory',
    icon: Edit3,
    color: '#E25929',
    urlPrefix: null,                              // {subdomain}.tistory.com 형태 다양
    placeholder: 'https://...tistory.com',
  },
  twitter: {
    key: 'twitter',
    label: 'X (Twitter)',
    icon: FaXTwitter,
    color: '#000000',
    urlPrefix: 'https://x.com/',
    placeholder: '아이디 또는 https://x.com/...',
  },
  website: {
    key: 'website',
    label: 'Website',
    icon: Globe,
    color: '#666666',
    urlPrefix: null,
    placeholder: 'https://...',
  },
  email: {
    key: 'email',
    label: 'Email',
    icon: Mail,
    color: '#444444',
    urlPrefix: 'mailto:',
    placeholder: 'name@example.com',
  },
});

export const SOCIAL_PLATFORM_KEYS = Object.keys(SOCIAL_PLATFORMS);

/**
 * username만 입력된 경우 풀 URL로 변환.
 * 이미 URL이면 그대로 반환.
 * email 플랫폼은 'mailto:' 자동 추가.
 */
export const normalizeSocialUrl = (platformKey, value) => {
  if (!value) return '';
  const platform = SOCIAL_PLATFORMS[platformKey];
  if (!platform) return value;

  // 이미 URL 또는 mailto이면 그대로
  if (/^https?:\/\//i.test(value) || /^mailto:/i.test(value)) return value;

  // urlPrefix가 있으면 prefix + value
  if (platform.urlPrefix) {
    // @, / 같은 군더더기 제거
    const cleaned = value.replace(/^[@/]+/, '');
    return platform.urlPrefix + cleaned;
  }

  // urlPrefix 없으면 https:// 자동 추가 (이미 도메인 입력했다고 가정)
  return `https://${value}`;
};

/**
 * URL에서 사용자 친화적 표시 문자열 추출.
 * 인스타: @아이디 / 이메일: 이메일주소 / 그 외: 호스트명
 */
export const formatSocialDisplay = (platformKey, url) => {
  if (!url) return '';
  const platform = SOCIAL_PLATFORMS[platformKey];
  if (!platform) return url;

  if (platformKey === 'email') {
    return url.replace(/^mailto:/i, '');
  }

  if (platform.urlPrefix && url.startsWith(platform.urlPrefix)) {
    const username = url.slice(platform.urlPrefix.length).replace(/\/$/, '');
    return username ? `@${username}` : url;
  }

  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};