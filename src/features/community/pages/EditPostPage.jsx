// src/features/community/pages/EditPostPage.jsx
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '@/shared/ui/Alert';
import { useAuth } from '@/app/providers/AuthProvider';

import PostComposer from '../components/PostComposer';
import WritePageShell from '../components/WritePageShell';
import { usePost } from '../hooks/usePost';

/**
 * /community/posts/:id/edit — 게시글 수정 페이지.
 * 본인 글이 아니면 자동 redirect.
 */
const EditPostPage = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { post, isLoading, error } = usePost(postId, user?.id);

  // 본인 글이 아닐 때 상세로 redirect — effect로 이동
  const isForbidden = Boolean(post && user && post.author_id !== user.id);
  useEffect(() => {
    if (isForbidden) {
      navigate(`/community/posts/${postId}`, { replace: true });
    }
  }, [isForbidden, navigate, postId]);
  if (isForbidden) return null;

  const handleUpdated = (updated) => {
    navigate(`/community/posts/${updated.id}`, { replace: true });
  };

  const handleCancel = () => {
    navigate(`/community/posts/${postId}`);
  };

  return (
    <WritePageShell
      title="게시글 수정"
      cancelLabel="게시글로 돌아가기"
      onCancel={handleCancel}
    >
      {error && (
        <Alert tone="danger">
          {error.message ?? '게시글을 불러올 수 없습니다.'}
        </Alert>
      )}

      {isLoading && (
        <p style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-secondary)' }}>
          불러오는 중...
        </p>
      )}

      {!isLoading && !error && post && (
        <PostComposer
          variant="page"
          mode="edit"
          initialPost={post}
          onCreated={handleUpdated}
          onCancel={handleCancel}
        />
      )}
    </WritePageShell>
  );
};

export default EditPostPage;
