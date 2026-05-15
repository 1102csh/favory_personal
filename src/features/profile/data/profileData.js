// src/features/profile/data/profileData.js
import profileImg  from '@/assets/profile.jpg';
import cupImage1   from '@/assets/image3.jpg';
import cupImage2   from '@/assets/image7.jpg';
import product1    from '@/assets/image4.jpg';
import product2    from '@/assets/image5.jpg';
import recipe      from '@/assets/result.jpg';
import recipe2     from '@/assets/result2.jpg';
import classImg    from '@/assets/class.jpg';
import classImg2   from '@/assets/class2.jpg';
import flowerPot   from '@/assets/flowerpot.jpg';
import makingImg   from '@/assets/making.jpg';
import workspace   from '@/assets/workspace.jpg';
import review      from '@/assets/review.jpg';
import review2     from '@/assets/review2.jpg';
import profile2    from '@/assets/profile2.jpg';
import profile3    from '@/assets/profile3.jpg';
import profile4    from '@/assets/profile4.jpg';
import profile5    from '@/assets/profile5.jpg';

/**
 * 작가 프로필 페이지용 mock 데이터.
 *
 * ⚠️ 임시 데이터입니다. 추후 다음으로 교체 예정:
 *   - features/profile/api/artistProfileRepository.js
 *   - features/products/api/productRepository.js
 *   - features/community/api/postRepository.js (이미 존재)
 *   - features/profile/hooks/useArtistProfile.js 등
 */

export const products = [
  { id: 1, type: '상품',   name: '따뜻한 도자기 머그컵',          price: 68000, status: '판매중',   delivery: '3일 내 발송',  img: cupImage1 },
  { id: 2, type: '도안',   name: '식기 도안 PDF',                price: 4500,  status: '판매중',   pages: 8,                img: recipe2 },
  { id: 3, type: '클래스', name: '입문 도자기 클래스 4월',        price: 65000, status: '오픈예정', location: '경기 김포시', duration: '3시간', img: classImg },
  { id: 4, type: '상품',   name: '은은한 패턴 포인트 도자기 컵',  price: 54000, status: '판매중',   delivery: '즉시 발송',    img: cupImage2 },
  { id: 5, type: '도안',   name: '그릇 도안 PDF',                price: 3500,  status: '판매중',   pages: 6,                img: recipe },
  { id: 6, type: '상품',   name: '미니멀 화이트 도자기 볼',       price: 42000, status: '마감',     delivery: '제작 후 발송', img: product1 },
  { id: 7, type: '상품',   name: '은은한 데코 도자기 그릇',       price: 38000, status: '판매중',   delivery: '2일 내 발송',  img: product2 },
  { id: 8, type: '상품',   name: '따뜻한 화이트 화분',            price: 78000, status: '판매중',   delivery: '3일 내 발송',  img: flowerPot },
];

