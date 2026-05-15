import { supabase } from '../../../shared/api/supabaseClient';

export const dashboardRepository = {
  // 대시보드 홈 화면용 통합 데이터 조회
  async getHomeData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("로그인 필요");

    const { data: store } = await supabase.from('stores').select('id').eq('user_id', user.id).single();
    if (!store) throw new Error("스토어 없음");

    // 🌟 병렬 처리(Promise.all)를 통해 4가지 데이터를 동시에 가져와서 속도를 높입니다.
    const [ordersRes, reviewsRes, checklistsRes] = await Promise.all([
      // 1. 주문 데이터 (매출 요약 및 주문 단계용)
      supabase.from('orders').select('*').eq('store_id', store.id),
      // 2. 리뷰 데이터
      supabase.from('reviews').select('*').eq('store_id', store.id).order('created_at', { ascending: false }).limit(3),
      // 3. 할 일/체크리스트 데이터
      supabase.from('events').select('*').eq('store_id', store.id).eq('category', 'work').gte('start_at', new Date().toISOString())
    ]);

    const orders = ordersRes.data || [];

    // 데이터 가공 후 부모 컴포넌트로 리턴
    return {
      sales: {
        totalRevenue: orders.reduce((sum, o) => sum + (o.total_price || 0), 0),
        todayOrders: orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length,
      },
      orders: {
        paid: orders.filter(o => o.status === '결제완료').length,
        preparing: orders.filter(o => o.status === '상품준비중').length,
        shipping: orders.filter(o => o.status === '배송중').length,
      },
      reviews: reviewsRes.data || [],
      checklists: checklistsRes.data || []
    };
  }
};