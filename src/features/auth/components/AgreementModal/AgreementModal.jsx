// src/features/auth/components/AgreementModal/AgreementModal.jsx
import Modal from '@/shared/ui/Modal/Modal';
import Button from '@/shared/ui/Button/Button';
import { AGREEMENTS } from '../../constants/agreements';
import styles from './AgreementModal.module.scss';

/**
 * 약관 본문 표시 모달.
 *
 * @param {object} props
 * @param {string|null} props.openKey  - 'agreedTerms' | 'agreedPrivacy' | 'agreedMarketing' | null
 * @param {() => void} props.onClose
 */
const AgreementModal = ({ openKey, onClose }) => {
  const agreement = openKey ? AGREEMENTS[openKey] : null;

  return (
    <Modal
      open={!!agreement}
      onClose={onClose}
      title={agreement?.title}
      footer={
        <Button variant="primary" onClick={onClose}>
          확인
        </Button>
      }
    >
      {agreement && (
        <>
          <p className={styles.version}>버전 {agreement.version}</p>
          <pre className={styles.content}>{agreement.content}</pre>
        </>
      )}
    </Modal>
  );
};

export default AgreementModal;