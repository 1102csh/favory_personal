// src/features/community/services/postService.js
import { postRepository } from '../api/postRepository';
import { postLikeRepository } from '../api/postLikeRepository';
import { profileQueryRepository } from '@/features/profile/api/profileQueryRepository';
import { POST_MESSAGES } from '../constants/postConstants';

class PostError extends Error {
    constructor(code, message, cause) {
        super(message);
        this.name = 'PostError';
        this.code = code;
        this.cause = cause;
    }
}

const mapError = (error, fallbackMessage) => {
    if (!error) return null;
    return new PostError('POST_ERROR', fallbackMessage ?? POST_MESSAGES.errors.unknown, error);
};

export { PostError };

export const postService = {
    /**
     * 피드 조회.
     * RPC가 작성자 정보까지 포함해서 반환하므로 추가 가공 없음.
     */
    async fetchFeed({ cursor, category, limit } = {}) {
        const { data, error } = await postRepository.getFeed({ cursor, category, limit });
        if (error) throw mapError(error, '피드를 불러오지 못했습니다.');
        return data ?? [];
    },

    /**
     * 최신 매거진 목록 (캐러셀용).
     */
    async fetchFeaturedMagazines({ limit = 5 } = {}) {
        const { data, error } = await postRepository.listMagazines({ limit });
        if (error) throw mapError(error, '매거진을 불러오지 못했습니다.');
        return data ?? [];
    },

    /**
     * 매거진 관리용 목록 (admin).
     */
    async fetchMagazinesForAdmin({ limit = 50 } = {}) {
        const { data, error } = await postRepository.listMagazinesForAdmin({ limit });
        if (error) throw mapError(error, '매거진 목록을 불러오지 못했습니다.');
        return data ?? [];
    },

    /**
     * 매거진 작성.
     * @param {{ authorId: string, title: string, content: string,
     *           category?: string|null, coverUrl?: string|null }} input
     */
    async createMagazine({ authorId, title, content, category = null, coverUrl = null }) {
        const { data, error } = await postRepository.create({
            author_id: authorId,
            post_type: 'magazine',
            title,
            content,
            category,
            attachments: {
                cover_url: coverUrl,
                images: coverUrl ? [{ url: coverUrl }] : [],     // MagazineCard fallback 호환
            },
        });
        if (error) throw mapError(error, '매거진 작성에 실패했습니다.');
        return data;
    },

    /**
     * 매거진 수정.
     */
    async updateMagazine(postId, { title, content, category = null, coverUrl = null }) {
        const { data, error } = await postRepository.update(postId, {
            title,
            content,
            category,
            attachments: {
                cover_url: coverUrl,
                images: coverUrl ? [{ url: coverUrl }] : [],
            },
        });
        if (error) throw mapError(error, '매거진 수정에 실패했습니다.');
        return data;
    },

    /**
     * 단일 게시글 조회.
     * 작성자 정보를 평탄화 (post.author.nickname → post.author_nickname 등으로
     * RPC 결과와 형태 통일하지는 않고, 일단 nested 그대로 사용).
     */
    async fetchPost(postId, viewerId) {
        const { data, error } = await postRepository.getById(postId);
        if (error) {
            if (error.code === 'PGRST116') {
                throw new PostError('NOT_FOUND', POST_MESSAGES.errors.notFound, error);
            }
            throw mapError(error);
        }

        // profiles RLS로 인해 본인이 아닌 작성자는 임베디드 조인에서 null로 옴 —
        // 공개 프로필 RPC로 보강해야 PostAuthorInfo가 '알 수 없음'으로 빠지지 않음
        let author = data.author;
        if (!author && data.author_id) {
            const { data: profile } = await profileQueryRepository.getPublicProfileById(data.author_id);
            if (profile) {
                author = {
                    id: profile.id,
                    nickname: profile.nickname,
                    avatar_url: profile.avatar_url,
                    role: profile.role,
                };
            }
        }

        const isLiked = viewerId
            ? await postLikeRepository.hasLiked(postId, viewerId)
            : false;

        return { ...data, author, is_liked_by_me: isLiked };
    },

    /**
     * 게시글 작성.
     * @param {{ authorId: string, content: string, post_type?, category?, attachments? }} input
     */
    async createPost({ authorId, ...rest }) {
        const { data, error } = await postRepository.create({
            author_id: authorId,
            ...rest,
        });
        if (error) throw mapError(error, '게시글 작성에 실패했습니다.');
        return data;
    },

    async updatePost(postId, patch) {
        const { data, error } = await postRepository.update(postId, patch);
        if (error) throw mapError(error, '게시글 수정에 실패했습니다.');
        return data;
    },

    async deletePost(postId) {
        const { error } = await postRepository.softDelete(postId);
        if (error) throw mapError(error, '게시글 삭제에 실패했습니다.');
    },

    /**
     * 좋아요 토글.
     * 클라이언트의 현재 상태(isLiked)를 받아서 반대로 작용.
     * 낙관적 업데이트는 훅에서 처리.
     */
    async toggleLike({ postId, userId, isCurrentlyLiked }) {
        if (isCurrentlyLiked) {
            const { error } = await postLikeRepository.unlike(postId, userId);
            if (error) throw mapError(error, '좋아요 취소에 실패했습니다.');
            return { isLiked: false };
        }
        const { error } = await postLikeRepository.like(postId, userId);
        if (error) throw mapError(error, '좋아요에 실패했습니다.');
        return { isLiked: true };
    },

    /**
 * 게시글 조회수 증가.
 * 실패해도 로그만 남기고 예외를 throw하지 않음 (UI에 영향 주면 안 됨).
 */
    async recordView(postId) {
        try {
            const { error } = await postRepository.incrementViewCount(postId);
            if (error) {
                console.warn('[postService.recordView] failed:', error);
            }
        } catch (err) {
            console.warn('[postService.recordView] threw:', err);
        }
    },
};