// src/features/products/pages/ProductDetailPage.jsx
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import LegacyScope from '@/shared/ui/LegacyScope';
import { useResponsive } from '@/shared/hooks/useResponsive';
import SiteNav from '@/features/home/components/SiteNav';

import ProductGallery from '../components/ProductGallery';
import ProductInfoPanel from '../components/ProductInfoPanel';
import ProductDescription from '../components/ProductDescription';
import ArtistIntro from '../components/ArtistIntro';

import { useProduct } from '../hooks/useProduct';
import { PRODUCT_ERROR_CODES } from '../constants/productConstants';
import styles from './ProductDetailPage.module.scss';

/**
 * 상품 상세 페이지.
 *
 * 데이터: useProduct(productId) — 내부적으로 productService → productRepository (현재 mock)
 * 추후 실제 백엔드 연동 시 repository 본체만 교체하면 됨.
 */
export default function ProductDetailPage() {
  const { id } = useParams();
  const { product, isLoading, error, reload } = useProduct(id);

  if (isLoading) {
    return (
      <PageShell>
        <ProductDetailSkeleton />
      </PageShell>
    );
  }

  if (error) {
    const isNotFound = error.code === PRODUCT_ERROR_CODES.NOT_FOUND;
    return (
      <PageShell>
        <ErrorState
          message={error.message}
          variant={isNotFound ? 'notFound' : 'error'}
          onRetry={isNotFound ? null : reload}
        />
      </PageShell>
    );
  }

  if (!product) {
    return (
      <PageShell>
        <ErrorState message="상품을 찾을 수 없습니다." variant="notFound" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Breadcrumb productName={product.name} artistName={product.artist.name} />
      <Content product={product} />
    </PageShell>
  );
}

// ============ Page shell ============
// 페이지 상단 nav + container 레이아웃만 공유. 본문은 children.
function PageShell({ children }) {
  const { isMobile } = useResponsive();
  return (
    <LegacyScope className={styles.page}>
      <SiteNav isMobile={isMobile} />
      <div className={styles.container}>{children}</div>
    </LegacyScope>
  );
}

// ============ Main content (정상 로드) ============
function Content({ product }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [followed, setFollowed] = useState(false);

  const currentVariant =
    product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  return (
    <>
      <div className={styles.main}>
        <ProductGallery
          mainImage={currentVariant.image}
          mainAlt={`${product.name} — ${currentVariant.label}`}
          variants={product.variants}
          activeId={currentVariant.id}
          onSelect={setVariantId}
        />

        <ProductInfoPanel
          product={product}
          currentVariant={currentVariant}
          liked={liked}
          saved={saved}
          followed={followed}
          onToggleLike={() => setLiked((v) => !v)}
          onToggleSave={() => setSaved((v) => !v)}
          onToggleFollow={() => setFollowed((v) => !v)}
        />
      </div>

      <div className={styles.lowerSections}>
        <ProductDescription description={product.description} />
        <ArtistIntro artist={product.artist} />
      </div>
    </>
  );
}

// ============ Breadcrumb ============
function Breadcrumb({ productName, artistName }) {
  return (
    <nav className={styles.breadcrumb} aria-label="breadcrumb">
      <Link to="/" className={styles.crumb}>작가 탐색</Link>
      <span className={styles.crumbSep}>/</span>
      <span className={styles.crumb}>{artistName}</span>
      <span className={styles.crumbSep}>/</span>
      <span className={styles.crumbCurrent}>{productName.split(' — ')[0]}</span>
    </nav>
  );
}

// ============ Error / NotFound 상태 ============
function ErrorState({ message, variant, onRetry }) {
  const navigate = useNavigate();
  const isNotFound = variant === 'notFound';

  return (
    <div className={styles.errorState} role="alert">
      <p className={styles.errorEyebrow}>
        {isNotFound ? '404' : 'ERROR'}
      </p>
      <h1 className={styles.errorTitle}>
        {isNotFound ? '상품을 찾을 수 없어요' : '문제가 발생했어요'}
      </h1>
      <p className={styles.errorMessage}>{message}</p>

      <div className={styles.errorActions}>
        <button
          type="button"
          className={styles.errorBtnGhost}
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={16} /> 이전으로
        </button>
        {onRetry ? (
          <button
            type="button"
            className={styles.errorBtnPrimary}
            onClick={onRetry}
          >
            다시 시도
          </button>
        ) : (
          <Link to="/" className={styles.errorBtnPrimary}>
            홈으로
          </Link>
        )}
      </div>
    </div>
  );
}

// ============ Loading skeleton — 메인 레이아웃과 동일 그리드 ============
function ProductDetailSkeleton() {
  return (
    <div aria-hidden="true">
      <div className={styles.skBreadcrumb} />
      <div className={styles.main}>
        <div className={styles.skGallery}>
          <div className={styles.skMainImage} />
          <div className={styles.skThumbList}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.skThumb} />
            ))}
          </div>
        </div>
        <div className={styles.skInfo}>
          <div className={styles.skArtistRow}>
            <div className={styles.skAvatar} />
            <div className={styles.skArtistMeta}>
              <div className={styles.skLineSm} />
              <div className={styles.skLineXs} />
            </div>
          </div>
          <div className={styles.skTitle} />
          <div className={styles.skPrice} />
          <div className={styles.skBox} />
          <div className={styles.skBoxTall} />
          <div className={styles.skActions} />
        </div>
      </div>
    </div>
  );
}
