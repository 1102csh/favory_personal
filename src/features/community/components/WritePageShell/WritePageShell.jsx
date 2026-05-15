// src/features/community/components/WritePageShell/WritePageShell.jsx
import { ChevronLeft } from 'lucide-react';

import LegacyScope from '@/shared/ui/LegacyScope';
import { useResponsive } from '@/shared/hooks/useResponsive';
import SiteNav from '@/features/home/components/SiteNav';

import styles from './WritePageShell.module.scss';

/**
 * 글 작성/수정 페이지 공통 쉘.
 * 상단 sticky 헤더(돌아가기 + 타이틀) + 본문 슬롯.
 *
 * @param {object} props
 * @param {string} props.title             - 헤더 타이틀 ('새 글 작성' 등)
 * @param {() => void} props.onCancel      - 돌아가기 클릭
 * @param {string} [props.cancelLabel]     - 돌아가기 버튼 라벨
 * @param {React.ReactNode} props.children
 */
const WritePageShell = ({ title, onCancel, cancelLabel = '돌아가기', children }) => {
  const { isMobile } = useResponsive();

  return (
    <LegacyScope className={styles.page}>
      <SiteNav isMobile={isMobile} />

      <div className={styles.container}>
        <header className={styles.header}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.backLink}
          >
            <ChevronLeft size={16} /> {cancelLabel}
          </button>
          <h1 className={styles.title}>{title}</h1>
        </header>

        <div className={styles.formArea}>{children}</div>
      </div>
    </LegacyScope>
  );
};

export default WritePageShell;
