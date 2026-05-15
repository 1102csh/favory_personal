import { supabase } from '../../../shared/api/supabaseClient';

export const productRepository = {
  // 1. 상품 목록 조회 (내 스토어 상품만)
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`목록 로딩 실패: ${error.message}`);
    return data;
  },

  // 2. 새 상품 등록
  async createProduct(productData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("로그인이 필요합니다.");

    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!store) throw new Error("스토어 설정이 필요합니다.");

    const refinedData = {
      ...productData,
      store_id: store.id,
      shipping_fee: productData.category === '상품' ? productData.shipping_fee : 0,
      location: productData.category === '클래스' ? productData.location : null,
      class_date: productData.category === '클래스' ? productData.class_date : null,
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert([{ ...productData, store_id: store.id }])
      .select()
      .single();

    if (error) throw new Error(`등록 실패: ${error.message}`);
    return data;
  },

  // 3. 상품 정보 수정
  async updateProduct(productId, updateData) {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw new Error(`수정 실패: ${error.message}`);
    return data;
  },

  // 4. 상품 삭제 (상업용 앱 필수 기능)
  async deleteProduct(productId) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw new Error(`삭제 실패: ${error.message}`);
    return true;
  }
};