export const feeds = [
  {
    id: 1,
    type: 'artist',
    tag: '클래스',
    author: '온기 공방',
    profileImg,
    timeAgo: '2시간 전',
    title: '4월 입문 도자기 클래스 오픈 예정이에요!',
    content: '소규모(8명)로 진행해요. 신청 링크는 이번 주 안으로 올릴게요 :)',
    img: classImg,
    taggedProduct: { id: 3, name: '입문 도자기 클래스 4월', price: 65000, img: classImg },
    likes: 48,
    comments: 12,
  },
  {
    id: 2,
    type: 'artist',
    tag: '신상품',
    author: '온기 공방',
    profileImg,
    timeAgo: '1일 전',
    title: '오늘의 작은 초록 🌿',
    content: '따뜻한 색감의 도자기와 조용히 자라는 식물.',
    img: flowerPot,
    taggedProduct: { id: 4, name: '따뜻한 화이트 화분', price: 78000, img: flowerPot },
    likes: 92,
    comments: 27,
  },
  {
    id: 4,
    type: 'artist',
    tag: '작업 과정',
    author: '온기 공방',
    profileImg,
    timeAgo: '3일 전',
    title: '도자기 만드는 과정이에요',
    content: '하나하나 손으로 빚어 제작하기 때문에 각각의 형태와 질감이 조금씩 다른 것이 특징이랍니다.',
    img: makingImg,
    taggedProduct: null,
    likes: 61,
    comments: 8,
  },
  {
    id: 5,
    type: 'artist',
    tag: '작업 과정',
    author: '온기 공방',
    profileImg,
    timeAgo: '5일 전',
    title: '작업실 한켠 구경하실래요?',
    content: '오늘은 작업실 정리하는 날이에요. 요즘 작업에 몰두하고 있답니다.',
    img: workspace,
    taggedProduct: null,
    likes: 77,
    comments: 19,
  },
  {
    id: 3,
    type: 'review',
    tag: '후기',
    author: 'hani_***',
    profileImg: profile2,
    timeAgo: '3일 전',
    title: '수업 너무 만족했어요',
    content: '처음이었는데 설명이 친절해서 완성까지 잘 했어요!',
    img: classImg2,
    taggedProduct: { id: 3, name: '입문 코바늘 클래스 4월', price: 65000, img: classImg },
    likes: 14,
    comments: 3,
  },
  {
    id: 6,
    type: 'review',
    tag: '후기',
    author: 'kitty_****',
    profileImg: profile3,
    timeAgo: '3일 전',
    title: '화분 마음에 들어요',
    content: '집에 배치했는데 활기가 넘쳐요',
    img: review,
    taggedProduct: { id: 8, name: '따뜻한 화이트 화분', price: 78000, img: flowerPot },
    likes: 14,
    comments: 3,
  },
];

export const reviews = [
  {
    name: 'soyo_***', avatar: profile4,
    text: '실물이 사진보다 훨씬 예뻐요!  포장도 정성스러워서 감동받았어요!',
    img: review2,
    taggedProduct: { id: 4, name: '은은한 패턴 포인트 도자기 컵', price: 54000, img: cupImage2 },
    time: '2026.03.01', likes: 24, comments: 3,
  },
  {
    name: 'kitty_****', avatar: profile3,
    text: '화분 마음에 들어요. 집에 배치했는데 활기가 넘쳐요',
    img: review,
    taggedProduct: { id: 8, name: '따뜻한 화이트 화분', price: 78000, img: flowerPot },
    time: '2026.02.22', likes: 18, comments: 5,
  },
  {
    name: 'hani_***', avatar: profile2,
    text: '소규모라 질문도 많이 할 수 있었어요 ☺️ 처음 들었는데 완성작 들고 나왔어요! 강추합니다',
    img: classImg2,
    taggedProduct: { id: 3, name: '입문 도자기 클래스 4월', price: 65000, img: classImg },
    time: '2026.02.15', likes: 41, comments: 7,
  },
  {
    name: 'daily_***', avatar: profile5,
    text: '배송도 빠르고 퀄리티 대박이에요 🙌 색상 너무 예쁩니다',
    img: null,
    taggedProduct: { id: 1, name: '따뜻한 도자기 머그컵', price: 68000, img: cupImage1 },
    time: '2026.02.10', likes: 33, comments: 4,
  },
];

export const notices = [
  '4월 클래스 신청 3/25(화) 오전 10시 오픈 예정이에요',
  '도안 2종 이상 구매 시 10% 할인 이벤트 진행 중',
  '주문 후 평균 2~3일 이내 발송됩니다',
];

// 추후에 소식/후기 변경 혹은 소식, 후기 별도로 분리
export const tabs = ['홈', '상품', '도안', '클래스', '소식'];

export const classes = [
  {
    title: '입문 도자기 클래스 4월',
    date: '2026. 04. 12 (일)', time: '14:00 — 17:00',
    spots: '3/8', status: '신청중', price: 65000,
    year: 2026, month: 4, day: 12,
  },
  {
    title: '도자기 심화 클래스 4월',
    date: '2026. 04. 26 (일)', time: '14:00 — 17:00',
    spots: '0/8', status: '마감', price: 75000,
    year: 2026, month: 4, day: 26,
  },
];