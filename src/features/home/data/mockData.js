// src/features/home/data/mockData.js

/**
 * 메인 서비스용 가상 데이터.
 *
 * ⚠️ 임시 데이터입니다. 추후 다음으로 교체됩니다:
 *   - api/artistRepository.js
 *   - api/feedRepository.js
 *   - hooks/useFeaturedArtists.js
 *   - hooks/useFollowFeeds.js
 *   - hooks/useTrendingArtists.js
 */

export const FEATURED_ARTISTS = [
  {
    id: 1,
    name: '뜨개공방 실과바늘',
    tag: '손뜨개 가방·소품',
    cover: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=1200',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300',
    badge: '공식작가',
    newProduct: '라피아 썸머백 신상 입고 🌿',
  },
  {
    id: 2,
    name: '도예공방 흙과손',
    tag: '핸드메이드 도자기',
    cover: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300',
    badge: '베스트작가',
    newProduct: '봄 에디션 머그컵 오픈 ☕',
  },
];

export const FOLLOW_FEEDS = [
  {
    id: 'feed-1',
    artist: '뜨개공방 실과바늘',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
    time: '2시간 전',
    text: '☀️ 라피아 썸머백 신상 입고됐어요! 한정 수량!',
    img: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600',
    category: '소품',
  },
  {
    id: 'feed-2',
    artist: '도예공방 흙과손',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100',
    time: '5시간 전',
    text: '🎓 4월 도자기 입문 클래스 마감 임박!',
    img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
    category: '공방',
  },
  {
    id: 'feed-3',
    artist: '자수스튜디오 수실',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    time: '1일 전',
    text: '🧵 봄꽃 자수 도안 주말 공개 예정 🌸',
    img: 'https://images.unsplash.com/photo-1612160352273-df818349b6d4?w=600',
    category: '도안',
  },
];

export const TRENDING_ARTISTS = [
  {
    name: '가죽공방 손길',
    tags: ['상품', '클래스'],
    followers: '3.1K',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    isFollowed: false,
  },
  {
    name: '캔들스튜디오 빛',
    tags: ['상품', '도면'],
    followers: '1.8K',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    isFollowed: true,
  },
  {
    name: '뜨개장인 한땀',
    tags: ['도면'],
    followers: '2.4K',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200',
    isFollowed: false,
  },
  {
    name: '목공방 결',
    tags: ['상품', '도면', '클래스'],
    followers: '1.5K',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200',
    isFollowed: false,
  },
  {
    name: '도자기 흙내음',
    tags: ['클래스'],
    followers: '4.2K',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    isFollowed: false,
  },
];

export const FEED_FILTERS = ['전체', '공방', '소품', '도안'];