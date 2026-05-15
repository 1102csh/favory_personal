import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/shared/api/supabaseClient'; 
import { 
  LayoutDashboard, Image as ImageIcon, Users, CheckSquare, 
  Settings, LogOut, Plus, Trash2, Edit2, X, ArrowLeft, Loader2, 
  Megaphone, MessageSquare, BookOpen, ExternalLink 
} from 'lucide-react';

// ✨ 매거진 관리용 커스텀 훅 및 서비스 추가
import { useAdminMagazines } from '../hooks/useAdminMagazines';
import { postService } from '@/features/community/services/postService';

import styles from './AdminPage.module.scss';

// =====================================================================
// 🌟 [하위 컴포넌트] 매거진 관리 탭 전용 컴포넌트
// 커스텀 훅(useAdminMagazines)을 탭 클릭 시에만 안전하게 호출하기 위해 분리했습니다.
// =====================================================================
const MagazineTabContent = () => {
  const navigate = useNavigate();
  const { magazines, isLoading, error, reload, removeOptimistic } = useAdminMagazines();

  const handleDelete = async (post) => {
    if (!window.confirm(`'${post.title}' 매거진을 삭제하시겠습니까?`)) return;
    try {
      await postService.deletePost(post.id);
      removeOptimistic(post.id);
    } catch (e) {
      alert(e.message ?? '삭제에 실패했습니다.');
      reload();
    }
  };

  return (
    <div className={styles.contentWrapper}>
      <header className={styles.contentHeader}>
        <div>
          <h2>매거진 관리</h2>
          <p>FAVORY 매거진을 작성·수정·삭제합니다. 매거진은 표지·제목·본문으로 큐레이션됩니다.</p>
        </div>
        <button className={styles.actionBtn} onClick={() => navigate('/admin/magazine/new')}>
          <Plus size={18} /> 새 매거진
        </button>
      </header>

      <div className={styles.layoutRow}>
        <section className={styles.listSection} style={{ background: 'transparent', border: 'none', padding: 0 }}>
          {error && (
            <div style={{ padding: '16px', background: '#FEF2F2', color: '#EF4444', borderRadius: '12px', marginBottom: '16px' }}>
              {error.message ?? '매거진 목록을 불러오지 못했습니다.'}
            </div>
          )}

          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <Loader2 className="spinner" size={32} color="#D4A373" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : magazines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', background: '#fff', borderRadius: '16px', border: '1px dashed #E8DCCF' }}>
              <BookOpen size={48} color="#eee" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#888', marginBottom: '16px' }}>아직 발행된 매거진이 없어요.</p>
              <button 
                onClick={() => navigate('/admin/magazine/new')}
                style={{ background: '#2C2018', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> 첫 매거진 작성하기
              </button>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {magazines.map((mag) => {
                const cover = mag.attachments?.cover_url ?? mag.attachments?.images?.[0]?.url ?? null;
                return (
                  <li key={mag.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#fff', borderRadius: '16px', border: '1px solid #E8DCCF', transition: 'border-color 0.2s' }}>
                    
                    {/* 썸네일 이미지 */}
                    <div style={{ width: '100px', height: '68px', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                      {cover ? (
                        <img src={cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                          <BookOpen size={24} />
                        </div>
                      )}
                    </div>

                    {/* 메타 정보 */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', color: '#2C2018', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {mag.title || '제목 없음'}
                      </h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
                        {new Date(mag.created_at).toLocaleDateString()}
                        {mag.category ? ` · ${mag.category}` : ''}
                        {` · ♡ ${mag.like_count ?? 0} · 💬 ${mag.comment_count ?? 0}`}
                      </p>
                    </div>

                    {/* 액션 버튼 */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        title="발행된 페이지 보기"
                        onClick={() => navigate(`/community/posts/${mag.id}`)}
                        style={{ background: '#F8F9FA', border: '1px solid #eee', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#555' }}
                      ><ExternalLink size={16} /></button>
                      <button 
                        title="수정"
                        onClick={() => navigate(`/admin/magazine/${mag.id}/edit`)}
                        style={{ background: '#F8F9FA', border: '1px solid #eee', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#555' }}
                      ><Edit2 size={16} /></button>
                      <button 
                        title="삭제"
                        onClick={() => handleDelete(mag)}
                        style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#EF4444' }}
                      ><Trash2 size={16} /></button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};


// =====================================================================
// 🌟 [메인 컴포넌트] AdminPage 
// =====================================================================
export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('banners'); 
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [banners, setBanners] = useState([]);
  const [notices, setNotices] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const [currentData, setCurrentData] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // 데이터 불러오기 (매거진은 하위 컴포넌트에서 알아서 처리하므로 제외)
  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'banners') {
        const { data, error } = await supabase.from('banners').select('*').order('priority', { ascending: true });
        if (error) throw error;
        setBanners(data || []);
      } 
      else if (activeTab === 'notices') {
        const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setNotices(data || []);
      }
      else if (activeTab === 'inquiries') {
        const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setInquiries(data || []);
      }
    } catch (error) {
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    setIsEditing(false);
    if (activeTab !== 'magazines') fetchData(); 
  }, [activeTab]);

  /* ── 배너 관리 로직 ── */
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      let finalImageUrl = currentData.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `banner-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('banners').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('banners').getPublicUrl(fileName);
        finalImageUrl = publicUrl; 
      }
      const bannerData = { title: currentData.title, subtitle: currentData.subtitle, image_url: finalImageUrl, link_url: currentData.link_url, is_active: currentData.is_active, priority: currentData.priority };
      if (currentData.id) {
        await supabase.from('banners').update(bannerData).eq('id', currentData.id);
      } else {
        await supabase.from('banners').insert([bannerData]);
      }
      setIsEditing(false);
      setImageFile(null);
      fetchData();
    } catch (error) {
      alert('저장 실패: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm('정말 이 배너를 삭제하시겠습니까?')) {
      await supabase.from('banners').delete().eq('id', id);
      fetchData();
    }
  };

  const renderBannersMenu = () => (
    <div className={styles.contentWrapper}>
      <header className={styles.contentHeader}>
        <div><h2>배너 콘텐츠 관리</h2><p>홈 화면의 메인 배너를 실시간으로 제어합니다.</p></div>
        <button className={styles.actionBtn} onClick={() => { setIsEditing(true); setImageFile(null); setCurrentData({ title: '', subtitle: '', image_url: '', link_url: '', is_active: true, priority: 0 }); }}>
          <Plus size={18} /> 새 배너 추가
        </button>
      </header>

      <div className={styles.layoutRow}>
        <section className={styles.listSection}>
          <table className={styles.table}>
            <thead><tr><th>순서</th><th>이미지</th><th>제목/설명</th><th>상태</th><th>관리</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px' }}><Loader2 className="spinner" size={28} /></td></tr>
              : banners.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: '#888' }}>데이터가 없습니다.</td></tr>
              : banners.map((banner) => (
                <tr key={banner.id}>
                  <td>{banner.priority}</td>
                  <td><div className={styles.imgPreview} style={{ backgroundImage: `url(${banner.image_url})` }} /></td>
                  <td><div className={styles.titleInfo}><strong>{banner.title}</strong><span>{banner.subtitle}</span></div></td>
                  <td>{banner.is_active ? '노출' : '숨김'}</td>
                  <td className={styles.actions}>
                    <button onClick={() => { setIsEditing(true); setImageFile(null); setCurrentData(banner); }}><Edit2 size={16}/></button>
                    <button onClick={() => handleDeleteBanner(banner.id)} className={styles.delete}><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {isEditing && (
          <aside className={styles.editForm}>
            <div className={styles.formHeader}><h3>{currentData?.id ? '배너 수정' : '신규 배너 등록'}</h3><button onClick={() => setIsEditing(false)} type="button"><X size={20}/></button></div>
            <form onSubmit={handleSaveBanner}>
              <div className={styles.inputGroup}><label>배너 제목</label><input type="text" required value={currentData.title} onChange={e => setCurrentData({...currentData, title: e.target.value})} /></div>
              <div className={styles.inputGroup}><label>소제목</label><input type="text" value={currentData.subtitle} onChange={e => setCurrentData({...currentData, subtitle: e.target.value})} /></div>
              <div className={styles.inputGroup}><label>이미지</label>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) { setImageFile(file); setCurrentData({...currentData, image_url: URL.createObjectURL(file)}); }
                }} />
                {currentData.image_url && <div style={{ marginTop: '12px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}><img src={currentData.image_url} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }}/></div>}
              </div>
              <div className={styles.inputGroup}><label>연결 링크</label><input type="text" value={currentData.link_url} onChange={e => setCurrentData({...currentData, link_url: e.target.value})} /></div>
              <div className={styles.row}>
                <div className={styles.inputGroup}><label>노출 순서</label><input type="number" value={currentData.priority} onChange={e => setCurrentData({...currentData, priority: parseInt(e.target.value) || 0})} /></div>
                <div className={styles.inputGroup}><label>상태</label>
                  <select value={currentData.is_active} onChange={e => setCurrentData({...currentData, is_active: e.target.value === 'true'})}><option value="true">ON (노출)</option><option value="false">OFF (숨김)</option></select>
                </div>
              </div>
              <button type="submit" className={styles.saveBtn} disabled={isSaving}>{isSaving ? '업로드 중...' : '저장하기'}</button>
            </form>
          </aside>
        )}
      </div>
    </div>
  );

  /* ── 공지사항 관리 로직 ── */
  const handleSaveNotice = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      const noticeData = { title: currentData.title, content: currentData.content, priority: currentData.priority, is_active: currentData.is_active };
      if (currentData.id) {
        await supabase.from('notices').update(noticeData).eq('id', currentData.id);
      } else {
        await supabase.from('notices').insert([noticeData]);
      }
      setIsEditing(false);
      fetchData();
    } catch (error) {
      alert('저장 실패: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (window.confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
      await supabase.from('notices').delete().eq('id', id);
      fetchData();
    }
  };

  const renderNoticesMenu = () => (
    <div className={styles.contentWrapper}>
      <header className={styles.contentHeader}>
        <div><h2>공지사항 관리</h2><p>고객센터의 공지사항 목록을 작성하고 관리합니다.</p></div>
        <button className={styles.actionBtn} onClick={() => { setIsEditing(true); setCurrentData({ title: '', content: '', priority: 0, is_active: true }); }}>
          <Plus size={18} /> 새 공지 추가
        </button>
      </header>

      <div className={styles.layoutRow}>
        <section className={styles.listSection}>
          <table className={styles.table}>
            <thead><tr><th>제목</th><th>등록일</th><th>상태</th><th>관리</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="4" style={{ textAlign: 'center', padding: '60px' }}><Loader2 className={styles.spinner} size={28} /></td></tr>
              : notices.length === 0 ? <tr><td colSpan="4" style={{ textAlign: 'center', padding: '60px', color: '#888' }}>등록된 공지가 없습니다.</td></tr>
              : notices.map((notice) => (
                <tr key={notice.id}>
                  <td><strong>{notice.title}</strong></td>
                  <td style={{ color: '#888', fontSize: '13px' }}>{new Date(notice.created_at).toLocaleDateString()}</td>
                  <td>{notice.is_active ? <span className={styles.statusOn}>노출</span> : <span className={styles.statusOff}>숨김</span>}</td>
                  <td className={styles.actions}>
                    <button onClick={() => { setIsEditing(true); setCurrentData(notice); }}><Edit2 size={16}/></button>
                    <button onClick={() => handleDeleteNotice(notice.id)} className={styles.delete}><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {isEditing && (
          <aside className={styles.editForm}>
            <div className={styles.formHeader}><h3>{currentData?.id ? '공지사항 수정' : '새 공지사항 작성'}</h3><button onClick={() => setIsEditing(false)} type="button"><X size={20}/></button></div>
            <form onSubmit={handleSaveNotice}>
              <div className={styles.inputGroup}><label>공지 제목</label><input type="text" required value={currentData.title} onChange={e => setCurrentData({...currentData, title: e.target.value})} /></div>
              <div className={styles.inputGroup}><label>공지 내용</label>
                <textarea required rows="12" value={currentData.content} onChange={e => setCurrentData({...currentData, content: e.target.value})} style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid var(--line)', fontFamily:'inherit', fontSize:'14px', resize:'vertical' }} />
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}><label>노출 순서</label><input type="number" value={currentData.priority} onChange={e => setCurrentData({...currentData, priority: parseInt(e.target.value) || 0})} /></div>
                <div className={styles.inputGroup}><label>상태</label>
                  <select value={currentData.is_active} onChange={e => setCurrentData({...currentData, is_active: e.target.value === 'true'})}><option value="true">ON (노출)</option><option value="false">OFF (숨김)</option></select>
                </div>
              </div>
              <button type="submit" className={styles.saveBtn} disabled={isSaving}>{isSaving ? '저장 중...' : '공지 저장하기'}</button>
            </form>
          </aside>
        )}
      </div>
    </div>
  );

  /* ── 1:1 문의 관리 로직 ── */
  const handleSaveAnswer = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      await supabase.from('inquiries').update({ answer: currentData.answer, status: '답변완료', answered_at: new Date().toISOString() }).eq('id', currentData.id);
      setIsEditing(false);
      fetchData();
    } catch (error) {
      alert('답변 저장 실패');
    } finally {
      setIsSaving(false);
    }
  };

  const renderInquiriesMenu = () => (
    <div className={styles.contentWrapper}>
      <header className={styles.contentHeader}>
        <div><h2>1:1 문의 관리</h2><p>사용자들이 접수한 문의사항에 답변을 작성합니다.</p></div>
      </header>

      <div className={styles.layoutRow}>
        <section className={styles.listSection}>
          <table className={styles.table}>
            <thead><tr><th>유형</th><th>작성자</th><th>제목</th><th>상태</th><th>작성일</th><th>관리</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: '60px' }}><Loader2 className={styles.spinner} size={28} /></td></tr>
              : inquiries.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#888' }}>접수된 문의가 없습니다.</td></tr>
              : inquiries.map(item => (
                <tr key={item.id}>
                  <td><span style={{fontSize:'12px', background:'#f0f0f0', padding:'4px 8px', borderRadius:'4px'}}>{item.type}</span></td>
                  <td><div style={{lineHeight: 1.2}}>{item.user_nickname}<br/><span style={{color:'#888', fontSize:'11px'}}>{item.user_email}</span></div></td>
                  <td><strong>{item.title}</strong></td>
                  <td><span style={{ color: item.status === '답변완료' ? '#2E7D32' : '#E65100', fontWeight:'bold', fontSize:'13px' }}>{item.status}</span></td>
                  <td style={{ color: '#888', fontSize: '13px' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className={styles.actions}>
                    <button onClick={() => { setIsEditing(true); setCurrentData(item); }}><Edit2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {isEditing && (
          <aside className={styles.editForm}>
            <div className={styles.formHeader}><h3>문의 답변하기</h3><button onClick={() => setIsEditing(false)}><X size={20}/></button></div>
            <div style={{marginBottom:'24px', padding:'20px', background:'#f8f9fa', borderRadius:'12px', border: '1px solid #eee'}}>
              <h4 style={{marginBottom:'12px', color:'#2C2018'}}>{currentData.title}</h4>
              <p style={{fontSize:'14px', color:'#444', whiteSpace:'pre-wrap', lineHeight: 1.6}}>{currentData.content}</p>
            </div>
            <form onSubmit={handleSaveAnswer}>
              <div className={styles.inputGroup}>
                <label>관리자 답변 작성</label>
                <textarea required rows="10" value={currentData.answer || ''} onChange={e => setCurrentData({...currentData, answer: e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid var(--line)', fontFamily:'inherit', resize:'vertical'}} />
              </div>
              <button type="submit" className={styles.saveBtn} disabled={isSaving}>{isSaving ? '저장 중...' : '답변 완료하기'}</button>
            </form>
          </aside>
        )}
      </div>
    </div>
  );

  const renderPlaceholder = (title) => (
    <div className={styles.placeholder}>
      <CheckSquare size={48} color="#ddd" />
      <h2>{title}</h2><p>해당 기능은 다음 업데이트에 연동될 예정입니다.</p>
    </div>
  );

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logoArea} onClick={() => navigate('/')}><ArrowLeft size={16} /> 서비스로 돌아가기</div>
        <div className={styles.adminProfile}>
          <div className={styles.avatar}><Settings size={20} /></div>
          <div><strong>FAVORY Admin</strong><span>최고 관리자</span></div>
        </div>
        <nav className={styles.navMenu}>
          <button className={activeTab === 'dashboard' ? styles.active : ''} onClick={() => setActiveTab('dashboard')}><LayoutDashboard size={18}/> 대시보드 요약</button>
          <button className={activeTab === 'banners' ? styles.active : ''} onClick={() => setActiveTab('banners')}><ImageIcon size={18}/> 배너 관리</button>
          <button className={activeTab === 'notices' ? styles.active : ''} onClick={() => setActiveTab('notices')}><Megaphone size={18}/> 공지사항 관리</button>
          <button className={activeTab === 'inquiries' ? styles.active : ''} onClick={() => setActiveTab('inquiries')}><MessageSquare size={18}/> 1:1 문의 관리</button>
          <button className={activeTab === 'magazines' ? styles.active : ''} onClick={() => setActiveTab('magazines')}><BookOpen size={18}/> 매거진 관리</button>
          <button className={activeTab === 'users' ? styles.active : ''} onClick={() => setActiveTab('users')}><Users size={18}/> 회원 관리</button>
        </nav>
        <button className={styles.logoutBtn} onClick={() => navigate('/')}><LogOut size={16}/> 관리자 로그아웃</button>
      </aside>

      <main className={styles.mainArea}>
        {activeTab === 'dashboard' && renderPlaceholder('대시보드 홈')}
        {activeTab === 'banners' && renderBannersMenu()}
        {activeTab === 'notices' && renderNoticesMenu()}
        {activeTab === 'inquiries' && renderInquiriesMenu()}
        {/* ✨ 매거진 탭 클릭 시 분리된 하위 컴포넌트 렌더링 */}
        {activeTab === 'magazines' && <MagazineTabContent />}
        {activeTab === 'users' && renderPlaceholder('회원 관리 시스템')}
      </main>
    </div>
  );
}