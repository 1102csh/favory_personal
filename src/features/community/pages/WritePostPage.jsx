// src/features/community/pages/WritePostPage.jsx
import { useNavigate } from 'react-router-dom';

import PostComposer from '../components/PostComposer';
import WritePageShell from '../components/WritePageShell';

/**
 * /community/write — 게시글 작성 페이지.
 *
 * 작성 완료 → 방금 만든 게시글 상세로 이동
 * 취소 또는 뒤로가기 → 피드로 복귀
 */
const WritePostPage = () => {
  const navigate = useNavigate();

  const handleCreated = (post) => {
    if (post?.id) {
      navigate(`/community/posts/${post.id}`, { replace: true });
    } else {
      navigate('/community', { replace: true });
    }
  };

  const handleCancel = () => {
    navigate('/community');
  };

  return (
    <WritePageShell
      title="새 글 작성"
      cancelLabel="피드로 돌아가기"
      onCancel={handleCancel}
    >
      <PostComposer
        variant="page"
        onCreated={handleCreated}
        onCancel={handleCancel}
      />
    </WritePageShell>
  );
};

export default WritePostPage;
