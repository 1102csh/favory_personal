// src/shared/services/imageUploadService.js
import {
  uploadImage,
  deleteImages,
  listUserFiles,
  extractPathFromPublicUrl,
  BUCKETS,
} from '../api/storageRepository';
import { compressImage, COMPRESSION_PRESETS } from '../lib/image/imageCompressor';

/**
 * 이미지 업로드 흐름:
 * 1) 압축 (옵션)
 * 2) 업로드
 * 3) public URL 반환
 * 4) (옵션) 이전 파일 정리
 *
 * @param {{
 *   kind: 'avatar'|'cover'|'post'|'product',
 *   userId: string,
 *   file: File,
 *   replacePrevious?: boolean,   // true면 같은 버킷의 이전 파일들 삭제
 *   compress?: boolean,          // 기본 true
 * }} args
 * @returns {Promise<{ path: string, publicUrl: string }>}
 */
export const uploadAndManageImage = async ({
  kind,
  userId,
  file,
  replacePrevious = false,
  compress = true,
}) => {
  if (!file) throw new Error('파일이 없습니다.');
  if (!userId) throw new Error('로그인이 필요합니다.');

  const bucket = bucketForKind(kind);
  const preset = COMPRESSION_PRESETS[kind];

  // 1) 압축
  let toUpload = file;
  if (compress && preset) {
    try {
      toUpload = await compressImage(file, preset);
    } catch (e) {
      // 압축 실패 시 원본으로 시도
      console.warn('[upload] 압축 실패, 원본으로 업로드:', e);
      toUpload = file;
    }
  }

  // 2) 업로드
  const { path, publicUrl } = await uploadImage({
    bucket,
    userId,
    file: toUpload,
    originalName: file.name,
    contentType: toUpload.type ?? file.type,
  });

  // 3) 이전 파일 정리 (실패해도 본 업로드 결과는 반환)
  if (replacePrevious) {
    try {
      await cleanupOldFiles({ bucket, userId, keepPath: path });
    } catch (e) {
      console.warn('[upload] 이전 파일 정리 실패:', e);
    }
  }

  return { path, publicUrl };
};

const bucketForKind = (kind) => {
  switch (kind) {
    case 'avatar':  return BUCKETS.AVATARS;
    case 'cover':   return BUCKETS.COVERS;
    case 'post':    return BUCKETS.POST_IMAGES;
    case 'product': return BUCKETS.PRODUCT_IMAGES;
    default:
      throw new Error(`알 수 없는 업로드 종류: ${kind}`);
  }
};

/**
 * 사용자 폴더의 keepPath를 제외한 모든 파일 삭제.
 * keepPath는 'userId/file.ext' 형태.
 */
const cleanupOldFiles = async ({ bucket, userId, keepPath }) => {
  const files = await listUserFiles({ bucket, userId });
  const keepName = keepPath.split('/').pop();
  const toDelete = files
    .filter((f) => f.name !== keepName)
    .map((f) => `${userId}/${f.name}`);

  if (toDelete.length === 0) return;
  await deleteImages({ bucket, paths: toDelete });
};

/**
 * URL에서 storage path를 추출해 단일 파일 삭제.
 * 게시글 삭제 시 첨부 이미지 삭제용.
 */
export const deleteImageByUrl = async (kind, url) => {
  const bucket = bucketForKind(kind);
  const path = extractPathFromPublicUrl(bucket, url);
  if (!path) return;
  await deleteImages({ bucket, paths: [path] });
};