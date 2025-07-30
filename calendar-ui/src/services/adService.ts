import { supabase } from '../lib/supabase';
import { AdData } from '../constants/adConstants';
import type { Database } from '../types/database.types';

type AdRow = Database['public']['Tables']['ads']['Row'];
type AdInsert = Database['public']['Tables']['ads']['Insert'];
type AdUpdate = Database['public']['Tables']['ads']['Update'];
type SalesOwnerRow = Database['public']['Tables']['sales_owners']['Row'];

// DB 조인 결과 타입
type AdWithSalesOwner = AdRow & {
  sales_owners: SalesOwnerRow | null;
};

// AdData를 DB 형식으로 변환
const convertToDbFormat = (ad: Partial<AdData>): AdInsert => ({
  major_category: ad.majorCategory!,
  minor_category: ad.minorCategory || null,
  advertiser_name: ad.advertiserName!,
  sales_owner_id: ad.salesOwner ? undefined : null, // 담당자 이름으로 ID 찾아야 함
  start_date: ad.startDate!,
  end_date: ad.endDate!,
  countries: ad.countries || [],
  continents: ad.continents || [],
  is_priority: ad.isPriority || false,
  guaranteed_exposure: ad.guaranteedExposure!,
  status: ad.status!,
  memo: ad.memo || '',
  slot_type: ad.slotType!,
  slot_order: ad.slotOrder || null,
  parent_id: ad.parentId || null,
});

// DB 형식을 AdData로 변환
const convertFromDbFormat = (row: AdWithSalesOwner): AdData => ({
  id: row.id,
  majorCategory: row.major_category,
  minorCategory: row.minor_category || undefined,
  advertiserName: row.advertiser_name,
  salesOwner: row.sales_owners?.name || '미지정',
  startDate: row.start_date,
  endDate: row.end_date,
  countries: row.countries,
  continents: row.continents,
  isPriority: row.is_priority,
  guaranteedExposure: row.guaranteed_exposure,
  status: row.status,
  memo: row.memo,
  slotType: row.slot_type,
  slotOrder: row.slot_order || undefined,
  parentId: row.parent_id || undefined,
});

