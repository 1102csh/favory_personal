import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

import LegacyScope from '@/shared/ui/LegacyScope/LegacyScope';
import Alert from '@/shared/ui/Alert/Alert';
import { useResponsive } from '@/shared/hooks/useResponsive';
import SiteNav from '@/features/home/components/SiteNav/SiteNav';

import { usePost } from '@/features/community/hooks/usePost';
import { postService } from '@/features/community/services/postService';
import { useAuth } from '@/app/providers/AuthProvider';
import MagazineEditor from '../components/MagazineEditor/MagazineEditor';

import styles from './AdminMagazineEditPage.module.scss';

const AdminMagazineEditPage = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id: postId } = useParams();
  const { isMobile } = useResponsive();
  const { user } = useAuth();

  const { post, isLoading, error } = usePost(
    mode === 'edit' ? postId : null,
    user?.id
  );

  const handleSave = async (payload) => {
    if (mode === 'edit') {
      const updated = await postService.updateMagazine(postId, payload);
      navigate(`/community/posts/${updated.id}`, { replace: true });
      return updated;
    }
    const created = await postService.createMagazine(payload);
    navigate(`/community/posts/${created.id}`, { replace: true });
    return created;
  };

  const handleCancel = () => {
    navigate('/admin'); // 취소 시 다시 통합 관리자 페이지로 이동
  };

  const pageTitle = mode === 'edit' ? '매거진 수정' : '새 매거진 작성';

  return (
    <LegacyScope>
      <SiteNav isMobile={isMobile} />

      <div className={styles.container}>
        <Link to="/admin" className={styles.backLink}>
          <ArrowLeft size={16} /> 관리자 홈으로
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>
            <BookOpen size={20} /> {pageTitle}
          </h1>
        </header>

        {error && (
          <Alert tone="danger">
            {error.message ?? '매거진을 불러올 수 없습니다.'}
          </Alert>
        )}

        {mode === 'edit' && isLoading && (
          <p className={styles.loading}>불러오는 중...</p>
        )}

        {(mode === 'create' || (!isLoading && !error && post)) && (
          <MagazineEditor
            mode={mode}
            initialMagazine={mode === 'edit' ? post : null}
            onSaved={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </LegacyScope>
  );
};

export default AdminMagazineEditPage;