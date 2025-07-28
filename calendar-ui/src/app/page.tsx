"use client";

import { useState, useEffect, useMemo } from 'react';
import { SpreadsheetView } from '../components/views/SpreadsheetView';
import { 
  AdData, 
  AD_STATUS_OPTIONS,
  INITIAL_FORM_DATA,
  formatExposure,
  formatCategory,
  formatCountries,
} from '../constants/adConstants';
import { useAds } from '../hooks/useAds';
import { generateAdvertiserColors } from '../utils/colors';

export default function Home() {
  const { ads, loading, error, addAd, updateAd, deleteAd } = useAds();
  const [filters, setFilters] = useState({ advertiserName: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const advertiserColors = useMemo(() => {
    const uniqueAdvertisers = [...new Set(ads.map(ad => ad.advertiserName))];
    return generateAdvertiserColors(uniqueAdvertisers);
  }, [ads]);

  const filteredAds = useMemo(() => {
    return ads.filter(ad => {
      if (filters.advertiserName && ad.advertiserName !== filters.advertiserName) {
        return false;
      }
      return true;
    });
  }, [ads, filters]);

  const handleAddAd = async () => {
    try {
      // TODO: campaignId, slotTypeId 등 실제 존재하는 ID를 선택하도록 UI 구현 필요
      // 현재는 임시값으로 하드코딩합니다.
      const temporaryFormData: Partial<AdData> = {
        ...formData,
        campaignId: "f1b9b8b0-4c8d-4a2d-8b8b-8b8b8b8b8b8b", // 임시 캠페인 ID
        slotTypeId: "a1b9b8b0-4c8d-4a2d-8b8b-8b8b8b8b8b8b", // 임시 구좌 타입 ID
      };

      await addAd(temporaryFormData);
      
      setFormData(INITIAL_FORM_DATA);
      setShowAddForm(false);
      setNotification({ type: 'success', message: '광고가 성공적으로 추가되었습니다.' });
    } catch (error) {
      console.error(error);
      setNotification({ type: 'error', message: `광고 추가에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` });
    }
  };

  const showAdDetails = (ad: AdData) => {
    alert(`
      광고 상세 정보:
      캠페인: ${ad.campaignName}
      광고주: ${ad.advertiserName}
      담당자: ${ad.salesOwner}
      구좌 타입: ${ad.slotType}
      기간: ${ad.startDate} ~ ${ad.endDate}
      국가: ${formatCountries(ad.countries)}
      보장 노출수: ${formatExposure(ad.guaranteedExposure)}
      상태: ${ad.status}
      메모: ${ad.memo || ''}
    `);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">광고 스케줄링 시스템</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              광고 추가
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 알림 */}
        {notification && (
          <div className={`mb-4 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.message}
            <button
              onClick={() => setNotification(null)}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* 뷰 선택 기능은 현재 스키마와 맞지 않아 임시 비활성화 */}
        {/* <div className="mb-6">
          <div className="flex space-x-4">
            {Object.keys(FUNNEL_CATEGORIES).map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view as keyof typeof FUNNEL_CATEGORIES)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === view
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div> */}

        {/* 스프레드시트 뷰 */}
        <SpreadsheetView
          ads={filteredAds}
          advertiserColors={advertiserColors}
          onEventClick={showAdDetails}
        />
      </main>
    </div>
  );
} 