import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Lock, Bell, FileText, Shield, Info, LogOut, Trash2, ChevronRight, X,
  Sun, Moon, Monitor, Palette
} from 'lucide-react';
import LegacyScope from '@/shared/ui/LegacyScope/LegacyScope';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { useThemePreference } from '@/shared/hooks/useThemePreference';
import { THEME_PREFERENCES } from '@/shared/lib/theme/themePreference';
import SiteNav from '../components/SiteNav/SiteNav';
import { useAuth } from '@/app/providers/AuthProvider';
import { supabase } from '@/shared/api/supabaseClient';
import styles from './SettingsPage.module.scss';

// SettingsPage 전용 변수 — 라이트 기본값 + 다크 오버라이드.
// :root에 직접 박지 않고 .legacy-scope[data-theme]를 통해 분기.
const SETTINGS_THEME = `
  :root, [data-theme='light'] {
    --brand-gold: #D4A373;
    --bg-gray: #F8F9FA;
    --danger-red: #EF4444;
  }
  [data-theme='dark'] {
    --brand-gold: #DEB389;
    --bg-gray: #131110;
    --danger-red: #F2A0A0;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme]) {
      --brand-gold: #DEB389;
      --bg-gray: #131110;
      --danger-red: #F2A0A0;
    }
  }
`;

// ✨ 약관 더미 텍스트 (실제 서비스 시 내용 수정 필요)
const TERMS_TEXT = `제 1 조 (목적)
본 약관은 FAVORY(이하 "회사")가 제공하는 핸드메이드 마켓 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.

제 2 조 (용어의 정의)
1. "서비스"란 구현되는 단말기(PC, TV, 휴대형단말기 등의 각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수 있는 FAVORY 관련 제반 서비스를 의미합니다.
2. "회원"이란 회사의 "서비스"에 접속하여 이 약관에 따라 "회사"와 이용계약을 체결하고 "회사"가 제공하는 "서비스"를 이용하는 고객을 말합니다.
3. "작가"란 "회사"의 심사를 거쳐 상품을 등록하고 판매할 수 있는 자격을 부여받은 "회원"을 말합니다.

제 3 조 (약관의 게시와 개정)
1. "회사"는 이 약관의 내용을 "회원"이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
2. "회사"는 "약관의 규제에 관한 법률", "정보통신망 이용촉진 및 정보보호 등에 관한 법률" 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.

제 4 조 (서비스의 제공 등)
"회사"는 회원에게 아래와 같은 서비스를 제공합니다.
1. 전자상거래 플랫폼 개발 및 운영서비스
2. 상품 판매 관련 지원 서비스
3. 기타 "회사"가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 "회원"에게 제공하는 일체의 서비스`;

const PRIVACY_TEXT = `1. 개인정보의 수집 및 이용 목적
회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
- 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산
- 회원 관리: 본인 확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 연령확인, 불만처리 등 민원처리, 고지사항 전달
- 마케팅 및 광고에 활용: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여 기회 제공

2. 수집하는 개인정보 항목
- 필수항목: 이메일, 비밀번호, 닉네임, 이름, 연락처
- 선택항목: 프로필 이미지, 배송지 주소, 환불 계좌 정보
- 자동수집항목: 서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보

3. 개인정보의 보유 및 이용기간
원칙적으로, 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
- 계약 또는 청약철회 등에 관한 기록: 5년
- 대금결제 및 재화 등의 공급에 관한 기록: 5년
- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년`;

const ToggleSwitch = ({ checked, onChange }) => (
  <label className={styles.toggleSwitch}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className={styles.slider}></span>
  </label>
);

