// src/features/profile/schemas/profileEditSchema.js
import { z } from 'zod';
import { SOCIAL_PLATFORM_KEYS } from '../constants/socialPlatforms';

const HANDLE_REGEX = /^[a-z0-9_.]{3,20}$/;
const TAG_REGEX = /^[^\n\t\\/]{1,30}$/;

const trimmedString = (max, msg) =>
  z.string().trim().max(max, msg);

/**
 * 빈 문자열을 undefined로 변환 (선택 입력 처리용).
 * z.preprocess로 사용.
 */
const emptyToUndefined = (val) =>
  typeof val === 'string' && val.trim() === '' ? undefined : val;

export const profileEditSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, '닉네임은 2자 이상이어야 해요')
    .max(20, '닉네임은 20자 이내로 작성해주세요'),

  handle: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .regex(HANDLE_REGEX, '영문 소문자/숫자/_/. (3~20자)만 가능해요')
      .optional()
  ),

  bio: z.preprocess(
    emptyToUndefined,
    trimmedString(500, '자기소개는 500자 이내로 작성해주세요').optional()
  ),

  avatarUrl: z.preprocess(
    emptyToUndefined,
    z.string().url('올바른 URL이 아니에요').optional()
  ),

  coverImageUrl: z.preprocess(
    emptyToUndefined,
    z.string().url('올바른 URL이 아니에요').optional()
  ),

  tags: z
    .array(
      z.string()
        .trim()
        .regex(TAG_REGEX, '태그에 사용할 수 없는 문자가 있어요')
    )
    .max(10, '태그는 최대 10개까지 등록할 수 있어요')
    .default([]),

  socialLinks: z
    .object(
      SOCIAL_PLATFORM_KEYS.reduce((acc, key) => {
        acc[key] = z.preprocess(
          emptyToUndefined,
          z.string().url('올바른 URL이 아니에요').optional()
        );
        return acc;
      }, {})
    )
    .default({}),
});