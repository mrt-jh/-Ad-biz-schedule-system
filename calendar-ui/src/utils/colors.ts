// 색상 관련 유틸리티 함수들

// 광고주별 색상 생성 함수 (모던 팔레트)
export const generateAdvertiserColors = (advertisers: string[]) => {
  const colors = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#06B6D4', // cyan-500
    '#84CC16', // lime-500
    '#F97316', // orange-500
    '#EC4899', // pink-500
    '#6366F1', // indigo-500
  ];

  const colorMap: Record<string, string> = {};
  advertisers.forEach((advertiser, index) => {
    colorMap[advertiser] = colors[index % colors.length];
  });

  return colorMap;
};

// 상태별 색상
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'text-green-600 bg-green-100';
    case 'proposed':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// 우선순위별 색상
export const getPriorityColor = (isPriority: boolean) => {
  return isPriority ? 'text-red-600 bg-red-100' : 'text-gray-600 bg-gray-100';
}; 