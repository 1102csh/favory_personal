// src/features/community/pages/PostDetailPage.jsx
import { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

import LegacyScope from '@/shared/ui/LegacyScope/LegacyScope';
import Alert from '@/shared/ui/Alert/Alert';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { useAuth } from '@/app/providers/AuthProvider';
import { usePostBookmark } from '../hooks/usePostBookmark';
import SiteNav from '@/features/home/components/SiteNav';

import PostCard from '../components/PostCard/PostCard';
import MagazineArticle from '../components/MagazineArticle';
import CommentList from '../components/CommentList/CommentList';
import CommentInput from '../components/CommentInput/CommentInput';
import AuthorMorePosts from '../components/AuthorMorePosts';
import { POST_TYPES } from '../constants/postConstants';

import { postService } from '../services/postService';
import { usePost } from '../hooks/usePost';
import { usePostLike } from '../hooks/usePostLike';
import { useComments } from '../hooks/useComments';

import styles from './PostDetailPage.module.scss';

const COMMENT_SORT = Object.freeze({
    NEWEST: 'newest',
    OLDEST: 'oldest',
});

const PostDetailPage = () => {
    const { id: postId } = useParams();
    const navigate = useNavigate();
    const { isMobile } = useResponsive();
    const { user } = useAuth();

    const [shareToast, setShareToast] = useState(null);
    const [commentSort, setCommentSort] = useState(COMMENT_SORT.NEWEST);

    const { post, isLoading, error, replacePost } = usePost(postId, user?.id);

    const {
        tree, isLoading: commentsLoading, createComment,
        deleteComment, isOwnComment,
    } = useComments(postId);

    // 최상위 댓글 정렬 — 대댓글 순서(답글 스레드)는 유지
    const sortedTree = useMemo(() => {
        if (commentSort === COMMENT_SORT.OLDEST) return tree;
        return [...tree].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }, [tree, commentSort]);

    const { toggleLike, isPending: isLikePending } = usePostLike({
        onLocalUpdate: replacePost,
    });

    const { toggleBookmark, isPending: isBookmarkPending } = usePostBookmark({
        onLocalUpdate: replacePost,
    });

    const handleDelete = async (id) => {
        try {
            await postService.deletePost(id);
            navigate('/community', { replace: true });
        } catch (e) {
            alert(e.message ?? '삭제에 실패했습니다.');
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ url, title: post?.title || '글 공유' });
                return;
            }
            await navigator.clipboard.writeText(url);
            setShareToast('링크가 복사되었어요');
            setTimeout(() => setShareToast(null), 1800);
        } catch {
            // 사용자가 취소했거나 권한 거부 — 조용히 무시
        }
    };

    // 조회수 기록 — postId당 1회만
    const recordedRef = useRef(null);
    
    useEffect(() => {
        if (!postId) return;
        if (recordedRef.current === postId) return;
        recordedRef.current = postId;
        postService.recordView(postId);
    }, [postId]);

    // 모바일 + 로그인 시 sticky 입력 사용 → 하단 영역만큼 본문에 padding 확보
    const useStickyInput = isMobile && Boolean(user);

    return (
        <LegacyScope style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
            <SiteNav isMobile={isMobile} />

            <div
                className={clsx(styles.container, useStickyInput && styles.containerWithStickyInput)}
            >
                <Link to="/community" className={styles.backLink}>
                    <ChevronLeft size={16} /> 피드로 돌아가기
                </Link>

                {error && (
                    <Alert tone="danger">
                        {error.message ?? '게시글을 불러올 수 없습니다.'}
                    </Alert>
                )}

                {isLoading ? (
                    <DetailSkeleton />
                ) : post ? (
                    <>
                        {post.post_type === POST_TYPES.MAGAZINE ? (
                            <MagazineArticle
                                post={post}
                                onToggleLike={toggleLike}
                                isLikePending={isLikePending(post.id)}
                                onToggleBookmark={toggleBookmark}
                                isBookmarkPending={isBookmarkPending(post.id)}
                                onShare={handleShare}
                                onDelete={handleDelete}
                            />
                        ) : (
                            <PostCard
                                post={post}
                                linkToDetail={false}
                                expandImages={true}
                                expanded={true}
                                onToggleLike={toggleLike}
                                isLikePending={isLikePending(post.id)}
                                onToggleBookmark={toggleBookmark}
                                isBookmarkPending={isBookmarkPending(post.id)}
                                onShare={handleShare}
                                onDelete={handleDelete}
                            />
                        )}

                        <section className={styles.commentSection} aria-label="댓글">
                            <header className={styles.commentHeader}>
                                <h2 className={styles.commentTitle}>
                                    댓글 <span className={styles.commentCount}>{post.comment_count ?? 0}</span>
                                </h2>
                                {tree.length > 1 && (
                                    <CommentSortToggle
                                        value={commentSort}
                                        onChange={setCommentSort}
                                    />
                                )}
                            </header>

                            {/* 비로그인 안내 — sticky 입력은 별도 위치에 렌더 */}
                            {!user && (
                                <Alert tone="info">
                                    댓글을 작성하려면 로그인이 필요합니다.
                                </Alert>
                            )}

                            {/* 데스크톱: 입력창 인라인 */}
                            {user && !isMobile && (
                                <CommentInput
                                    onSubmit={(content) => createComment({ content })}
                                    placeholder="댓글을 입력해주세요"
                                />
                            )}

                            {commentsLoading ? (
                                <CommentListSkeleton />
                            ) : (
                                <CommentList
                                    tree={sortedTree}
                                    isOwnComment={isOwnComment}
                                    onReply={(parentId, content) =>
                                        createComment({ content, parentId })
                                    }
                                    onDelete={deleteComment}
                                />
                            )}
                        </section>

                        {/* 이 작가의 다른 글 — 댓글 다음에 배치 */}
                        {post.author_id && (
                            <AuthorMorePosts
                                authorId={post.author_id}
                                authorName={post.author?.nickname ?? '작가'}
                                excludePostId={post.id}
                            />
                        )}
                    </>
                ) : null}
            </div>

            {/* 모바일: sticky 댓글 입력 */}
            {useStickyInput && (
                <div className={styles.mobileStickyInput}>
                    <CommentInput
                        onSubmit={(content) => createComment({ content })}
                        placeholder="댓글을 입력해주세요"
                    />
                </div>
            )}

            {shareToast && (
                <div className={styles.toast} role="status" aria-live="polite">
                    {shareToast}
                </div>
            )}
        </LegacyScope>
    );
};

