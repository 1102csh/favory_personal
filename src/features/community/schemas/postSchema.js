// src/features/community/schemas/postSchema.js
import { z } from 'zod';
import { POST_TYPES, POST_CATEGORIES, POST_LIMITS, POST_MESSAGES } from '../constants/postConstants';

export const postCreateSchema = z.object({
  content: z.string()
    .min(1, POST_MESSAGES.content.required)
    .max(POST_LIMITS.contentMax, POST_MESSAGES.content.tooLong),
  post_type: z.enum([
    POST_TYPES.GENERAL,
    POST_TYPES.SHOWCASE,
    POST_TYPES.NOTICE,
    POST_TYPES.TUTORIAL,
  ]).default(POST_TYPES.GENERAL),
  category: z.enum(POST_CATEGORIES).optional().nullable(),
  attachments: z.object({
    images: z.array(z.object({
      url: z.string().url(),
      width: z.number().optional(),
      height: z.number().optional(),
      alt: z.string().optional(),
    })).max(POST_LIMITS.imagesMax).optional(),
    attached_products: z.array(z.string().uuid()).optional(),
    external_links: z.array(z.object({
      url: z.string().url(),
      title: z.string().optional(),
      thumbnail: z.string().url().optional(),
    })).optional(),
  }).default({}),
});

/**
 * 매거진 작성/수정 스키마.
 * 일반 글과 달리:
 *   - title 필수
 *   - content는 markdown
 *   - attachments.cover_url(표지) 별도 보관
 */
export const magazineCreateSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(POST_LIMITS.titleMax),
  content: z.string()
    .min(1, '본문을 입력해주세요.')
    .max(POST_LIMITS.contentMax),
  category: z.enum(POST_CATEGORIES).optional().nullable(),
  attachments: z.object({
    cover_url: z.string().url().optional().nullable(),
  }).default({}),
});

export const commentCreateSchema = z.object({
  content: z.string()
    .min(1, POST_MESSAGES.comment.required)
    .max(POST_LIMITS.commentMax, POST_MESSAGES.comment.tooLong),
  parent_id: z.string().uuid().nullable().optional(),
});