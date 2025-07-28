import { AdData } from '../constants/adConstants';

// Mock 데이터 - 실제 광고사업팀 데이터와 유사하게 구성
export const generateMockData = (): AdData[] => {
  const today = new Date();
  const getDateString = (offsetDays: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().slice(0, 10);
  };

  return [
    {
      id: '1',
      majorCategory: '메인홈 팝업',
      advertiserName: '일본+배틀넷 타겟',
      salesOwner: '김동현',
      startDate: getDateString(-2), // 이틀 전 시작
      endDate: getDateString(1), // 내일 종료
      countries: ['일본', '베트남', '중국', '대만', '필리핀'],
      continents: ['중국 / 일본', '동남아시아'],
      isPriority: true,
      guaranteedExposure: 12000,
      status: 'proposed' as const,
      memo: '노출 12,000',
      slotType: '타겟1'
    },
    {
      id: '2',
      majorCategory: '친구톡',
      advertiserName: '중국, 대만, 필리핀 타겟 캠페인',
      salesOwner: '곽대영',
      startDate: getDateString(0), // 오늘 시작
      endDate: getDateString(3), // 3일 후 종료
      countries: ['중국', '대만', '필리핀', '스페인', '이탈리아'],
      continents: ['홍콩 / 마카오 / 대만 / 싱가포르', '동남아시아', '남유럽 / 터키'],
      isPriority: false,
      guaranteedExposure: 10000,
      status: 'confirmed' as const,
      memo: '노출 10,000',
      slotType: '제안1'
    },
    {
      id: '3',
      majorCategory: '앱푸시',
      advertiserName: '글로벌 푸시 캠페인',
      salesOwner: '김동현',
      startDate: getDateString(2), // 2일 후 시작
      endDate: getDateString(5), // 5일 후 종료
      countries: ['중국', '대만', '필리핀', '미국', '영국'],
      continents: ['홍콩 / 마카오 / 대만 / 싱가포르', '동남아시아', '북아메리카', '서유럽'],
      isPriority: true,
      guaranteedExposure: 10000,
      status: 'confirmed' as const,
      memo: '노출 10,000',
      slotType: 'Biz-core',
      slotOrder: 1
    },
    // 인터랙티브 광고 (Biz-core 자동 생성됨)
    {
      id: '4',
      majorCategory: '인터랙티브',
      advertiserName: '인터랙티브 이벤트',
      salesOwner: '김동현',
      startDate: getDateString(-1), // 어제 시작
      endDate: getDateString(4), // 4일 후 종료
      countries: ['일본', '중국'],
      continents: ['중국 / 일본'],
      isPriority: false,
      guaranteedExposure: 0,
      status: 'proposed' as const,
      memo: '인터랙티브 메인 광고'
    },
    // 인터랙티브의 Biz-core 1
    {
      id: '4-bizcore-1',
      majorCategory: '인터랙티브',
      advertiserName: '인터랙티브 이벤트 (Biz-core 1)',
      salesOwner: '김동현',
      startDate: getDateString(-1),
      endDate: getDateString(4),
      countries: ['일본', '중국'],
      continents: ['중국 / 일본'],
      isPriority: false,
      guaranteedExposure: 0,
      status: 'proposed' as const,
      memo: '',
      slotType: 'Biz-core',
      slotOrder: 1,
      parentId: '4'
    },
    // 인터랙티브의 Biz-core 2
    {
      id: '4-bizcore-2',
      majorCategory: '인터랙티브',
      advertiserName: '인터랙티브 이벤트 (Biz-core 2)',
      salesOwner: '김동현',
      startDate: getDateString(-1),
      endDate: getDateString(4),
      countries: ['일본', '중국'],
      continents: ['중국 / 일본'],
      isPriority: false,
      guaranteedExposure: 0,
      status: 'proposed' as const,
      memo: '',
      slotType: 'Biz-core',
      slotOrder: 2,
      parentId: '4'
    },
    {
      id: '5',
      majorCategory: '숏컷',
      advertiserName: '숏컷 프로모션',
      salesOwner: '곽대영',
      startDate: getDateString(7), // 일주일 후 시작
      endDate: getDateString(10), // 10일 후 종료
      countries: [],
      continents: [],
      isPriority: false,
      guaranteedExposure: 3210,
      status: 'proposed' as const,
      memo: '노출 3천',
      slotType: '타겟2'
    },
    {
      id: '6',
      majorCategory: '메시지 광고',
      advertiserName: '메시지 마케팅 캠페인',
      salesOwner: '김동현',
      startDate: getDateString(1), // 내일 시작
      endDate: getDateString(4), // 4일 후 종료
      countries: ['일본', '중국'],
      continents: ['중국 / 일본'],
      isPriority: true,
      guaranteedExposure: 15000,
      status: 'confirmed' as const,
      memo: '중요한 캠페인',
      slotType: 'Biz-core'
    },
    // 메인홈 전면배너 (Biz-core 자동 생성됨)
    {
      id: '7',
      majorCategory: '메인홈 전면배너',
      advertiserName: '메인 배너 광고',
      salesOwner: '김동현',
      startDate: getDateString(0), // 오늘 시작
      endDate: getDateString(2), // 2일 후 종료
      countries: ['대한민국'],
      continents: ['한국'],
      isPriority: true,
      guaranteedExposure: 8000,
      status: 'confirmed' as const,
      memo: '긴급 캠페인'
    },
    // 메인홈 전면배너의 Biz-core 1
    {
      id: '7-bizcore-1',
      majorCategory: '메인홈 전면배너',
      advertiserName: '메인 배너 광고 (Biz-core 1)',
      salesOwner: '김동현',
      startDate: getDateString(0),
      endDate: getDateString(2),
      countries: ['대한민국'],
      continents: ['한국'],
      isPriority: true,
      guaranteedExposure: 0,
      status: 'confirmed' as const,
      memo: '',
      slotType: 'Biz-core',
      slotOrder: 1,
      parentId: '7'
    },
    // 메인홈 전면배너의 Biz-core 2
    {
      id: '7-bizcore-2',
      majorCategory: '메인홈 전면배너',
      advertiserName: '메인 배너 광고 (Biz-core 2)',
      salesOwner: '김동현',
      startDate: getDateString(0),
      endDate: getDateString(2),
      countries: ['대한민국'],
      continents: ['한국'],
      isPriority: true,
      guaranteedExposure: 0,
      status: 'confirmed' as const,
      memo: '',
      slotType: 'Biz-core',
      slotOrder: 2,
      parentId: '7'
    },
    {
      id: '8',
      majorCategory: '검색퍼널',
      advertiserName: '검색 최적화 캠페인',
      salesOwner: '곽대영',
      startDate: getDateString(3), // 3일 후
      endDate: getDateString(6),
      countries: ['미국'],
      continents: ['북아메리카'],
      isPriority: false,
      guaranteedExposure: 5000,
      status: 'proposed' as const,
      memo: '검색 캠페인',
      slotType: '제안2'
    },
    {
      id: '9',
      majorCategory: '해외 여행 퍼널',
      advertiserName: '해외여행 프로모션',
      salesOwner: '김동현',
      startDate: getDateString(3), // 3일 후 (같은 날)
      endDate: getDateString(6),
      countries: ['중국', '대만'],
      continents: ['중국 / 일본', '홍콩 / 마카오 / 대만 / 싱가포르'],
      isPriority: true,
      guaranteedExposure: 20000,
      status: 'confirmed' as const,
      memo: '해외여행 시즌 캠페인',
      slotType: '타겟1'
    },
    // 개별 퍼널 샘플 데이터 추가
    {
      id: '10',
      majorCategory: '체크리스트',
      advertiserName: '체크리스트 광고',
      salesOwner: '김동현',
      startDate: getDateString(1),
      endDate: getDateString(5),
      countries: ['일본'],
      continents: ['중국 / 일본'],
      isPriority: false,
      guaranteedExposure: 8000,
      status: 'confirmed' as const,
      memo: '체크리스트 타겟 광고',
      slotType: '타겟2'
    },
    {
      id: '11',
      majorCategory: '숏컷',
      advertiserName: '숏컷 프로모션',
      salesOwner: '곽대영',
      startDate: getDateString(2),
      endDate: getDateString(4),
      countries: ['대한민국'],
      continents: ['한국'],
      isPriority: false,
      guaranteedExposure: 5000,
      status: 'proposed' as const,
      memo: '숏컷 광고',
      slotType: '타겟3'
    },
    {
      id: '12',
      majorCategory: '메인홈 배너',
      advertiserName: '메인홈 배너 캠페인',
      salesOwner: '김동현',
      startDate: getDateString(1),
      endDate: getDateString(3),
      countries: ['미국', '영국'],
      continents: ['북아메리카', '서유럽'],
      isPriority: true,
      guaranteedExposure: 15000,
      status: 'confirmed' as const,
      memo: '메인홈 배너 광고',
      slotType: '타겟1'
    },
    // 인터랙티브 타겟 슬롯 샘플 추가
    {
      id: '13',
      majorCategory: '인터랙티브',
      advertiserName: '인터랙티브 타겟4 광고',
      salesOwner: '곽대영',
      startDate: getDateString(2),
      endDate: getDateString(5),
      countries: ['일본', '중국'],
      continents: ['중국 / 일본'],
      isPriority: false,
      guaranteedExposure: 6000,
      status: 'proposed' as const,
      memo: '인터랙티브 타겟4',
      slotType: '타겟4'
    },
    {
      id: '14',
      majorCategory: '인터랙티브',
      advertiserName: '인터랙티브 타겟5 광고',
      salesOwner: '김동현',
      startDate: getDateString(1),
      endDate: getDateString(4),
      countries: ['대한민국'],
      continents: ['한국'],
      isPriority: true,
      guaranteedExposure: 8000,
      status: 'confirmed' as const,
      memo: '인터랙티브 타겟5',
      slotType: '타겟5'
    },
    {
      id: '15',
      majorCategory: '국내 여행 퍼널',
      advertiserName: '국내여행 프로모션',
      salesOwner: '곽대영',
      startDate: getDateString(0),
      endDate: getDateString(3),
      countries: ['대한민국'],
      continents: ['한국'],
      isPriority: false,
      guaranteedExposure: 12000,
      status: 'confirmed' as const,
      memo: '국내여행 패키지',
      slotType: '타겟2'
    },
    // 추가 CRM 데이터들
    {
      id: '16',
      majorCategory: '친구톡',
      advertiserName: '친구톡 이벤트',
      salesOwner: '김동현',
      startDate: getDateString(-1),
      endDate: getDateString(2),
      countries: ['대한민국', '일본'],
      continents: ['한국', '중국 / 일본'],
      isPriority: false,
      guaranteedExposure: 5000,
      status: 'confirmed' as const,
      memo: '친구톡 프로모션',
      slotType: '타겟1'
    },
    {
      id: '17',
      majorCategory: '앱푸시',
      advertiserName: '푸시 알림 캠페인',
      salesOwner: '곽대영',
      startDate: getDateString(1),
      endDate: getDateString(4),
      countries: ['중국', '대만', '홍콩'],
      continents: ['중국 / 일본', '홍콩 / 마카오 / 대만 / 싱가포르'],
      isPriority: true,
      guaranteedExposure: 8000,
      status: 'confirmed' as const,
      memo: '중요 푸시',
      slotType: '타겟2'
    },
    {
      id: '18',
      majorCategory: '메시지 광고',
      advertiserName: 'SMS 마케팅',
      salesOwner: '김동현',
      startDate: getDateString(0),
      endDate: getDateString(3),
      countries: ['베트남', '필리핀', '태국'],
      continents: ['동남아시아'],
      isPriority: false,
      guaranteedExposure: 6000,
      status: 'proposed' as const,
      memo: 'SMS 광고',
      slotType: '제안1'
    }
  ];
};

export const mockAdData: AdData[] = generateMockData(); 