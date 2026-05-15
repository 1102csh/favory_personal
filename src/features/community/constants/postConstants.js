// src/features/community/constants/postConstants.js

export const POST_TYPES = Object.freeze({
  GENERAL:   'general',
  SHOWCASE:  'showcase',
  NOTICE:    'notice',
  TUTORIAL:  'tutorial',
  MAGAZINE: 'magazine',         
});

export const POST_TYPE_LABELS = Object.freeze({
  [POST_TYPES.GENERAL]:  '일반',
  [POST_TYPES.SHOWCASE]: '작품 공개',
  [POST_TYPES.NOTICE]:   '공지',
  [POST_TYPES.TUTORIAL]: '튜토리얼',
  [POST_TYPES.MAGAZINE]: 'FAVORY 매거진', 
});

export const POST_CATEGORIES = Object.freeze([
  '공방', '소품', '도안', '클래스', '자유',
]);

export const POST_VISIBILITY = Object.freeze({
  PUBLIC:          'public',
  FOLLOWERS_ONLY:  'followers_only',
  PRIVATE:         'private',
});

export const POST_LIMITS = Object.freeze({
  contentMax: 5000,
  commentMax: 1000,
  titleMax: 200,    
  imagesMax: 10,
  pageSize: 20,
});

export const POST_MESSAGES = Object.freeze({
  content: {
    required: '내용을 입력해주세요.',
    tooLong: '내용은 5000자 이내로 작성해주세요.',
  },
  comment: {
    required: '댓글을 입력해주세요.',
    tooLong: '댓글은 1000자 이내로 작성해주세요.',
  },
  errors: {
    notFound: '게시글을 찾을 수 없습니다.',
    notAuthor: '본인의 글만 수정/삭제할 수 있습니다.',
    unknown: '알 수 없는 오류가 발생했습니다.',
  },
});