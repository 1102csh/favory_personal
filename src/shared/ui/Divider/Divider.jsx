// src/shared/ui/Divider/Divider.jsx
import styles from './Divider.module.scss';

const Divider = ({ children }) => (
  <div className={styles.divider} role="separator" aria-orientation="horizontal">
    {children && <span className={styles.label}>{children}</span>}
  </div>
);

export default Divider;