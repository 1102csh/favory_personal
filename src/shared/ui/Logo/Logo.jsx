// src/shared/ui/Logo/Logo.jsx
import logoSrc from '@/assets/LOGO.png';
import styles from './Logo.module.scss';

/**
 * 로고 컴포넌트.
 * variant로 향후 SVG/투명 버전 등 교체 가능하게 설계.
 *
 * @param {object} props
 * @param {'default'|'compact'} [props.variant='default']
 * @param {number} [props.width=180]
 * @param {string} [props.alt='Workshop']
 */
const Logo = ({ variant = 'default', width = 180, alt = 'Workshop' }) => {
  return (
    <div className={styles.wrapper} data-variant={variant}>
      <img src={logoSrc} alt={alt} width={width} className={styles.image} />
    </div>
  );
};

export default Logo;