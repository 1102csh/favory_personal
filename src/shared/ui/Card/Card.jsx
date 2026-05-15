// src/shared/ui/Card/Card.jsx
import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Card.module.scss';

/**
 * 디자인 시스템 Card.
 *
 * @param {object} props
 * @param {'default'|'soft'|'elevated'|'outline'} [props.variant='default']
 * @param {'sm'|'md'|'lg'} [props.padding='md']
 * @param {boolean} [props.interactive] - hover 효과 활성화 (클릭 가능한 카드)
 * @param {React.ElementType} [props.as='div']
 */
const Card = forwardRef(
  (
    {
      variant = 'default',
      padding = 'md',
      interactive = false,
      as: Tag = 'div',
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <Tag
        ref={ref}
        className={clsx(
          styles.card,
          styles[`variant-${variant}`],
          styles[`padding-${padding}`],
          interactive && styles.interactive,
          className
        )}
        {...rest}
      >
        {children}
      </Tag>
    );
  }
);

Card.displayName = 'Card';
export default Card;