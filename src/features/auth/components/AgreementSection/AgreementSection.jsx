// src/features/auth/components/AgreementSection/AgreementSection.jsx
import { useMemo } from 'react';
import Checkbox from '@/shared/ui/Checkbox/Checkbox';
import styles from './AgreementSection.module.scss';

/**
 * 약관 동의 섹션.
 *
 * 약관 정의는 props로 주입받지 않고 내부 상수로 보유하되,
 * 추후 다국어/약관 버전 관리가 필요해지면 외부에서 주입받는 형태로 리팩토링 가능.
 *
 * RHF의 watch + setValue를 받아 "전체 동의" 토글을 구현합니다.
 *
 * @param {object} props
 * @param {object} props.values   - { agreedTerms, agreedPrivacy, agreedAge, agreedMarketing }
 * @param {object} props.errors   - 각 필드 에러 메시지
 * @param {function} props.setValue - RHF의 setValue
 * @param {function} props.register - RHF의 register
 * @param {function} [props.onView]  - 약관 본문 보기 버튼 클릭 시 (key) => void
 */
const AgreementSection = ({ values, errors, setValue, register, onView }) => {
  const items = useMemo(
    () => [
      { key: 'agreedAge',       label: '만 14세 이상입니다',          required: true,  viewable: false },
      { key: 'agreedTerms',     label: '서비스 이용약관 동의',         required: true,  viewable: true  },
      { key: 'agreedPrivacy',   label: '개인정보 처리방침 동의',       required: true,  viewable: true  },
      { key: 'agreedMarketing', label: '마케팅 정보 수신 동의',        required: false, viewable: true  },
    ],
    []
  );

  const allChecked = items.every((it) => !!values[it.key]);
  const requiredChecked = items
    .filter((it) => it.required)
    .every((it) => !!values[it.key]);

  const handleToggleAll = (e) => {
    const next = e.target.checked;
    items.forEach((it) => {
      setValue(it.key, next, { shouldValidate: true, shouldDirty: true });
    });
  };

  return (
    <fieldset className={styles.wrapper}>
      <legend className={styles.legend}>약관 동의</legend>

      <div className={styles.allRow}>
        <Checkbox
          checked={allChecked}
          onChange={handleToggleAll}
          label={<strong>전체 동의</strong>}
        />
      </div>

      <div className={styles.divider} />

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.key} className={styles.item}>
            <Checkbox
              required={item.required}
              error={errors[item.key]?.message}
              {...register(item.key)}
              label={
                <>
                  <span className={styles.itemLabel}>
                    {item.required ? '[필수] ' : '[선택] '}
                    {item.label}
                  </span>
                </>
              }
            />
            {item.viewable && (
              <button
                type="button"
                className={styles.viewBtn}
                onClick={() => onView?.(item.key)}
                aria-label={`${item.label} 자세히 보기`}
              >
                보기
              </button>
            )}
          </li>
        ))}
      </ul>

      {!requiredChecked && (
        <p className={styles.hint}>필수 항목에 모두 동의해야 가입할 수 있습니다.</p>
      )}
    </fieldset>
  );
};

export default AgreementSection;