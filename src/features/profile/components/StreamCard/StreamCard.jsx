// src/features/profile/components/StreamCard/StreamCard.jsx
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

/**
 * 프로필 페이지의 가로/그리드 피드 카드.
 *
 * 클릭 동작:
 *   - 작가 소식 (isReview=false) 카드 본체 클릭 → 글 상세 페이지로 이동
 *     (post.id가 있을 때만 활성화)
 *   - 태그된 상품 영역 클릭 → 상품 상세로 이동 (카드 본체 이벤트는 차단)
 *   - 리뷰 (isReview=true) — 현재 mock 데이터라 id 없음, 카드 본체는 비활성
 *
 * @param {object} props
 * @param {object} props.post
 * @param {boolean} [props.isReview]   - true면 리뷰 데이터 형태로 해석
 */
export default function StreamCard({ post, isReview }) {
  const navigate = useNavigate();

  const isCardClickable = !isReview && Boolean(post?.id);

  const goToPostDetail = () => {
    if (isCardClickable) {
      navigate(`/community/posts/${post.id}`);
    }
  };

  const handleProductClick = (e) => {
    e.stopPropagation();
    const productId = post?.taggedProduct?.id;
    if (productId) navigate(`/products/${productId}`);
  };

  const handleKeyDown = (e) => {
    if (!isCardClickable) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToPostDetail();
    }
  };

  return (
    <div
      className={clsx('stream-card', isCardClickable && 'stream-card--clickable')}
      role={isCardClickable ? 'link' : undefined}
      tabIndex={isCardClickable ? 0 : undefined}
      onClick={isCardClickable ? goToPostDetail : undefined}
      onKeyDown={handleKeyDown}
      aria-label={isCardClickable ? `${post.title || post.content} - 글 상세로 이동` : undefined}
    >
      <div className="stream-card__body">
        <div className="stream-card__header">
          <div className="stream-card__avatar">
            <img src={isReview ? post.avatar : post.profileImg} alt="" />
          </div>
          <div className="stream-card__author">
            <p className="stream-card__name">
              {isReview ? post.name : post.author}
            </p>
            <p className="stream-card__time">
              {post.timeAgo || post.time}
            </p>
          </div>
        </div>

        {!isReview && post.title && (
          <p className="stream-card__title">{post.title}</p>
        )}

        <p className="stream-card__content">{post.content || post.text}</p>
      </div>

      <div className="stream-card__image-wrap">
        {post.img && (
          <img src={post.img} alt="" className="stream-card__image" />
        )}
      </div>

      <div className="stream-card__product-tag-wrap">
        {post.taggedProduct && (
          <div
            className="stream-card__product-tag"
            role={post.taggedProduct.id ? 'button' : undefined}
            tabIndex={post.taggedProduct.id ? 0 : undefined}
            onClick={handleProductClick}
            onKeyDown={(e) => {
              if (!post.taggedProduct.id) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/products/${post.taggedProduct.id}`);
              }
            }}
          >
            <img
              src={post.taggedProduct.img}
              className="stream-card__product-tag-img"
              alt=""
            />
            <div className="stream-card__product-tag-info">
              <p className="stream-card__product-tag-name">
                {post.taggedProduct.name}
              </p>
              <p className="stream-card__product-tag-price">
                {post.taggedProduct.price.toLocaleString()}원
              </p>
            </div>
            <span className="stream-card__product-tag-arrow">›</span>
          </div>
        )}
      </div>

      <div className="stream-card__actions">
        <span className="stream-card__like">♡ {post.likes}</span>
        <span className="stream-card__comment">· {post.comments}</span>
      </div>
    </div>
  );
}
