// 광고 관련 상수 정의

// 광고 데이터 구조 (new-database-schema.sql 기반)
export interface AdData {
  id: string; // ad_schedules.id
  campaignId: string; // ad_schedules.campaign_id
  campaignName: string; // campaigns.name
  advertiserName: string; // advertisers.name
  salesOwner: string; // sales_owners.name
  slotTypeId: string; // ad_schedules.slot_type_id
  slotType: string; // slot_types.name
  slotOrder?: number; // ad_schedules.slot_order
  startDate: string; // ad_schedules.start_date
  endDate: string; // ad_schedules.end_date
  guaranteedExposure: number; // ad_schedules.guaranteed_exposure
  status: 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled'; // ad_schedules.status
  memo: string | null; // ad_schedules.memo
  countries: string[]; // ad_targeting -> countries
  continents: string[]; // ad_targeting -> countries -> continent
  
  // 아래는 이전 데이터 구조와의 호환성 또는 UI 편의성을 위한 필드입니다.
  // 실제 DB 스키마에 직접 매핑되지 않을 수 있습니다.
  majorCategory: string; // UI 표시용, categories.funnel_type 또는 name
  minorCategory?: string; // UI 표시용, categories.name
  isPriority: boolean; // campaigns.priority_level로 대체 가능
}

// 구좌 타입, 카테고리 등은 이제 DB에서 직접 조회해야 하므로,
// 하드코딩된 상수는 대부분 제거되거나 DB 조회 로직으로 대체됩니다.

// 상태 옵션 (ad_schedules.status)
export const AD_STATUS_OPTIONS = [
  { value: 'scheduled' as const, label: '예약' },
  { value: 'active' as const, label: '진행중' },
  { value: 'paused' as const, label: '중단' },
  { value: 'completed' as const, label: '완료' },
  { value: 'cancelled' as const, label: '취소' },
] as const;

// 폼 초기값 (새로운 스키마 기반)
export const INITIAL_FORM_DATA: Omit<AdData, 'id' | 'campaignName' | 'advertiserName' | 'salesOwner' | 'slotType' | 'continents'> = {
  campaignId: '',
  slotTypeId: '',
  startDate: '',
  endDate: '',
  guaranteedExposure: 0,
  status: 'scheduled',
  memo: '',
  countries: [],
  
  // 아래 필드들은 UI에서 선택/입력 받아 처리해야 합니다.
  slotOrder: undefined,
  majorCategory: '',
  minorCategory: '',
  isPriority: false,
};

// 필터 초기값
export const INITIAL_FILTERS = {
  majorCategory: '',
  minorCategory: '',
  salesOwner: '',
  country: '',
  status: '',
  advertiserName: ''
};

// 노출수 포맷팅 함수
export const formatExposure = (exposure: number): string => {
  if (exposure <= 0) return '';
  return exposure >= 10000
    ? `${(exposure / 10000).toFixed(1).replace('.0', '')}만`
    : `${exposure.toLocaleString()}`;
};

// 카테고리 표시 형식
export const formatCategory = (majorCategory: string, minorCategory?: string): string => {
  return minorCategory 
    ? `[${majorCategory}/${minorCategory}]`
    : `[${majorCategory}]`;
};

// 국가 표시 형식 (최대 3개까지만 표시)
export const formatCountries = (countries: string[], maxDisplay: number = 3): string => {
  if (countries.length === 0 || countries.includes('전체')) {
    return '';
  }
  
  if (countries.length > maxDisplay) {
    return `${countries.slice(0, maxDisplay).join(', ')}...`;
  }
  
  return countries.join(', ');
};

// Biz-core 자동 생성 함수 -> 이 로직은 서버(adService)로 이동했으며, 새로운 스키마에서는 bizcore_relations 테이블을 사용해야 합니다.
// 클라이언트 측에서는 더 이상 이 함수를 사용하지 않습니다.
export const createBizCoreAds = (mainAd: AdData): AdData[] => {
  console.warn("createBizCoreAds는 더 이상 클라이언트에서 사용되지 않습니다.");
  return [];
}; 