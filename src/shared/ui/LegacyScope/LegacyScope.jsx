// src/shared/ui/LegacyScope/LegacyScope.jsx
import clsx from 'clsx';

/**
 * 원본 FAVORY-sub의 CSS 변수(--brand, --charcoal 등)와 클래스(.card, .nav-item 등)가
 * 활성화되는 스코프 래퍼.
 *
 * 사용:
 *   <LegacyScope>
 *     <SiteNav />
 *     <FeaturedBanner />
 *   </LegacyScope>
 *
 * 추후 디자인 시스템으로 점진 이전 시, 이 래퍼를 제거하는 것이 곧 "레거시 제거"가 됩니다.
 *
 * @param {object} props
 * @param {React.ElementType} [props.as='div']  - 마크업 태그
 * @param {string} [props.className]            - 추가 클래스
 * @param {React.CSSProperties} [props.style]
 * @param {React.ReactNode} props.children
 */
const LegacyScope = ({ as: Tag = 'div', className, style, children, ...rest }) => {
  return (
    <Tag className={clsx('legacy-scope', className)} style={style} {...rest}>
      {children}
    </Tag>
  );
};

export default LegacyScope;