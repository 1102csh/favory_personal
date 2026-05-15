// src/features/auth/pages/CompleteProfilePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/shared/ui/AuthLayout/AuthLayout';
import CompleteProfileForm from '../components/CompleteProfileForm/CompleteProfileForm';
import AgreementModal from '../components/AgreementModal/AgreementModal';
import { useAuth } from '@/app/providers/AuthProvider';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [openAgreement, setOpenAgreement] = useState(null);

  if (!user) return null; // ProtectedRoute가 처리하지만 방어

  const handleSuccess = async () => {
    await refreshProfile();
    navigate('/', { replace: true });
  };

  return (
    <AuthLayout
      title="가입 정보 입력"
      subtitle="서비스 이용을 위해 몇 가지 정보가 더 필요합니다."
    >
      <CompleteProfileForm
        userId={user.id}
        onSuccess={handleSuccess}
        onViewAgreement={(key) => setOpenAgreement(key)}
      />
      <AgreementModal openKey={openAgreement} onClose={() => setOpenAgreement(null)} />
    </AuthLayout>
  );
};

export default CompleteProfilePage;