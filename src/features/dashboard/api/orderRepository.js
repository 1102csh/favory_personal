import { supabase } from '../../../shared/api/supabaseClient';

export const orderRepository = {
  // 1. 전체 주문 내역 조회
  async getOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('ordered_at', { ascending: false });

    if (error) throw new Error(`주문 내역을 불러오지 못했습니다: ${error.message}`);
    return data;
  },

  // 2. 주문 상태 변경 (예: '신규주문' -> '배송준비')
  async updateOrderStatus(orderId, newStatus) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw new Error(`주문 상태 변경에 실패했습니다: ${error.message}`);
    return data;
  }
};