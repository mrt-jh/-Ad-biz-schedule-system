// 포맷팅 관련 유틸리티 함수들

// 날짜 포맷팅
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// 숫자 포맷팅
export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ko-KR').format(num);
};

// 통화 포맷팅
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
};

// 퍼센트 포맷팅
export const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(2)}%`;
};

// 노출 수 포맷팅
export const formatExposure = (exposure: number): string => {
  if (exposure >= 1000000) {
    return `${(exposure / 1000000).toFixed(1)}M`;
  } else if (exposure >= 1000) {
    return `${(exposure / 1000).toFixed(1)}K`;
  }
  return exposure.toString();
};

// 카테고리 포맷팅
export const formatCategory = (majorCategory: string, minorCategory?: string): string => {
  if (minorCategory) {
    return `${majorCategory} > ${minorCategory}`;
  }
  return majorCategory;
};

// 국가 목록 포맷팅
export const formatCountries = (countries: string[], maxDisplay: number = 3): string => {
  if (countries.length <= maxDisplay) {
    return countries.join(', ');
  }
  return `${countries.slice(0, maxDisplay).join(', ')} 외 ${countries.length - maxDisplay}개`;
}; 