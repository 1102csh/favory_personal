// src/features/profile/components/TagInput/TagInput.jsx
import { useState, useId } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { isValidTag, normalizeTags } from '../../lib/tagUtils';
import styles from './TagInput.module.scss';

/**
 * 태그 입력 컴포넌트.
 *
 * - Enter, Tab, 쉼표(,) 입력 시 태그 추가
 * - 빈 입력 상태에서 Backspace 누르면 마지막 태그 삭제
 * - 칩의 X 버튼으로 개별 삭제
 *
 * @param {object} props
 * @param {string[]} props.value
 * @param {(next: string[]) => void} props.onChange
 * @param {string} [props.label]
 * @param {string} [props.placeholder]
 * @param {string} [props.error]
 * @param {string} [props.hint]
 * @param {number} [props.max=10]
 */
const TagInput = ({
  value = [],
  onChange,
  label,
  placeholder = '태그 입력 후 Enter',
  error,
  hint,
  max = 10,
}) => {
  const [draft, setDraft] = useState('');
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const addTag = (raw) => {
    const trimmed = raw.replace(/^#+/, '').trim();
    if (!trimmed) return;
    if (!isValidTag(trimmed)) return;
    if (value.length >= max) return;
    if (value.includes(trimmed)) return;

    onChange?.(normalizeTags([...value, trimmed]));
    setDraft('');
  };

  const removeTag = (tag) => {
    onChange?.(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      if (draft.trim()) {
        e.preventDefault();
        addTag(draft);
      }
      return;
    }
    if (e.key === 'Backspace' && !draft && value.length > 0) {
      // 빈 입력에서 백스페이스 → 마지막 태그 삭제
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={clsx(styles.box, error && styles.boxError)}
        onClick={() => document.getElementById(inputId)?.focus()}
      >
        {value.map((tag) => (
          <span key={tag} className={styles.chip}>
            #{tag}
            <button
              type="button"
              className={styles.removeBtn}
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              aria-label={`${tag} 태그 삭제`}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <input
          id={inputId}
          type="text"
          className={styles.input}
          value={draft}
          placeholder={value.length === 0 ? placeholder : ''}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => draft.trim() && addTag(draft)}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') ||
            undefined
          }
        />
      </div>

      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <p className={styles.counter}>
        {value.length} / {max}
      </p>
    </div>
  );
};

export default TagInput;