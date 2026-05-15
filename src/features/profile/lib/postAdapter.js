// src/features/profile/lib/postAdapter.js
import { formatRelativeTime } from '@/shared/lib/formatters/relativeTime';

/**
 * posts 테이블의 row를 ProfilePage(NewsTabSection, StreamCard)가 기대하는
 * 평탄한 mock 형태로 변환.
 *
 * posts.attachments 구조:
 *   { images: [{ url, ... }], attached_products: [uuid, ...], external_links: [...] }
 *
 * ProfilePage의 mock feeds 형태:
 *   { id, type, tag, author, profileImg, timeAgo, title, content, img, taggedProduct, likes, comments }
 *
 * 어떻게 매핑되는가:
 *   id            → post.id
 *   type          → 'artist' (작가 게시글이라 가정)
 *   tag           → post.category 또는 POST_TYPE 라벨
 *   author        → post.author.nickname
 *   profileImg    → post.author.avatar_url
 *   timeAgo       → 상대 시간 ("2시간 전")
 *   title         → 본문의 첫 줄 (~30자)
 *   content       → 본문 전체 또는 첫 줄 이후
 *   img           → attachments.images[0].url
 *   taggedProduct → attached_products[0]을 placeholder 객체로 (실제 product fetch는 별도 단계)
 *   likes         → post.like_count
 *   comments      → post.comment_count
 *
 * @param {object} post  - posts RPC 또는 listByAuthor 결과의 row
 * @returns {object} ProfilePage용 feed 객체
 */
export const adaptPostToProfileFeed = (post) => {
  if (!post) return null;

  // author 정보 — RPC 평탄형(author_nickname)과 nested(author.nickname) 둘 다 지원
  const authorNickname =
    post.author?.nickname ?? post.author_nickname ?? '알 수 없음';
  const authorAvatar =
    post.author?.avatar_url ?? post.author_avatar_url ?? null;

  // 본문 — 첫 줄을 제목으로 분리
  const lines = (post.content ?? '').split('\n');
  const firstLine = lines[0] ?? '';
  const restLines = lines.slice(1).join('\n').trim();

  // 첫 줄이 너무 길면 30자에서 자르고 "..." 표시
  const TITLE_MAX = 30;
  const title =
    firstLine.length > TITLE_MAX
      ? firstLine.slice(0, TITLE_MAX) + '…'
      : firstLine;
  const content = restLines || (firstLine.length > TITLE_MAX ? firstLine : '');

  // 첫 이미지
  const firstImage = post.attachments?.images?.[0]?.url ?? null;

  // 첫 상품 태그 (placeholder — 실제 product 정보는 별도 fetch 필요)
  const firstProductId = post.attachments?.attached_products?.[0];
  const taggedProduct = firstProductId
    ? {
        id: firstProductId,
        name: '연결된 상품',                   // 추후 product 데이터 fetch 시 교체
        price: 0,
        img: firstImage ?? '',
      }
    : null;

  return {
    id: post.id,
    type: 'artist',
    tag: post.category ?? '소식',
    author: authorNickname,
    profileImg: authorAvatar,
    timeAgo: formatRelativeTime(post.created_at),
    title,
    content,
    img: firstImage,
    taggedProduct,
    likes: post.like_count ?? 0,
    comments: post.comment_count ?? 0,
  };
};

/**
 * 배열 변환 헬퍼.
 */
export const adaptPostsToProfileFeeds = (posts) =>
  Array.isArray(posts) ? posts.map(adaptPostToProfileFeed).filter(Boolean) : [];