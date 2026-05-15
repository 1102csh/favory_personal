import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/shared/api/supabaseClient';
import { ArrowLeft, Lock, Loader2 } from 'lucide-react';
import LegacyScope from '@/shared/ui/LegacyScope/LegacyScope';
import { useResponsive } from '@/shared/hooks/useResponsive';
import SiteNav from '../components/SiteNav/SiteNav';
import styles from './SettingsPage.module.scss'; // 설정 페이지 스타일 공유

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. 유효성 검사
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setLoading(true);
      
      // 2. Supabase 비밀번호 업데이트 (로그인된 세션 기반)
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      // 3. 성공 시 처리
      alert('비밀번호가 성공적으로 변경되었습니다!');
      navigate('/settings', { replace: true }); 
      
    } catch (err) {
      console.error('Password update error:', err);
      setError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LegacyScope style={{ minHeight: '100vh', background: 'var(--bg-gray, #F8F9FA)' }}>
      <SiteNav isMobile={isMobile} />
      
      <div 
        className={styles.container} 
        style={{ paddingTop: isMobile ? '20px' : '40px', paddingBottom: '100px', maxWidth: '500px', margin: '0 auto' }}
      >
        <header className={styles.pageHeader} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button 
            onClick={() => navigate('/settings')} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
          >
            <ArrowLeft size={24} color="#2C2018" />
          </button>
          <h2 style={{ margin: 0, fontSize: '22px', color: '#2C2018' }}>비밀번호 변경</h2>
        </header>

        <section className={styles.settingGroup}>
          <div className={styles.card} style={{ padding: '24px' }}>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#444' }}>새 비밀번호</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#888" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="새 비밀번호 (6자 이상)"
                    style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#444' }}>새 비밀번호 확인</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#888" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="새 비밀번호 다시 입력"
                    style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
                    required
                  />
                </div>
              </div>

              {error && <p style={{ color: '#EF4444', fontSize: '13px', margin: 0 }}>{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  marginTop: '10px', width: '100%', padding: '14px', borderRadius: '10px', 
                  background: '#2C2018', color: 'white', border: 'none', fontWeight: 'bold', 
                  fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                }}
              >
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : '비밀번호 변경하기'}
              </button>
            </form>

          </div>
        </section>
      </div>
    </LegacyScope>
  );
}