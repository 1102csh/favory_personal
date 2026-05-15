import { supabase } from '../../../shared/api/supabaseClient';

export const eventRepository = {
  // 1. 통합 일정 불러오기 (클래스 상품 + 개인 일정)
  async getAllIntegratedEvents() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("로그인이 필요합니다.");

    // [A] 개인 일정(events 테이블) 가져오기
    const { data: adminEvents, error: adminError } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id);

    if (adminError) throw adminError;

    // [B] 클래스 상품(products 테이블) 가져오기
    const { data: classProducts, error: productError } = await supabase
      .from('products')
      .select('id, title, class_date, location')
      .eq('category', '클래스')
      .not('class_date', 'is', null);

    if (productError) throw productError;

    // [C] 상업용 규격으로 데이터 통합 및 포맷팅
    const integrated = [
      ...(adminEvents || []).map(e => ({
        id: e.id,
        title: e.title,
        displayTitle: `[${e.category === 'holiday' ? '휴무' : '작업'}] ${e.title}`,
        date: e.start_at.split('T')[0],
        time: new Date(e.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: e.category === 'holiday' ? 'order' : 'work', // CSS 클래스 매핑용
        category: e.category,
        description: e.description
      })),
      ...(classProducts || []).map(p => ({
        id: p.id,
        title: p.title,
        displayTitle: `🧵 클래스: ${p.title}`,
        date: p.class_date.split('T')[0],
        time: new Date(p.class_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        location: p.location,
        type: 'class' // 주황색 테마 매핑용
      }))
    ];

    return integrated;
  },

  // 2. 일정 생성 (CalendarPage에서 호출하는 바로 그 함수!)
  async createEvent(eventData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    // 상업용 데이터 정제: 'time' 필드를 삭제하고 'start_at'으로 통합
    const { time, selectedDate, ...rest } = eventData;
    
    // 2026-05-10과 14:00를 합쳐서 표준 ISO 시간 형식으로 변환
    const startAt = `${selectedDate}T${time}:00Z`; 
    
    const { data, error } = await supabase
      .from('events')
      .insert([{ 
        ...rest, 
        start_at: startAt,
        end_at: startAt, // 필요시 종료시간 계산 로직 추가 가능
        user_id: user.id 
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 3. 일정 삭제 (상업용 필수 기능)
  async deleteEvent(eventId) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
    return true;
  }
};