const THEME_OPTIONS = [
  { value: THEME_PREFERENCES.LIGHT, label: '밝게', icon: Sun },
  { value: THEME_PREFERENCES.DARK, label: '어둡게', icon: Moon },
  { value: THEME_PREFERENCES.SYSTEM, label: '시스템', icon: Monitor },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const { signOut } = useAuth();
  const { preference, setPreference } = useThemePreference();

  const [notifications, setNotifications] = useState({ marketing: false });

  // 🌟 모달 상태 관리 ('terms', 'privacy', 또는 null)
  const [activeModal, setActiveModal] = useState(null);

  const handleToggle = (key) => setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  const handleEditProfile = () => navigate('/settings/profile'); 
  const handleChangePassword = () => navigate('/settings/password'); 

  const handleLogout = async () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      try {
        await signOut();
        navigate('/login', { replace: true });
      } catch (err) {
        alert("로그아웃 중 문제가 발생했습니다.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("정말 회원탈퇴를 진행하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.")) {
      try {
        alert("회원탈퇴가 성공적으로 처리되었습니다.");
        await signOut();
        navigate('/', { replace: true });
      } catch (err) {
        alert("탈퇴 처리 중 문제가 발생했습니다. 관리자에게 문의해주세요.");
      }
    }
  };

  return (
    <LegacyScope style={{ minHeight: '100vh', background: 'var(--bg-gray)' }}>
      <style>{SETTINGS_THEME}</style>
      <SiteNav isMobile={isMobile} />
      
      <div className={styles.container} style={{ paddingTop: isMobile ? '20px' : '40px', paddingBottom: '100px' }}>
        <header className={styles.pageHeader}>
          <h2>설정</h2>
        </header>

        <section className={styles.settingGroup}>
          <h3 className={styles.groupTitle}>내 계정</h3>
          <div className={styles.card}>
            <button className={styles.listItem} onClick={handleEditProfile}>
              <User size={20} className={styles.icon} />
              <span className={styles.label}>회원 정보 수정</span>
              <ChevronRight size={20} className={styles.arrow} />
            </button>
            <button className={styles.listItem} onClick={handleChangePassword}>
              <Lock size={20} className={styles.icon} />
              <span className={styles.label}>비밀번호 변경</span>
              <ChevronRight size={20} className={styles.arrow} />
            </button>
          </div>
        </section>

        <section className={styles.settingGroup}>
          <h3 className={styles.groupTitle}>화면</h3>
          <div className={styles.card}>
            <div className={styles.listItem}>
              <Palette size={20} className={styles.icon} />
              <div className={styles.textWrap}>
                <span className={styles.label}>테마</span>
                <span className={styles.desc}>밝은 화면·어두운 화면 또는 시스템 설정을 따릅니다.</span>
              </div>
            </div>
            <div className={styles.themeToggle} role="radiogroup" aria-label="테마 선택">
              {THEME_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const selected = preference === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`${styles.themeOption} ${selected ? styles.themeOptionSelected : ''}`}
                    onClick={() => setPreference(opt.value)}
                  >
                    <Icon size={16} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.settingGroup}>
          <h3 className={styles.groupTitle}>알림 설정</h3>
          <div className={styles.card}>
            <div className={styles.listItem}>
              <Bell size={20} className={styles.icon} />
              <div className={styles.textWrap}>
                <span className={styles.label}>마케팅 혜택 알림</span>
                <span className={styles.desc}>할인 쿠폰, 이벤트, 신규 클래스 소식</span>
              </div>
              <ToggleSwitch checked={notifications.marketing} onChange={() => handleToggle('marketing')} />
            </div>
          </div>
        </section>

        <section className={styles.settingGroup}>
          <h3 className={styles.groupTitle}>서비스 정보</h3>
          <div className={styles.card}>
            {/* ✨ 클릭 시 모달 열기 */}
            <button className={styles.listItem} onClick={() => setActiveModal('terms')}>
              <FileText size={20} className={styles.icon} />
              <span className={styles.label}>이용약관</span>
              <ChevronRight size={20} className={styles.arrow} />
            </button>
            {/* ✨ 클릭 시 모달 열기 */}
            <button className={styles.listItem} onClick={() => setActiveModal('privacy')}>
              <Shield size={20} className={styles.icon} />
              <span className={styles.label}>개인정보 처리방침</span>
              <ChevronRight size={20} className={styles.arrow} />
            </button>
            <div className={styles.listItem}>
              <Info size={20} className={styles.icon} />
              <span className={styles.label}>앱 버전</span>
              <span className={styles.versionText}>v1.0.2 (최신버전)</span>
            </div>
          </div>
        </section>

        <section className={styles.dangerZone}>
          <button className={styles.textBtn} onClick={handleLogout}><LogOut size={16} /> 로그아웃</button>
          <span className={styles.divider}>|</span>
          <button className={`${styles.textBtn} ${styles.deleteBtn}`} onClick={handleDeleteAccount}><Trash2 size={16} /> 회원탈퇴</button>
        </section>
      </div>

      {/* 🌟 약관 및 정책 모달 (activeModal 상태에 따라 표시) */}
      {activeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#fff', width: '100%', maxWidth: '500px', maxHeight: '80vh',
            borderRadius: '16px', display: 'flex', flexDirection: 'column',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)', overflow: 'hidden'
          }}>
            {/* 모달 헤더 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#2C2018' }}>
                {activeModal === 'terms' ? '이용약관' : '개인정보 처리방침'}
              </h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <X size={24} color="#888" />
              </button>
            </div>
            
            {/* 모달 내용 (스크롤 가능 영역) */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1, fontSize: '14px', lineHeight: '1.6', color: '#444', whiteSpace: 'pre-wrap' }}>
              {activeModal === 'terms' ? TERMS_TEXT : PRIVACY_TEXT}
            </div>
            
            {/* 모달 하단 버튼 */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #eee' }}>
              <button onClick={() => setActiveModal(null)} style={{ width: '100%', padding: '14px', background: '#2C2018', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

    </LegacyScope>
  );
}