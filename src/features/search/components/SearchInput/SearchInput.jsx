// src/features/search/components/SearchInput/SearchInput.jsx
import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchInput.module.scss';

/**
 * 검색 입력창. SiteNav와 SearchPage 양쪽에서 재사용.
 *
 * @param {object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {(e: Event) => void} props.onSubmit
 * @param {string} [props.placeholder]
 * @param {boolean} [props.autoFocus]
 * @param {'lg'|'sm'} [props.size='lg']
 */
const SearchInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = '검색어를 입력하세요',
  autoFocus = false,
  size = 'lg',
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleClear = () => {
    onChange?.('');
    inputRef.current?.focus();
  };

  return (
    <form
      className={`${styles.form} ${styles[`size-${size}`]}`}
      onSubmit={onSubmit}
      role="search"
    >
      <Search size={size === 'lg' ? 20 : 16} className={styles.icon} aria-hidden />
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label="검색"
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={handleClear}
          aria-label="입력 지우기"
        >
          <X size={size === 'lg' ? 18 : 14} />
        </button>
      )}
    </form>
  );
};

export default SearchInput;