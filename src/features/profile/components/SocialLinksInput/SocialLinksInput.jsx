// src/features/profile/components/SocialLinksInput/SocialLinksInput.jsx
import { useId } from 'react';
import {
  SOCIAL_PLATFORMS,
  SOCIAL_PLATFORM_KEYS,
  normalizeSocialUrl,
} from '../../constants/socialPlatforms';
import styles from './SocialLinksInput.module.scss';

/**
 * 소셜 링크 일괄 입력.
 *
 * @param {object} props
 * @param {Record<string, string>} props.value
 * @param {(next: Record<string, string>) => void} props.onChange
 * @param {Record<string, string>} [props.errors]
 */
const SocialLinksInput = ({ value = {}, onChange, errors = {} }) => {
  const baseId = useId();

  const handleChange = (key, raw) => {
    onChange?.({ ...value, [key]: raw });
  };

  const handleBlur = (key) => {
    const raw = value[key];
    if (!raw) return;
    const normalized = normalizeSocialUrl(key, raw);
    if (normalized !== raw) {
      onChange?.({ ...value, [key]: normalized });
    }
  };

  return (
    <div className={styles.list}>
      {SOCIAL_PLATFORM_KEYS.map((key) => {
        const platform = SOCIAL_PLATFORMS[key];
        const Icon = platform.icon;
        const id = `${baseId}-${key}`;
        const error = errors[key];

        return (
          <div key={key} className={styles.row}>
            <label htmlFor={id} className={styles.iconWrap} aria-label={platform.label}>
              <Icon size={18} color={platform.color} />
            </label>

            <div className={styles.inputWrap}>
              <input
                id={id}
                type="text"
                className={styles.input}
                value={value[key] ?? ''}
                placeholder={platform.placeholder}
                onChange={(e) => handleChange(key, e.target.value)}
                onBlur={() => handleBlur(key)}
                aria-invalid={!!error}
                autoComplete="off"
                spellCheck={false}
              />
              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SocialLinksInput;