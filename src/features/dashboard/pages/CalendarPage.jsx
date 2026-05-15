import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/shared/api/supabaseClient';
import { useAuth } from '@/app/providers/AuthProvider';
import { 
  ChevronLeft, ChevronRight, ChevronDown, Plus, X, Globe, Lock, 
  Trash2, Edit2, Calendar as CalendarIcon, Clock, Loader2
} from 'lucide-react';

export default function CalendarPage() {
  const { user } = useAuth(); // 현재 로그인한 작가 정보 가져오기
  
  // 🌟 DB 연동 상태 관리
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [viewDate, setViewDate] = useState(new Date()); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  // 🌟 DB 컬럼명과 맞춘 폼 상태 (start_date, end_date, is_public)
  const [currentEvent, setCurrentEvent] = useState({ 
    id: null, start_date: '', end_date: '', title: '', is_public: true, isMultiDay: false 
  });

  // 캘린더 날짜 계산
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const pad = (n) => String(n).padStart(2, '0');
  const toDateStr = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  // 바깥 클릭 시 날짜 선택기 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) setShowDatePicker(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🌟 1. DB에서 내 일정 불러오기
  const fetchEvents = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artist_events')
        .select('*')
        .eq('artist_id', user.id) // 내 일정만 가져오기
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('이벤트 불러오기 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  // 해당 날짜에 포함된 일정 찾기
  const getEventsForDay = (dateStr) => {
    return events.filter(ev => dateStr >= ev.start_date && dateStr <= ev.end_date);
  };

  // 현재 월의 일정 (우측 목록용)
  const monthlyEvents = events.filter(ev => {
    const viewStart = toDateStr(year, month + 1, 1);
    const viewEnd = toDateStr(year, month + 1, daysInMonth);
    return ev.start_date <= viewEnd && ev.end_date >= viewStart;
  });

  // 날짜 클릭 (추가)
  const handleDateClick = (day) => {
    const dateStr = toDateStr(year, month + 1, day);
    setCurrentEvent({ id: null, start_date: dateStr, end_date: dateStr, title: '', is_public: true, isMultiDay: false });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // 🌟 2. 일정 저장 (Insert / Update)
  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    try {
      const finalEndDate = currentEvent.isMultiDay ? currentEvent.end_date : currentEvent.start_date;

      if (currentEvent.isMultiDay && finalEndDate < currentEvent.start_date) {
        alert('종료일은 시작일보다 빠를 수 없습니다.');
        return;
      }

      const eventData = {
        artist_id: user.id,
        title: currentEvent.title,
        start_date: currentEvent.start_date,
        end_date: finalEndDate,
        is_public: currentEvent.is_public
      };

      if (isEditing) {
        // 수정
        const { error } = await supabase.from('artist_events').update(eventData).eq('id', currentEvent.id);
        if (error) throw error;
      } else {
        // 새로 추가
        const { error } = await supabase.from('artist_events').insert([eventData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchEvents(); // 목록 다시 불러오기
    } catch (error) {
      alert('일정 저장 실패: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 🌟 3. 일정 삭제
  const handleDelete = async (id) => {
    if (window.confirm('이 일정을 정말 삭제하시겠습니까?')) {
      try {
        const { error } = await supabase.from('artist_events').delete().eq('id', id);
        if (error) throw error;
        fetchEvents();
      } catch (error) {
        alert('삭제 실패: ' + error.message);
      }
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', gap: '24px', minHeight: 'calc(100vh - 100px)' }}>
      
      {/* ── 왼쪽: 캘린더 영역 ── */}
      <div style={{ flex: 1, background: '#fff', borderRadius: '20px', border: '1px solid #E8DCCF', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          {/* 연도/월 선택기 */}
          <div ref={datePickerRef} style={{ position: 'relative' }}>
            <h3 
              onClick={() => setShowDatePicker(!showDatePicker)}
              style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#2C2018', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px' }}
            >
              {year}년 {month + 1}월 <ChevronDown size={20} color="#D4A373" />
            </h3>

            {showDatePicker && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #E8DCCF', borderRadius: '12px', padding: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 10, display: 'flex', gap: '12px', marginTop: '8px' }}>
                <select value={year} onChange={(e) => { setViewDate(new Date(Number(e.target.value), month, 1)); setShowDatePicker(false); }} style={selectStyle}>
                  {Array.from({ length: 11 }, (_, i) => year - 5 + i).map(y => <option key={y} value={y}>{y}년</option>)}
                </select>
                <select value={month} onChange={(e) => { setViewDate(new Date(year, Number(e.target.value), 1)); setShowDatePicker(false); }} style={selectStyle}>
                  {Array.from({ length: 12 }, (_, i) => i).map(m => <option key={m} value={m}>{m + 1}월</option>)}
                </select>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={prevMonth} style={btnIconStyle}><ChevronLeft size={20}/></button>
            <button onClick={() => setViewDate(new Date())} style={{...btnIconStyle, width: 'auto', padding: '0 12px', fontSize: '13px', fontWeight: 'bold', color: '#2C2018'}}>오늘</button>
            <button onClick={nextMonth} style={btnIconStyle}><ChevronRight size={20}/></button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '12px' }}>
          {['일','월','화','수','목','금','토'].map((d, i) => (
            <div key={d} style={{ fontSize: '13px', fontWeight: 'bold', color: i === 0 ? '#EF4444' : i === 6 ? '#3B82F6' : '#888', padding: '8px 0' }}>{d}</div>
          ))}
        </div>

        {/* 🌟 캘린더 그리드 (크기 고정: height 120px) */}
        {loading ? (
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="spinner" size={32} color="#D4A373" /></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} style={{ height: '120px' }} />)}
            
            {days.map(day => {
              const dateStr = toDateStr(year, month + 1, day);
              const dayEvents = getEventsForDay(dateStr);
              const isToday = dateStr === toDateStr(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());

              return (
                <div 
                  key={day} 
                  onClick={() => handleDateClick(day)}
                  style={{ 
                    height: '120px', // ✨ 높이 고정 (일정이 많아도 늘어나지 않음)
                    overflow: 'hidden', // 넘치는 요소 숨김
                    border: '1px solid #F5EBE0', borderRadius: '12px', padding: '6px', 
                    cursor: 'pointer', transition: 'background 0.2s', display: 'flex', flexDirection: 'column', gap: '4px',
                    background: isToday ? '#FFFBF5' : '#fff'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FDFAF6'}
                  onMouseLeave={e => e.currentTarget.style.background = isToday ? '#FFFBF5' : '#fff'}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: isToday ? '#fff' : '#444', background: isToday ? '#D4A373' : 'transparent', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                      {day}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {dayEvents.slice(0, 3).map(ev => (
                      <div key={ev.id} style={{
                        fontSize: '11px', padding: '3px 6px', borderRadius: '4px', fontWeight: '500',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        background: ev.is_public ? '#FFF2E5' : '#F3F4F6',
                        color: ev.is_public ? '#B47B3E' : '#6B7280',
                        borderLeft: `2px solid ${ev.is_public ? '#D4A373' : '#9CA3AF'}`
                      }}>
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div style={{ fontSize: '10px', color: '#888', textAlign: 'center', marginTop: '2px' }}>+{dayEvents.length - 3}개</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 오른쪽: 월별 일정 목록 ── */}
      <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ background: '#2C2018', borderRadius: '20px', padding: '24px', color: '#fff', boxShadow: '0 10px 20px rgba(44,32,24,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '18px' }}>{month + 1}월 전체 일정</h4>
            <button 
              onClick={() => { 
                setIsEditing(false); 
                setCurrentEvent({ id: null, start_date: toDateStr(year, month+1, new Date().getDate()), end_date: toDateStr(year, month+1, new Date().getDate()), title: '', is_public: true, isMultiDay: false }); 
                setIsModalOpen(true); 
              }}
              style={{ background: '#D4A373', border: 'none', padding: '8px 14px', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={16}/> 추가
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>이번 달은 {monthlyEvents.length}개의 일정이 있습니다.</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', background: '#fff', borderRadius: '20px', border: '1px solid #E8DCCF', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 size={24} color="#D4A373" className="spinner" /></div>
          ) : monthlyEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <CalendarIcon size={40} color="#eee" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '14px' }}>등록된 일정이 없습니다.</div>
            </div>
          ) : (
            monthlyEvents.map(ev => {
              const dateText = ev.start_date === ev.end_date 
                ? ev.start_date.slice(5) 
                : `${ev.start_date.slice(5)} ~ ${ev.end_date.slice(5)}`;
                
              return (
                <div key={ev.id} style={{ padding: '16px', borderRadius: '16px', background: '#FDFAF6', border: '1px solid #F5EBE0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 'bold', color: '#D4A373' }}>
                      <Clock size={14} /> {dateText}
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => { setCurrentEvent({ ...ev, isMultiDay: ev.start_date !== ev.end_date }); setIsEditing(true); setIsModalOpen(true); }} style={actionBtnStyle}><Edit2 size={15}/></button>
                      <button onClick={() => handleDelete(ev.id)} style={{...actionBtnStyle, color: '#EF4444'}}><Trash2 size={15}/></button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {ev.is_public ? <Globe size={16} color="#B47B3E" /> : <Lock size={16} color="#9CA3AF" />}
                    <span style={{ fontSize: '15px', color: '#2C2018', fontWeight: '600', lineHeight: 1.4 }}>{ev.title}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── 일정 폼 모달 ── */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#2C2018' }}>{isEditing ? '일정 수정' : '새 일정 추가'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X color="#888" /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', background: '#F3F4F6', padding: '4px', borderRadius: '12px' }}>
                <button type="button" onClick={() => setCurrentEvent({...currentEvent, isMultiDay: false})} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', background: !currentEvent.isMultiDay ? '#fff' : 'transparent', color: !currentEvent.isMultiDay ? '#2C2018' : '#888', boxShadow: !currentEvent.isMultiDay ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
                  하루 종일 (당일)
                </button>
                <button type="button" onClick={() => setCurrentEvent({...currentEvent, isMultiDay: true})} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', background: currentEvent.isMultiDay ? '#fff' : 'transparent', color: currentEvent.isMultiDay ? '#2C2018' : '#888', boxShadow: currentEvent.isMultiDay ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
                  기간 설정
                </button>
              </div>

              {currentEvent.isMultiDay ? (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={inputWrapStyle}><label style={{fontSize:'13px', fontWeight:'bold', color:'#555'}}>시작일</label><input type="date" required value={currentEvent.start_date} onChange={e => setCurrentEvent({...currentEvent, start_date: e.target.value})} style={inputStyle} /></div>
                  <span style={{ paddingTop: '24px', fontWeight: 'bold', color: '#888' }}>~</span>
                  <div style={inputWrapStyle}><label style={{fontSize:'13px', fontWeight:'bold', color:'#555'}}>종료일</label><input type="date" required value={currentEvent.end_date} onChange={e => setCurrentEvent({...currentEvent, end_date: e.target.value})} style={inputStyle} /></div>
                </div>
              ) : (
                <div style={inputWrapStyle}><label style={{fontSize:'13px', fontWeight:'bold', color:'#555'}}>날짜</label><input type="date" required value={currentEvent.start_date} onChange={e => setCurrentEvent({...currentEvent, start_date: e.target.value})} style={inputStyle} /></div>
              )}

              <div style={inputWrapStyle}><label style={{fontSize:'13px', fontWeight:'bold', color:'#555'}}>일정 내용</label><input type="text" required placeholder="예: 핸드메이드 페어 참석" value={currentEvent.title} onChange={e => setCurrentEvent({...currentEvent, title: e.target.value})} style={inputStyle} /></div>

              <div style={inputWrapStyle}>
                <label style={{fontSize:'13px', fontWeight:'bold', color:'#555'}}>공개 설정</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setCurrentEvent({...currentEvent, is_public: true})} style={currentEvent.is_public ? activeToggleStyle : toggleStyle}><Globe size={18}/> 프로필 공개</button>
                  <button type="button" onClick={() => setCurrentEvent({...currentEvent, is_public: false})} style={!currentEvent.is_public ? activeToggleStyle : toggleStyle}><Lock size={18}/> 나만 보기</button>
                </div>
              </div>

              <button type="submit" disabled={isSaving} style={submitBtnStyle}>
                {isSaving ? <Loader2 size={20} className="spinner" /> : isEditing ? '수정 완료' : '일정 등록하기'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 스타일 모음
const btnIconStyle = { background: '#fff', border: '1px solid #E8DCCF', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const actionBtnStyle = { background: '#fff', border: '1px solid #eee', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#888', display: 'flex' };
const modalOverlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const modalContentStyle = { background: '#fff', width: '100%', maxWidth: '440px', padding: '32px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' };
const inputWrapStyle = { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 };
const inputStyle = { padding: '12px 16px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '15px', fontFamily: 'inherit', width: '100%' };
const selectStyle = { padding: '8px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' };
const toggleStyle = { flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #eee', background: '#F8F9FA', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666' };
const activeToggleStyle = { ...toggleStyle, border: '2px solid #D4A373', background: '#FDFAF6', color: '#2C2018', fontWeight: 'bold' };
const submitBtnStyle = { background: '#2C2018', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' };