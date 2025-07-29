import { supabase } from '../lib/supabase';
import { AdData } from '../constants/adConstants';
import type { Database } from '../lib/supabase';

type AdScheduleRow = Database['public']['Tables']['ad_schedules']['Row'];
type AdScheduleInsert = Database['public']['Tables']['ad_schedules']['Insert'];
type AdScheduleUpdate = Database['public']['Tables']['ad_schedules']['Update'];
type CampaignRow = Database['public']['Tables']['campaigns']['Row'];
type AdvertiserRow = Database['public']['Tables']['advertisers']['Row'];
type SalesOwnerRow = Database['public']['Tables']['sales_owners']['Row'];
type CountryRow = Database['public']['Tables']['countries']['Row'];
type SlotTypeRow = Database['public']['Tables']['slot_types']['Row'];

// DB 조인 결과 타입을 정의합니다.
type AdScheduleWithRelations = AdScheduleRow & {
  campaigns: CampaignRow & {
    advertisers: AdvertiserRow;
    sales_owners: SalesOwnerRow;
  };
  slot_types: SlotTypeRow;
  ad_targeting: {
    countries: CountryRow;
  }[];
};


// AdData를 DB 형식으로 변환 (ad_schedules 테이블용)
const convertToDbFormat = (ad: Partial<AdData>): AdScheduleInsert => ({
  campaign_id: ad.campaignId!,
  slot_type_id: ad.slotTypeId!,
  slot_order: ad.slotOrder || null,
  start_date: ad.startDate!,
  end_date: ad.endDate!,
  guaranteed_exposure: ad.guaranteedExposure!,
  status: ad.status!,
  memo: ad.memo!,
});

// DB 형식을 AdData로 변환
const convertFromDbFormat = (row: AdScheduleWithRelations): AdData => ({
  id: row.id,
  campaignId: row.campaign_id,
  campaignName: row.campaigns.name,
  advertiserName: row.campaigns.advertisers.name,
  salesOwner: row.campaigns.sales_owners.name,
  slotTypeId: row.slot_type_id,
  slotType: row.slot_types.name,
  slotOrder: row.slot_order || undefined,
  startDate: row.start_date,
  endDate: row.end_date,
  guaranteedExposure: row.guaranteed_exposure,
  status: row.status,
  memo: row.memo,
  countries: row.ad_targeting.map(t => t.countries.name),
  continents: [...new Set(row.ad_targeting.map(t => t.countries.continent))],
  majorCategory: 'TBD', 
  minorCategory: 'TBD',
  isPriority: row.campaigns.priority_level > 0,
});


// 모든 광고 조회
export const getAllAds = async (): Promise<AdData[]> => {
  try {
    const { data, error } = await supabase
      .from('ad_schedules')
      .select(`
        *,
        campaigns:campaign_id (
          *,
          advertisers:advertiser_id (*),
          sales_owners:sales_owner_id (*)
        ),
        slot_types:slot_type_id (*),
        ad_targeting (
          countries:country_id (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('광고 조회 오류:', error);
      throw error;
    }

    return data?.map(row => convertFromDbFormat(row as AdScheduleWithRelations)) || [];
  } catch (error) {
    console.error('광고 조회 실패:', error);
    throw error;
  }
};

// 광고 추가
export const createAd = async (ad: Partial<AdData>): Promise<AdData> => {
  try {
    const dbData = convertToDbFormat(ad);
    
    const { data, error } = await supabase
      .from('ad_schedules')
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error('광고 생성 오류:', error);
      throw error;
    }
    
    // 타겟팅 정보 추가
    if (ad.countries && ad.countries.length > 0) {
      const countryIds = await getCountryIds(ad.countries);
      const targetingData = countryIds.map(country_id => ({
        ad_schedule_id: data.id,
        country_id: country_id
      }));
      
      const { error: targetingError } = await supabase
        .from('ad_targeting')
        .insert(targetingData);

      if (targetingError) {
        console.error('타겟팅 정보 추가 오류:', targetingError);
        await supabase.from('ad_schedules').delete().eq('id', data.id);
        throw targetingError;
      }
    }

    const newAd = await getAdById(data.id);
    if (!newAd) throw new Error("Failed to fetch the newly created ad.");
    return newAd;

  } catch (error) {
    console.error('광고 생성 실패:', error);
    throw error;
  }
};

// 국가 이름으로 ID 조회
const getCountryIds = async (countryNames: string[]): Promise<string[]> => {
  const { data, error } = await supabase
    .from('countries')
    .select('id')
    .in('name', countryNames);
  if (error) throw error;
  return data.map(c => c.id);
};

// ID로 단일 광고 조회 (Join 포함)
export const getAdById = async (id: string): Promise<AdData | null> => {
    const { data, error } = await supabase
      .from('ad_schedules')
      .select(`
        *,
        campaigns:campaign_id (
          *,
          advertisers:advertiser_id (*),
          sales_owners:sales_owner_id (*)
        ),
        slot_types:slot_type_id (*),
        ad_targeting (
          countries:country_id (*)
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`ID(${id})로 광고 조회 오류:`, error);
      return null
    };
    
    return convertFromDbFormat(data as AdScheduleWithRelations);
}


// 광고 수정
export const updateAd = async (id: string, updates: Partial<AdData>): Promise<AdData> => {
  try {
    const updateData: Partial<AdScheduleUpdate> = {};
    
    if (updates.campaignId) updateData.campaign_id = updates.campaignId;
    if (updates.slotTypeId) updateData.slot_type_id = updates.slotTypeId;
    if (updates.startDate) updateData.start_date = updates.startDate;
    if (updates.endDate) updateData.end_date = updates.endDate;
    if (updates.guaranteedExposure) updateData.guaranteed_exposure = updates.guaranteedExposure;
    if (updates.status) updateData.status = updates.status;
    if (updates.memo) updateData.memo = updates.memo;
    if (updates.slotOrder) updateData.slot_order = updates.slotOrder;
    
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('ad_schedules')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('광고 수정 오류:', error);
      throw error;
    }
    
    if (updates.countries) {
      await supabase.from('ad_targeting').delete().eq('ad_schedule_id', id);
      if (updates.countries.length > 0) {
        const countryIds = await getCountryIds(updates.countries);
        const targetingData = countryIds.map(country_id => ({
          ad_schedule_id: id,
          country_id: country_id
        }));
        await supabase.from('ad_targeting').insert(targetingData);
      }
    }
    
    const updatedAd = await getAdById(id);
    if (!updatedAd) throw new Error("Failed to fetch the updated ad.");
    return updatedAd;

  } catch (error) {
    console.error('광고 수정 실패:', error);
    throw error;
  }
};

