// src/shared/ui/ImageUploadField/ImageUploadField.jsx
import { useId, useRef, useState } from 'react';
import { Upload, X, Loader2, Link as LinkIcon } from 'lucide-react';
import clsx from 'clsx';
import { useImageUpload } from '@/shared/hooks/useImageUpload';
import styles from './ImageUploadField.module.scss';

/**
 * 이미지 입력 필드.
 *
 * 두 가지 모드:
 *  - 파일 업로드 (기본): 클릭/드롭 → 압축 → Storage 업로드 → URL 자동 입력
 *  - 외부 URL 입력 (선택): "URL로 입력" 토글 시 텍스트 입력
 *
 * 다중 업로드 (multiple=true):
 *  - 한 번에 여러 파일 선택 가능 (file input multiple + drop)
 *  - 최대 maxFiles까지 잘라서 업로드 후 onMultipleUploaded(publicUrls[])
 *
 * @param {object} props
 * @param {string} props.value
 * @param {(url: string) => void} props.onChange         - 단일 모드 콜백
 * @param {'avatar'|'cover'|'post'|'product'} props.kind
 * @param {boolean} [props.replacePrevious=false]
 * @param {string} [props.label]
 * @param {string} [props.hint]
 * @param {string} [props.error]
 * @param {'square'|'wide'} [props.previewShape='square']
 * @param {boolean} [props.multiple=false]               - 여러 파일 선택 허용
 * @param {number} [props.maxFiles=10]                   - multiple 시 최대 처리 개수
 * @param {(urls: string[]) => void} [props.onMultipleUploaded] - multiple 콜백
 */
const ImageUploadField = ({
  value,
  onChange,
  kind,
  replacePrevious = false,
  label,
  hint,
  error,
  previewShape = 'square',
  multiple = false,
  maxFiles = 10,
  onMultipleUploaded,
}) => {
  const inputId = useId();
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState('file');     // 'file' | 'url'
  const [dragOver, setDragOver] = useState(false);

  const { upload, uploadMany, isUploading, error: uploadError } = useImageUpload({
    kind,
    replacePrevious,
    onUploaded: ({ publicUrl }) => onChange?.(publicUrl),
  });

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;

    if (multiple) {
      const limited = files.slice(0, Math.max(0, maxFiles));
      if (limited.length === 0) return;
      try {
        const results = await uploadMany(limited);
        onMultipleUploaded?.(results.map((r) => r.publicUrl));
      } catch {
        // error 상태는 useImageUpload가 보유
      }
    } else {
      try {
        await upload(files[0]);
      } catch {
        // error 상태는 useImageUpload가 보유
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClear = () => {
    onChange?.('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const finalError = error ?? uploadError?.message;

  return (
    <div className={styles.field}>
      {label && (
        <div className={styles.headRow}>
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
          <button
            type="button"
            className={styles.modeToggle}
            onClick={() => setMode((m) => (m === 'file' ? 'url' : 'file'))}
          >
            {mode === 'file' ? (
              <>
                <LinkIcon size={12} /> URL로 입력
              </>
            ) : (
              <>
                <Upload size={12} /> 파일 업로드
              </>
            )}
          </button>
        </div>
      )}

      {mode === 'file' ? (
        <div
          className={clsx(
            styles.dropzone,
            styles[`shape-${previewShape}`],
            dragOver && styles.dropzoneDragOver,
            value && styles.dropzoneFilled
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !isUploading) {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="이미지 업로드"
        >
          {value ? (
            <>
              <img src={value} alt="미리보기" className={styles.preview} />
              {!isUploading && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  aria-label="이미지 제거"
                >
                  <X size={14} />
                </button>
              )}
            </>
          ) : (
            <div className={styles.placeholder}>
              <Upload size={20} />
              <p>{multiple ? '클릭 또는 드래그 (여러 장 가능)' : '클릭 또는 드래그해서 업로드'}</p>
              <p className={styles.placeholderHint}>
                JPG, PNG, WebP{multiple && maxFiles > 1 ? ` · 최대 ${maxFiles}장` : ''}
              </p>
            </div>
          )}

          {isUploading && (
            <div className={styles.uploadingOverlay}>
              <Loader2 size={20} className={styles.spinner} />
              <span>업로드 중...</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple={multiple}
            className={styles.fileInput}
            disabled={isUploading}
            onChange={(e) => {
              handleFiles(e.target.files);
              // input 값 초기화 → 같은 파일 다시 선택 가능
              e.target.value = '';
            }}
          />
        </div>
      ) : (
        <input
          id={inputId}
          type="url"
          className={clsx(styles.urlInput, finalError && styles.urlInputError)}
          placeholder="https://..."
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}

      {finalError && (
        <p className={styles.error} role="alert">
          {finalError}
        </p>
      )}
      {!finalError && hint && (
        <p className={styles.hint}>{hint}</p>
      )}
    </div>
  );
};

export default ImageUploadField;