// 모든 광고 조회
export const getAllAds = async (): Promise<AdData[]> => {
  try {
    const { data, error } = await supabase
      .from('ads')
      .select(`
        *,
        sales_owners (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('광고 조회 오류:', error);
      throw error;
    }

    return data?.map(row => convertFromDbFormat(row as AdWithSalesOwner)) || [];
  } catch (error) {
    console.error('광고 조회 실패:', error);
    throw error;
  }
};

// 광고 생성
export const createAd = async (ad: Partial<AdData>): Promise<AdData> => {
  try {
    // 담당자 이름으로 ID 찾기
    let salesOwnerId = null;
    if (ad.salesOwner) {
      const { data: ownerData } = await supabase
        .from('sales_owners')
        .select('id')
        .eq('name', ad.salesOwner)
        .single();
      
      salesOwnerId = ownerData?.id || null;
    }

    const dbData = convertToDbFormat(ad);
    dbData.sales_owner_id = salesOwnerId;

    const { data, error } = await supabase
      .from('ads')
      .insert(dbData)
      .select(`
        *,
        sales_owners (*)
      `)
      .single();

    if (error) {
      console.error('광고 생성 오류:', error);
      throw error;
    }

    return convertFromDbFormat(data as AdWithSalesOwner);
  } catch (error) {
    console.error('광고 생성 실패:', error);
    throw error;
  }
};

// 광고 수정
export const updateAd = async (id: string, updates: Partial<AdData>): Promise<AdData> => {
  try {
    // 담당자 이름으로 ID 찾기 (필요한 경우)
    let salesOwnerId = undefined;
    if (updates.salesOwner) {
      const { data: ownerData } = await supabase
        .from('sales_owners')
        .select('id')
        .eq('name', updates.salesOwner)
        .single();
      
      salesOwnerId = ownerData?.id || null;
    }

    const dbUpdates: AdUpdate = {
      major_category: updates.majorCategory,
      minor_category: updates.minorCategory,
      advertiser_name: updates.advertiserName,
      sales_owner_id: salesOwnerId,
      start_date: updates.startDate,
      end_date: updates.endDate,
      countries: updates.countries,
      continents: updates.continents,
      is_priority: updates.isPriority,
      guaranteed_exposure: updates.guaranteedExposure,
      status: updates.status,
      memo: updates.memo,
      slot_type: updates.slotType,
      slot_order: updates.slotOrder,
      parent_id: updates.parentId,
    };

    // undefined 값 제거
    Object.keys(dbUpdates).forEach(key => {
      if (dbUpdates[key as keyof AdUpdate] === undefined) {
        delete dbUpdates[key as keyof AdUpdate];
      }
    });

    const { data, error } = await supabase
      .from('ads')
      .update(dbUpdates)
      .eq('id', id)
      .select(`
        *,
        sales_owners (*)
      `)
      .single();

    if (error) {
      console.error('광고 수정 오류:', error);
      throw error;
    }

    return convertFromDbFormat(data as AdWithSalesOwner);
  } catch (error) {
    console.error('광고 수정 실패:', error);
    throw error;
  }
};

// 광고 삭제
export const deleteAd = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('광고 삭제 오류:', error);
      throw error;
    }
  } catch (error) {
    console.error('광고 삭제 실패:', error);
    throw error;
  }
};

// 스케줄 충돌 체크
export const checkScheduleConflict = async (
  slotType: string,
  startDate: string,
  endDate: string,
  excludeId?: string
): Promise<boolean> => {
  try {
    let query = supabase
      .from('ads')
      .select('id')
      .eq('slot_type', slotType)
      .eq('status', 'confirmed')
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('스케줄 충돌 체크 오류:', error);
      throw error;
    }

    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('스케줄 충돌 체크 실패:', error);
    throw error;
  }
};

// 조건별 광고 조회
export const getAdsByFilter = async (filters: {
  advertiserName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  salesOwner?: string;
}): Promise<AdData[]> => {
  try {
    let query = supabase
      .from('ads')
      .select(`
        *,
        sales_owners (*)
      `);

    if (filters.advertiserName) {
      query = query.eq('advertiser_name', filters.advertiserName);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.startDate) {
      query = query.gte('start_date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('end_date', filters.endDate);
    }
    if (filters.salesOwner) {
      // 담당자 이름으로 필터링
      const { data: ownerData } = await supabase
        .from('sales_owners')
        .select('id')
        .eq('name', filters.salesOwner)
        .single();
      
      if (ownerData) {
        query = query.eq('sales_owner_id', ownerData.id);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('필터링된 광고 조회 오류:', error);
      throw error;
    }

    return data?.map(row => convertFromDbFormat(row as AdWithSalesOwner)) || [];
  } catch (error) {
    console.error('필터링된 광고 조회 실패:', error);
    throw error;
  }
};

// 특정 날짜의 광고 조회
export const getAdsByDate = async (date: string): Promise<AdData[]> => {
  try {
    const { data, error } = await supabase
      .from('ads')
      .select(`
        *,
        sales_owners (*)
      `)
      .lte('start_date', date)
      .gte('end_date', date)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('날짜별 광고 조회 오류:', error);
      throw error;
    }

    return data?.map(row => convertFromDbFormat(row as AdWithSalesOwner)) || [];
  } catch (error) {
    console.error('날짜별 광고 조회 실패:', error);
    throw error;
  }
};

// 모든 국가 정보 조회
export const getAllCountries = async () => {
  const { data, error } = await supabase
    .from('countries')
    .select('name, continent')
    .order('name');
    
  if (error) {
    console.error("국가 정보 조회 오류:", error);
    throw error;
  }
  return data || [];
};

// 모든 담당자 정보 조회
export const getAllSalesOwners = async () => {
  const { data, error } = await supabase
    .from('sales_owners')
    .select('id, name, email, department')
    .order('name');
    
  if (error) {
    console.error("담당자 정보 조회 오류:", error);
    throw error;
  }
  return data || [];
};

// Biz-core 광고 생성 (연관 광고)
export const createBizCoreAds = async (mainAd: AdData): Promise<AdData[]> => {
  // 새 스키마에서는 parent_id를 사용하여 연관 광고 생성
  try {
    const bizCoreAd: Partial<AdData> = {
      ...mainAd,
      id: undefined,
      slotType: 'Biz-core',
      parentId: mainAd.id,
      memo: `${mainAd.memo} (Biz-core 연관 광고)`
    };

    const created = await createAd(bizCoreAd);
    return [created];
  } catch (error) {
    console.error('Biz-core 광고 생성 실패:', error);
    throw error;
  }
}; 