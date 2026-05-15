// src/shared/ui/Alert/Alert.jsx
import clsx from 'clsx';
import styles from './Alert.module.scss';

/**
 * 인라인 알림.
 * @param {object} props
 * @param {'info'|'success'|'warning'|'danger'} [props.tone='info']
 * @param {React.ReactNode} props.children
 */
const Alert = ({ tone = 'info', children, className }) => (
  <div className={clsx(styles.alert, styles[`tone-${tone}`], className)} role="alert">
    {children}
  </div>
);

export default Alert;