// ============ 댓글 정렬 토글 ============
const CommentSortToggle = ({ value, onChange }) => (
    <div className={styles.sortToggle} role="group" aria-label="댓글 정렬">
        <button
            type="button"
            className={clsx(
                styles.sortOption,
                value === COMMENT_SORT.NEWEST && styles.sortOptionActive
            )}
            onClick={() => onChange(COMMENT_SORT.NEWEST)}
            aria-pressed={value === COMMENT_SORT.NEWEST}
        >
            최신순
        </button>
        <button
            type="button"
            className={clsx(
                styles.sortOption,
                value === COMMENT_SORT.OLDEST && styles.sortOptionActive
            )}
            onClick={() => onChange(COMMENT_SORT.OLDEST)}
            aria-pressed={value === COMMENT_SORT.OLDEST}
        >
            오래된순
        </button>
    </div>
);

// ============ Skeletons ============
const DetailSkeleton = () => (
    <div className={styles.skeletonCard} aria-hidden>
        <div className={styles.skeletonHeader}>
            <div className={styles.skeletonAvatar} />
            <div className={styles.skeletonAuthor}>
                <div className={styles.skeletonLineXs} />
                <div className={styles.skeletonLineXxs} />
            </div>
        </div>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonBody}>
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLineShort} />
        </div>
        <div className={styles.skeletonImage} />
        <div className={styles.skeletonActionsBar}>
            <div className={styles.skeletonActionItem} />
            <div className={styles.skeletonActionItem} />
        </div>
    </div>
);

const CommentListSkeleton = () => (
    <ul className={styles.commentSkeletonList} aria-hidden>
        {Array.from({ length: 2 }).map((_, i) => (
            <li key={i} className={styles.commentSkeletonItem}>
                <div className={styles.skeletonAvatar} />
                <div className={styles.commentSkeletonBody}>
                    <div className={styles.skeletonLineXs} />
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLineShort} />
                </div>
            </li>
        ))}
    </ul>
);

export default PostDetailPage;
