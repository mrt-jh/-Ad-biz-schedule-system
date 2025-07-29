import React from 'react';
import { AdData } from '../../constants/adConstants';

interface FunnelScheduleViewProps {
  ads: AdData[];
  onAdClick: (ad: AdData) => void;
  advertiserColors: Record<string, string>;
}

export function FunnelScheduleView({ ads, onAdClick, advertiserColors }: FunnelScheduleViewProps) {
  // TODO: This component needs to be refactored to work with the new database schema.
  // The previous logic was heavily dependent on the 'FUNNEL_CATEGORIES' constant which is now obsolete.
  // For now, it will just render a placeholder.
  
  return (
    <div className="p-4 bg-gray-100 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Funnel Schedule View (Under Construction)</h2>
      <p className="text-gray-600">
        이 뷰는 새로운 데이터베이스 스키마에 맞게 재구축이 필요합니다.
        현재는 {ads.length}개의 광고 데이터가 로드되었습니다.
      </p>
    </div>
  );
} 