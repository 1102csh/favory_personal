// src/features/products/data/productDetailMock.js
//
// ⚠️ 임시 mock. productRepository.js 가 import 해서 사용.
//    Supabase products 테이블 정식화 시 repository 내부만 교체하면 됨.
//
// 한 상품 안에 여러 컬러/사이즈 변형(variant)이 있는 구조.

import lilac   from '@/assets/image7.jpg';
import pink    from '@/assets/image6.jpg';
import beige   from '@/assets/image3.jpg';
import gold    from '@/assets/image4.jpg';
import profile from '@/assets/profile.jpg';

export const PRODUCT_DETAIL_MOCK = Object.freeze({
  id: 'lilac-mug-may',
  category: '상품',
  name: '라일락 머그컵 — 5월 한정 라인',
  price: 38000,
  externalUrl: 'https://smartstore.naver.com/', // placeholder

  variants: [
    { id: 'lilac',  label: '라일락 (기본)', size: '8.5cm × 9cm', image: lilac },
    { id: 'pink',   label: '핑크',          size: '8.5cm × 9cm', image: pink },
    { id: 'beige',  label: '베이지',        size: '8.5cm × 9cm', image: beige },
    { id: 'gold',   label: '골드',          size: '8.5cm × 9cm', image: gold },
  ],

  description: {
    intro: '5월 한 달만 작업하는 라일락 컬렉션. 한 점씩 손으로 빚어 그린 라인이라 미세한 차이가 있습니다.',
    bullets: [
      '사이즈: 직경 8.5cm × 높이 9cm',
      '재질: 백자토 + 무광 유약',
      '전자렌지·식기세척기 사용 가능',
      '제작 기간: 주문 후 약 2주',
    ],
  },

  artist: {
    id: 'bomgyeol',
    name: '봄결 도예',
    handle: '@bomgyeol',
    avatar: profile,
    isArtisan: true,
    followers: 238,
    intro: '서울 성수동 작업실에서 한 점씩 빚어 만듭니다. 도예 8년차. 일상에 자연스럽게 녹아드는 그릇을 추구합니다.',
  },
});

