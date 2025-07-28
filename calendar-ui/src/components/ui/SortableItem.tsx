import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdData, formatExposure } from '../constants/adConstants';

interface SortableItemProps {
  id: string;
  ad: AdData;
  onClick: () => void;
}

export function SortableItem({ id, ad, onClick }: SortableItemProps) {
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

  const exposureStr = formatExposure(ad.guaranteedExposure);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-2 rounded border cursor-move ${
        ad.status === 'confirmed' 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-gray-50 border-gray-200'
      } hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-medium text-gray-900">
            [{ad.majorCategory}{ad.minorCategory ? `/${ad.minorCategory}` : ''}] {ad.advertiserName}
          </div>
          <div className="text-sm text-gray-600 mt-0.5">
            <span>담당: {ad.salesOwner}</span>
            {ad.countries.length > 0 && !ad.countries.includes('전체') && (
              <span className="ml-3">타겟: {ad.countries.join(', ')}</span>
            )}
            {exposureStr && (
              <span className="ml-3">노출: {exposureStr}</span>
            )}
            {ad.isPriority && <span className="ml-2 text-yellow-500">★</span>}
          </div>
          {ad.memo && (
            <div className="text-sm text-gray-500 mt-0.5">
              메모: {ad.memo}
            </div>
          )}
        </div>
        <div className="text-xs text-gray-400 ml-2">
          {ad.status === 'confirmed' ? '확정' : '제안'}
        </div>
      </div>
    </div>
  );
} 