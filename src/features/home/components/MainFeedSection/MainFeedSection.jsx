// src/features/home/components/MainFeedSection/MainFeedSection.jsx
import { useNavigate } from 'react-router-dom';
import { useFeed } from '@/features/community/hooks/useFeed';
import { usePostLike } from '@/features/community/hooks/usePostLike';
import PostListItem from '@/features/community/components/PostListItem';
import { POST_LIMITS } from '@/features/community/constants/postConstants';

/**
 * 메인 홈 화면의 피드 섹션.
 * 커뮤니티 피드를 미리보기로 5~6개 노출.
 */
const MainFeedSection = ({ isMobile }) => {
  const navigate = useNavigate();
  const { posts, isLoading, replacePost } = useFeed({});
  const { toggleLike, isPending } = usePostLike({ onLocalUpdate: replacePost });

  const previewPosts = posts.slice(0, 6);

  return (
    <section className="au d1">
      <div style={{ marginBottom: 18 }}>
        <p
          style={{
            fontSize: 9,
            letterSpacing: 4,
            color: 'var(--brand-dark)',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          Weekly Hot
        </p>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 21,
            fontWeight: 600,
          }}
        >
          이번 주 작가 소식
        </h3>
      </div>

      {isLoading && previewPosts.length === 0 ? (
        <p style={{ color: 'var(--gray)', fontSize: 14 }}>불러오는 중...</p>
      ) : previewPosts.length === 0 ? (
        <p style={{ color: 'var(--gray)', fontSize: 14 }}>
          아직 게시글이 없습니다.
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxWidth: isMobile ? '100%' : 800,
            margin: isMobile ? 0 : '0 auto',
          }}
        >
          {previewPosts.map((post) => (
            <PostListItem
              key={post.id}
              post={post}
              onToggleLike={toggleLike}
              isLikePending={isPending(post.id)}
            />
          ))}

          <button
            type="button"
            onClick={() => navigate('/community')}
            className="all-feeds-btn press"
          >
            모든 소식 보기 →
          </button>
        </div>
      )}
    </section>
  );
};

export default MainFeedSection;