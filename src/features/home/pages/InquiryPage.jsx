import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/shared/api/supabaseClient';
import { useAuth } from '@/app/providers/AuthProvider';
import { ArrowLeft, HelpCircle, PenSquare, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import LegacyScope from '@/shared/ui/LegacyScope/LegacyScope';
import { useResponsive } from '@/shared/hooks/useResponsive';
import SiteNav from '../components/SiteNav/SiteNav';

export default function InquiryPage() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const { user, profile } = useAuth();
  
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // 작성용 상태
  const [newInquiry, setNewInquiry] = useState({ type: '이용안내', title: '', content: '' });

  const fetchMyInquiries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setInquiries(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyInquiries(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('inquiries').insert([{
        user_id: user.id,
        user_email: user.email,
        user_nickname: profile?.nickname || '고객',
        ...newInquiry
      }]);
      if (error) throw error;
      alert('문의가 접수되었습니다.');
      setIsModalOpen(false);
      setNewInquiry({ type: '이용안내', title: '', content: '' });
      fetchMyInquiries();
    } catch (err) {
      alert('접수 실패');
    }
  };

  return (
    <LegacyScope style={{ minHeight: '100vh', background: '#F8F9FA' }}>
      <SiteNav isMobile={isMobile} />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '20px 16px' : '40px 24px', paddingBottom: '100px' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none' }}><ArrowLeft size={24} /></button>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>1:1 문의 내역</h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ background: '#2C2018', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <PenSquare size={14} /> 문의하기
          </button>
        </header>

        {loading ? (
          <div style={{textAlign:'center', padding:'50px'}}><Loader2 className="spinner" style={{animation:'spin 1s linear infinite', margin:'0 auto'}} /></div>
        ) : inquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
            <HelpCircle size={48} color="#ddd" style={{ margin: '0 auto 16px' }} />
            <p>접수된 문의 내역이 없습니다.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {inquiries.map((item) => (
              <div key={item.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
                <div 
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  style={{ padding: '20px 16px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#888' }}>{item.type}</span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: item.status === '답변완료' ? '#2E7D32' : '#E65100' }}>{item.status}</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>{item.title}</h4>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{ fontSize: '12px', color: '#aaa' }}>{new Date(item.created_at).toLocaleDateString()}</span>
                    {expandedId === item.id ? <ChevronUp size={18} color="#aaa"/> : <ChevronDown size={18} color="#aaa"/>}
                  </div>
                </div>
                
                {expandedId === item.id && (
                  <div style={{ padding: '20px 16px', background: '#fcfcfc', borderTop: '1px solid #eee' }}>
                    <div style={{marginBottom:'20px'}}>
                      <p style={{fontSize:'11px', color:'#D4A373', fontWeight:'bold', marginBottom:'5px'}}>Q. 문의내용</p>
                      <p style={{fontSize:'14px', lineHeight:1.6, whiteSpace:'pre-wrap'}}>{item.content}</p>
                    </div>
                    {item.answer && (
                      <div style={{padding:'15px', background:'#f0f0f0', borderRadius:'8px'}}>
                        <p style={{fontSize:'11px', color:'#2C2018', fontWeight:'bold', marginBottom:'5px'}}>A. 관리자 답변 ({new Date(item.answered_at).toLocaleDateString()})</p>
                        <p style={{fontSize:'14px', lineHeight:1.6, whiteSpace:'pre-wrap'}}>{item.answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🌟 문의 작성 모달 */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '500px', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>1:1 문의하기</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none' }}><X /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <select 
                value={newInquiry.type} 
                onChange={e => setNewInquiry({...newInquiry, type: e.target.value})}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option value="이용안내">이용안내</option>
                {/*<option value="주문/결제">주문/결제</option>*/}
                <option value="작가입점">작가입점</option>
                <option value="기타">기타</option>
              </select>
              <input 
                type="text" placeholder="제목을 입력하세요" required 
                value={newInquiry.title} onChange={e => setNewInquiry({...newInquiry, title: e.target.value})}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
              <textarea 
                placeholder="내용을 입력하세요" required rows="6"
                value={newInquiry.content} onChange={e => setNewInquiry({...newInquiry, content: e.target.value})}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', resize: 'none' }}
              />
              <button type="submit" style={{ background: '#2C2018', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}>문의 접수하기</button>
            </form>
          </div>
        </div>
      )}
    </LegacyScope>
  );
}