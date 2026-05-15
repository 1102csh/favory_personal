// src/shared/hooks/useImageUpload.js
import { useCallback, useState } from 'react';
import { uploadAndManageImage } from '../services/imageUploadService';
import { useAuth } from '@/app/providers/AuthProvider';

/**
 * 이미지 업로드 훅.
 *
 * @param {{
 *   kind: 'avatar'|'cover'|'post'|'product',
 *   replacePrevious?: boolean,
 *   onUploaded?: (result: { path: string, publicUrl: string }) => void,
 * }} options
 */
export const useImageUpload = ({
  kind,
  replacePrevious = false,
  onUploaded,
} = {}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = useCallback(
    async (file) => {
      if (!user) {
        const err = new Error('로그인이 필요합니다.');
        setError(err);
        throw err;
      }

      setIsUploading(true);
      setError(null);
      try {
        const result = await uploadAndManageImage({
          kind,
          userId: user.id,
          file,
          replacePrevious,
        });
        onUploaded?.(result);
        return result;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setIsUploading(false);
      }
    },
    [user, kind, replacePrevious, onUploaded]
  );

  /**
   * 다중 파일 병렬 업로드.
   * onUploaded는 호출하지 않음 — 호출자가 결과 배열을 한 번에 처리.
   */
  const uploadMany = useCallback(
    async (files) => {
      if (!user) {
        const err = new Error('로그인이 필요합니다.');
        setError(err);
        throw err;
      }
      const list = Array.from(files ?? []);
      if (list.length === 0) return [];

      setIsUploading(true);
      setError(null);
      try {
        const results = await Promise.all(
          list.map((file) =>
            uploadAndManageImage({
              kind,
              userId: user.id,
              file,
              // 다중 업로드는 항상 새 파일 — replacePrevious는 의미 없음
              replacePrevious: false,
            })
          )
        );
        return results;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setIsUploading(false);
      }
    },
    [user, kind]
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return { upload, uploadMany, isUploading, error, reset };
};