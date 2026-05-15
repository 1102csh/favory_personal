import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/shared/api/supabaseClient';
import { ArrowLeft, Megaphone, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import LegacyScope from '@/shared/ui/LegacyScope/LegacyScope';
import { useResponsive } from '@/shared/hooks/useResponsive';
import SiteNav from '../components/SiteNav/SiteNav';

export default function NoticePage() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // 🌟 DB에서 공지사항 가져오기
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notices')
          .select('*')
          .eq('is_active', true) // 노출 상태인 것만
          .order('priority', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotices(data || []);
      } catch (err) {
        console.error('Notice Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const toggleNotice = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <LegacyScope style={{ minHeight: '100vh', background: '#F8F9FA' }}>
      <SiteNav isMobile={isMobile} />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '20px 16px' : '40px 24px', paddingBottom: '100px' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={24} color="#2C2018" />
          </button>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#2C2018' }}>공지사항</h2>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}><Loader2 className="spinner" size={32} style={{animation:'spin 1s linear infinite', margin:'0 auto'}} /></div>
        ) : notices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
            <Megaphone size={48} color="#ddd" style={{ margin: '0 auto 16px' }} />
            <p>등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notices.map((notice) => (
              <div key={notice.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
                <div 
                  onClick={() => toggleNotice(notice.id)}
                  style={{ padding: '20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: expandedId === notice.id ? '#FDFAF6' : '#fff' }}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#2C2018' }}>{notice.title}</h4>
                    <span style={{ fontSize: '12px', color: '#888' }}>{new Date(notice.created_at).toLocaleDateString()}</span>
                  </div>
                  {expandedId === notice.id ? <ChevronUp size={20} color="#888" /> : <ChevronDown size={20} color="#888" />}
                </div>

                {expandedId === notice.id && (
                  <div style={{ padding: '20px 16px', fontSize: '14px', color: '#444', lineHeight: 1.6, borderTop: '1px solid #eee', whiteSpace: 'pre-wrap' }}>
                    {notice.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </LegacyScope>
  );
}