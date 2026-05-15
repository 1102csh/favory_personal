// src/shared/api/storageRepository.js
import { supabase } from './supabaseClient';

const BUCKETS = Object.freeze({
  AVATARS: 'avatars',
  COVERS: 'covers',
  POST_IMAGES: 'post-images',
  PRODUCT_IMAGES: 'product-images',
});

export { BUCKETS };

/**
 * 파일 경로 생성: {userId}/{timestamp}.{ext}
 * (버킷 이름은 SDK가 자동 추가)
 */
const buildPath = (userId, fileName) => {
  const timestamp = Date.now();
  const ext = fileName.split('.').pop()?.toLowerCase() || 'jpg';
  return `${userId}/${timestamp}.${ext}`;
};

/**
 * Blob/File을 지정 버킷에 업로드하고 public URL을 반환.
 *
 * @param {{
 *   bucket: string,
 *   userId: string,
 *   file: Blob|File,
 *   originalName: string,
 *   contentType?: string,
 * }} args
 * @returns {Promise<{ path: string, publicUrl: string }>}
 */
export const uploadImage = async ({
  bucket,
  userId,
  file,
  originalName,
  contentType,
}) => {
  if (!userId) {
    throw new Error('업로드하려면 로그인이 필요합니다.');
  }

  const path = buildPath(userId, originalName);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: contentType ?? file.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
};

/**
 * 파일 삭제.
 *
 * @param {{ bucket: string, paths: string[] }} args
 */
export const deleteImages = async ({ bucket, paths }) => {
  if (!paths?.length) return;
  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) throw error;
};

/**
 * URL에서 storage path 추출.
 * https://xxx.supabase.co/storage/v1/object/public/avatars/abc/123.jpg
 *  → 'abc/123.jpg'
 *
 * @param {string} bucket
 * @param {string} url
 * @returns {string|null}
 */
export const extractPathFromPublicUrl = (bucket, url) => {
  if (!url || typeof url !== 'string') return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
};

/**
 * 사용자의 특정 버킷 폴더 안 모든 파일 나열.
 * 새 파일 업로드 후 이전 파일들을 정리할 때 사용.
 */
export const listUserFiles = async ({ bucket, userId }) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(userId, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });
  if (error) throw error;
  return data ?? [];
};