import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdData, formatExposure } from '../../constants/adConstants';

interface SortableItemProps {
  id: string;
  ad: AdData;
  advertiserColors: Record<string, string>;
}

export function SortableItem({ id, ad, advertiserColors }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const statusInfo = {
    scheduled: { bgColor: 'bg-gray-400', label: '예약' },
    active: { bgColor: advertiserColors[ad.advertiserName] || 'bg-blue-500', label: '진행중' },
    paused: { bgColor: 'bg-yellow-500', label: '중단' },
    completed: { bgColor: 'bg-green-500', label: '완료' },
    cancelled: { bgColor: 'bg-red-500', label: '취소' },
  };

  const { bgColor, label } = statusInfo[ad.status] || statusInfo.scheduled;
  const textColor = 'text-white';
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={`p-2 rounded-md shadow-sm h-full flex flex-col justify-between ${bgColor} ${textColor}`}>
        <div>
          <div className="font-bold truncate">{ad.campaignName}</div>
          <div className="text-xs truncate">{ad.advertiserName} ({ad.salesOwner})</div>
        </div>
        <div className="text-right text-sm font-semibold">
          {formatExposure(ad.guaranteedExposure)}
        </div>
        <div className="flex items-center text-xs opacity-80 mt-1">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {ad.startDate}
        </div>
        <div className="absolute top-1 right-1 flex items-center">
          {ad.isPriority && <span className="text-yellow-300 mr-1" title="우선순위">⭐</span>}
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-white/20">{label}</span>
        </div>
      </div>
    </div>
  );
} 