// 광고 삭제
export const deleteAd = async (id: string): Promise<void> => {
  try {
    // ad_targeting에서 먼저 삭제
    await supabase.from('ad_targeting').delete().eq('ad_schedule_id', id);
    
    const { error } = await supabase
      .from('ad_schedules')
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

// 조건별 광고 조회
export const getAdsByFilter = async (filters: {
  advertiserName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  salesOwner?: string;
}): Promise<AdData[]> => {
  try {
    let query = supabase.from('ad_schedules').select(`
      *,
      campaigns:campaign_id!inner (
        *,
        advertisers:advertiser_id!inner (*),
        sales_owners:sales_owner_id!inner (*)
      ),
      slot_types:slot_type_id (*),
      ad_targeting (
        countries:country_id (*)
      )
    `);

    if (filters.advertiserName) {
      query = query.eq('campaigns.advertisers.name', filters.advertiserName);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.salesOwner) {
      query = query.eq('campaigns.sales_owners.name', filters.salesOwner);
    }
    if (filters.startDate) {
      query = query.gte('start_date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('end_date', filters.endDate);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('필터링된 광고 조회 오류:', error);
      throw error;
    }

    return data?.map(row => convertFromDbFormat(row as AdScheduleWithRelations)) || [];
  } catch (error) {
    console.error('필터링된 광고 조회 실패:', error);
    throw error;
  }
};

// 특정 날짜의 광고 조회
export const getAdsByDate = async (date: string): Promise<AdData[]> => {
  try {
    const { data, error } = await supabase
      .from('ad_schedules')
      .select(`
        *,
        campaigns:campaign_id (
          *,
          advertisers:advertiser_id (*),
          sales_owners:sales_owner_id (*)
        ),
        slot_types:slot_type_id (*),
        ad_targeting (
          countries:country_id (*)
        )
      `)
      .lte('start_date', date)
      .gte('end_date', date)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('날짜별 광고 조회 오류:', error);
      throw error;
    }

    return data?.map(row => convertFromDbFormat(row as AdScheduleWithRelations)) || [];
  } catch (error) {
    console.error('날짜별 광고 조회 실패:', error);
    throw error;
  }
};

// Biz-core 광고 생성 (연관 광고)
export const createBizCoreAds = async (_mainAd: AdData): Promise<AdData[]> => {
  console.warn("createBizCoreAds 기능은 새로운 스키마에 맞게 재구현이 필요합니다.");
  return [];
};

// 모든 국가 정보 조회
export const getAllCountries = async () => {
  const { data, error } = await supabase.from('countries').select('name, continent').order('name');
  if (error) {
    console.error("국가 정보 조회 오류:", error);
    throw error;
  }
  return data;
} 