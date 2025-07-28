import React from 'react';
import { AdData, FUNNEL_CATEGORIES } from '../constants/adConstants';

interface FunnelScheduleViewProps {
  funnelType: keyof typeof FUNNEL_CATEGORIES;
  ads: AdData[];
  onAdClick: (ad: AdData) => void;
}

const SLOT_ORDER = ['타겟1', '타겟2', '타겟3', '타겟4', '타겟5', '타겟6', '타겟7', 'Biz-core', '제안1', '제안2'];

export function FunnelScheduleView({ funnelType, ads, onAdClick }: FunnelScheduleViewProps) {
  const categories = FUNNEL_CATEGORIES[funnelType];
  
  // 카테고리별로 광고를 그룹화
  const getAdsForCategory = (category: string) => {
    return ads.filter(ad => ad.majorCategory === category);
  };

  // 구좌별로 광고를 정렬
  const getAdsBySlot = (categoryAds: AdData[]) => {
    const slotMap: { [key: string]: AdData[] } = {};
    
    // 슬롯별로 그룹화
    categoryAds.forEach(ad => {
      const slotType = ad.slotType || '타겟1';
      if (!slotMap[slotType]) {
        slotMap[slotType] = [];
      }
      slotMap[slotType].push(ad);
    });
    
    return slotMap;
  };

  // 광고 카드 렌더링
  const renderAdCard = (ad: AdData) => {
    const bgColor = ad.status === 'confirmed' ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300';
    const textColor = ad.status === 'confirmed' ? 'text-blue-900' : 'text-gray-700';
    
    return (
      <div 
        key={ad.id}
        className={`p-1.5 mb-1 border rounded text-xs cursor-pointer hover:shadow-sm transition-shadow ${bgColor} ${textColor} relative`}
        onClick={() => onAdClick(ad)}
      >
        <div className="font-medium text-xs truncate" title={ad.advertiserName}>
          {ad.advertiserName}
        </div>
        <div className="text-xs opacity-75 truncate">
          {ad.salesOwner}
        </div>
        <div className="text-xs opacity-60 truncate">
          {ad.startDate.slice(5)}~{ad.endDate.slice(5)}
        </div>
        {ad.guaranteedExposure > 0 && (
          <div className="text-xs font-medium text-orange-600 truncate">
            {ad.guaranteedExposure >= 10000 ? `${(ad.guaranteedExposure / 10000).toFixed(1).replace('.0', '')}만` : ad.guaranteedExposure.toLocaleString()}
          </div>
        )}
        {ad.isPriority && (
          <div className="absolute top-0 right-0 text-yellow-500 text-xs">★</div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">{funnelType} 스케줄</h2>
      </div>
      
      <div className="border rounded-lg overflow-hidden overflow-x-auto">
        {/* 헤더 */}
        <div className="bg-gray-50 border-b flex min-w-max">
          <div className="w-60 p-3 font-medium text-center border-r bg-gray-800 text-white flex-shrink-0">
            지면
          </div>
          {SLOT_ORDER.map(slot => (
            <div key={slot} className="w-24 p-2 font-medium text-center border-r text-xs flex-shrink-0 bg-gray-100">
              {slot}
            </div>
          ))}
        </div>

        {/* 카테고리별 행 */}
        {categories.map((category, categoryIndex) => {
          const categoryAds = getAdsForCategory(category);
          const slotMap = getAdsBySlot(categoryAds);
          
          // 각 카테고리별 상세 설명
          const getCategoryDetails = (cat: string) => {
            switch (cat) {
              case '체크리스트':
                return '타겟 국가 (확정만 포함)';
              case '인터랙티브':
                return '타겟 7개까지';
              case '메인홈 전면배너':
                return '타겟 국가 (확정만 포함)';
              case '메인홈 배너':
                return '';
              case '검색퍼널':
                return '통합 검색 홈, 통합 검색 결과, 도시홈';
              case '해외 여행 퍼널':
                return '항공홈, 국제선 항공 검색 로딩, 국제선 항공 검색 결과, 국제선 발권 완료, 투어티켓 홈, 투어티켓 상품 목록, 해외 통합 숙소 홈, 해외 통합 숙소 상품 상세';
              case '여행자 퍼널':
                return '경제완료 팝업, 예세지 목록, 여약 상세, 여정딥 여행, 주문완료, 지난 여행';
              case '국내 여행 퍼널':
                return '국내선 항공 검색 결과, 국내선 발권 완료, 국내 통합 숙소 홈, 국내 숙소 상품 상세, 국내선 항공 검색 로딩';
              case 'CRM':
                return '친구톡, 앱푸시, 메세지 광고';
              default:
                return '';
            }
          };

          const details = getCategoryDetails(category);
          
          return (
            <div key={category} className="border-b">
              <div className="flex min-w-max min-h-[80px]">
                {/* 지면명 */}
                <div className="w-60 p-3 border-r bg-rose-100 flex flex-col justify-center flex-shrink-0">
                  <div className="font-medium text-sm">{category}</div>
                  {details && (
                    <div className="text-xs text-gray-600 mt-1 leading-tight">{details}</div>
                  )}
                </div>
                
                {/* 구좌별 광고 */}
                {SLOT_ORDER.map(slot => (
                  <div key={slot} className="w-24 p-1 border-r min-h-[80px] bg-white flex-shrink-0">
                    {slotMap[slot]?.map(ad => renderAdCard(ad))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 범례 */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
          <span>확정</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
          <span>제안</span>
        </div>
      </div>
    </div>
  );
} 