// src/shared/lib/image/imageCompressor.js

/**
 * 이미지 파일을 리사이즈/압축한 Blob을 반환.
 *
 * @param {File} file
 * @param {{
 *   maxWidth?: number,
 *   maxHeight?: number,
 *   quality?: number,         // 0~1, JPEG 품질
 *   mimeType?: string,        // 출력 mime
 * }} options
 * @returns {Promise<Blob>}
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    mimeType = 'image/jpeg',
  } = options;

  // GIF는 애니메이션 보존을 위해 압축하지 않고 원본 그대로 반환
  if (file.type === 'image/gif') {
    return file;
  }

  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  // 비율 유지하며 리사이즈
  const { width, height } = fitInside(img.width, img.height, maxWidth, maxHeight);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context를 생성할 수 없습니다.');

  // 부드러운 다운샘플링
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('이미지 변환에 실패했어요.'));
      },
      mimeType,
      quality
    );
  });
};

/**
 * width × height을 max 안에 들어가도록 비율 유지 축소.
 * 이미 작으면 원본 크기 그대로 반환 (확대 안 함).
 */
const fitInside = (w, h, maxW, maxH) => {
  if (w <= maxW && h <= maxH) return { width: w, height: h };
  const ratio = Math.min(maxW / w, maxH / h);
  return {
    width: Math.round(w * ratio),
    height: Math.round(h * ratio),
  };
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('이미지를 불러올 수 없습니다.'));
    img.src = src;
  });

/**
 * 용도별 추천 압축 옵션.
 */
export const COMPRESSION_PRESETS = Object.freeze({
  avatar: { maxWidth: 512, maxHeight: 512, quality: 0.85, mimeType: 'image/jpeg' },
  cover:  { maxWidth: 1920, maxHeight: 1080, quality: 0.85, mimeType: 'image/jpeg' },
  post:   { maxWidth: 1920, maxHeight: 1920, quality: 0.85, mimeType: 'image/jpeg' },
  product:{ maxWidth: 1920, maxHeight: 1920, quality: 0.85, mimeType: 'image/jpeg' },
});