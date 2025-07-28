import { AdData } from '../../constants/adConstants';
import { useMemo, useState } from 'react';

interface SpreadsheetViewProps {
  ads: AdData[];
  advertiserColors: Record<string, string>;
  onEventClick: (ad: AdData) => void;
}

export function SpreadsheetView({ ads, advertiserColors, onEventClick }: SpreadsheetViewProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDates = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + (weekOffset * 7));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push({
        date: date.toISOString().slice(0, 10),
        dayName: ['월', '화', '수', '목', '금', '토', '일'][i],
        dayNum: date.getDate(),
        month: date.getMonth() + 1,
      });
    }
    return dates;
  }, [weekOffset]);

  const { rows, categories, adMap } = useMemo(() => {
    const categoryMap: { [key: string]: { name: string, slots: { [key: string]: string } } } = {};
    const adMap: { [key: string]: AdData[] } = {}; // date-slotTypeId-slotOrder

    ads.forEach(ad => {
      if (!categoryMap[ad.majorCategory]) {
        categoryMap[ad.majorCategory] = { name: ad.majorCategory, slots: {} };
      }
      const slotIdentifier = `${ad.slotType}-${ad.slotOrder || 0}`;
      if (!categoryMap[ad.majorCategory].slots[slotIdentifier]) {
        categoryMap[ad.majorCategory].slots[slotIdentifier] = ad.slotType;
      }

      const startDate = new Date(ad.startDate);
      const endDate = new Date(ad.endDate);
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().slice(0, 10);
        const key = `${dateStr}-${ad.slotTypeId}-${ad.slotOrder || 0}`;
        if (!adMap[key]) adMap[key] = [];
        adMap[key].push(ad);
      }
    });

    const categoryList = Object.values(categoryMap);
    const rowData = categoryList.flatMap(cat => 
      Object.keys(cat.slots).map(slotIdentifier => ({
        category: cat.name,
        slotType: cat.slots[slotIdentifier],
        slotId: slotIdentifier,
      }))
    );
    
    return { rows: rowData, categories: categoryList, adMap };
  }, [ads]);
  
  const renderAdCell = (date: string, slotTypeId: string, slotOrder: number) => {
    const key = `${date}-${slotTypeId}-${slotOrder}`;
    const adsInCell: AdData[] = adMap[key] || [];

    if (adsInCell.length === 0) {
      return <div className="h-full"></div>;
    }
    const ad = adsInCell[0];
    const advertiserColor = advertiserColors[ad.advertiserName] || '#1976d2';
    return (
      <div
        className="m-1 p-1.5 rounded-md text-xs cursor-pointer hover:opacity-90 transition-opacity shadow-sm h-full flex flex-col justify-center"
        style={{ backgroundColor: advertiserColor, color: 'white' }}
        onClick={() => onEventClick(ad)}
      >
        <div className="font-medium truncate">
          [{ad.salesOwner}] {ad.advertiserName}
        </div>
      </div>
    );
  };

  const getWeekTitle = () => {
    if (weekOffset === 0) return '이번주';
    if (weekOffset === -1) return '지난주';
    if (weekOffset === 1) return '다음주';
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (weekOffset * 7));
    const month = targetDate.getMonth() + 1;
    const date = targetDate.getDate();
    return `${month}월 ${date}일 주`;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.currentTarget.scrollLeft += e.deltaY;
  };

  return (
    <div>
      {weekOffset === 0 && (
        <div className="bg-orange-400 text-white font-bold text-center py-2 text-lg mb-2">
          이번주
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setWeekOffset(weekOffset - 1)} className="px-3 py-1 bg-slate-200 rounded">‹</button>
        <h3 className="text-lg font-bold">{getWeekTitle()} ({weekDates[0].month}/{weekDates[0].dayNum} ~ {weekDates[6].month}/{weekDates[6].dayNum})</h3>
        <button onClick={() => setWeekOffset(weekOffset + 1)} className="px-3 py-1 bg-slate-200 rounded">›</button>
      </div>

      <div className="overflow-x-auto scroll-smooth" onWheel={handleWheel}>
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed', minWidth: '1200px' }}>
          <thead>
            <tr>
              <th className="bg-slate-800 text-white p-2 border border-slate-300 w-[120px] font-bold">
                카테고리
              </th>
              <th className="bg-slate-800 text-white p-2 border border-slate-300 w-[150px] font-bold">구좌 타입</th>
              {weekDates.map(({ date, dayName, dayNum, month }) => (
                <th key={date} className="bg-slate-600 text-white p-2 border border-slate-300">
                  <div>{dayName}</div>
                  <div className="text-sm">{month}/{dayNum}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category, categoryIndex) => {
              const categorySlots = Object.keys(category.slots);
              const totalSlots = categorySlots.length;

              return categorySlots.map((slotIdentifier, slotIndex) => {
                const slotName = category.slots[slotIdentifier];
                const [slotType, slotOrderStr] = slotIdentifier.split('-');
                const slotOrder = parseInt(slotOrderStr, 10);
                const slotTypeId = "temp-id"; // TODO: This needs to be the actual slot type ID

                return (
                  <tr key={`${category.name}-${slotIdentifier}`}>
                    {slotIndex === 0 && (
                      <td className="border p-2 font-bold align-middle text-center bg-slate-50" rowSpan={totalSlots}>
                        {category.name}
                      </td>
                    )}
                    <td className="border p-2 align-middle text-center">{slotName}</td>
                    {weekDates.map(({ date }) => (
                      <td key={date} className="border p-0 h-[50px]">
                        {renderAdCell(date, slotTypeId, slotOrder)}
                      </td>
                    ))}
                  </tr>
                )
              });
            })}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .scroll-smooth {
          scroll-behavior: smooth;
        }
        .overflow-x-auto::-webkit-scrollbar {
          height: 12px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background-color: #94a3b8;
          border-radius: 6px;
          border: 3px solid #f1f5f9;
        }
      `}</style>
    </div>
  );
} 