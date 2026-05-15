import { supabase } from '../../../shared/api/supabaseClient';

export const storeRepository = {
  async getStoreInfo() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("로그인이 필요합니다.");

    // .single() 대신 .maybeSingle()을 사용하세요.
    // 데이터가 없어도 406 에러를 던지지 않고 null을 반환합니다.
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle(); 

    if (error) {
      console.error("Store 조회 에러:", error.message);
      throw error;
    }
    return data;
  },

  async updateStoreInfo(storeData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("로그인이 필요합니다.");

    const { data, error } = await supabase
      .from('stores')
      .upsert({ 
        ...storeData, 
        user_id: user.id,
        updated_at: new Date().toISOString() 
      }, { onConflict: 'user_id' })
      .select()
      .maybeSingle(); // 여기도 안전하게 maybeSingle 적용

    if (error) throw new Error(`저장 실패: ${error.message}`);
    return data;
  }
};