# Calendar UI - 광고 스케줄링 시스템

Next.js 15와 TypeScript로 구축된 광고 스케줄링 및 관리 시스템입니다.

## 🏗️ 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트들
│   ├── ui/              # 기본 UI 컴포넌트
│   │   ├── SortableItem.tsx
│   │   ├── CountrySelector.tsx
│   │   └── ContinentCountrySelector.tsx
│   └── views/           # 뷰 컴포넌트
│       ├── SpreadsheetView.tsx
│       └── FunnelScheduleView.tsx
├── constants/           # 상수 정의
│   └── adConstants.ts   # 광고 관련 상수 및 타입
├── data/               # 데이터 파일들
│   ├── mockData.ts     # 목업 데이터
│   └── pricing.json    # 가격 데이터
├── utils/              # 유틸리티 함수들
│   ├── formatters.ts   # 포맷팅 함수들
│   └── colors.ts       # 색상 관련 함수들
├── hooks/              # 커스텀 훅들 (향후 확장)
├── types/              # 타입 정의 (향후 확장)
├── page.tsx            # 메인 페이지
├── layout.tsx          # 레이아웃
└── globals.css         # 전역 스타일
```

## 🚀 주요 기능

### 1. 광고 스케줄링
- 스프레드시트 뷰로 광고 일정 관리
- 퍼널 스케줄 뷰로 광고 플로우 관리
- 드래그 앤 드롭으로 일정 조정

### 2. 국가/대륙 선택
- 대륙별 국가 그룹화
- 다중 선택 지원
- 실시간 필터링

### 3. 데이터 관리
- 광고주별 색상 구분
- 상태별 필터링 (제안/확정)
- 우선순위 표시

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에 Supabase URL과 API 키를 입력하세요

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 🗄️ 데이터베이스 설정

### Supabase 설정
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase-schema.sql` 파일의 내용을 실행
3. Settings > API에서 URL과 anon key 복사
4. `.env.local` 파일에 환경 변수 설정:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Blue (#3B82F6)
- **Success**: Emerald (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)
- **Secondary**: Violet (#8B5CF6)

### 상태 색상
- **확정**: Green
- **제안**: Yellow
- **우선순위**: Red

## 📊 데이터 구조

### AdData 인터페이스
```typescript
interface AdData {
  id: string;
  majorCategory: string;
  minorCategory?: string;
  advertiserName: string;
  salesOwner: string;
  startDate: string;
  endDate: string;
  countries: string[];
  continents: string[];
  isPriority: boolean;
  guaranteedExposure: number;
  status: 'proposed' | 'confirmed';
  memo: string;
  slotType?: string;
  slotOrder?: number;
  parentId?: string;
}
```

## 🔧 개발 가이드라인

### 컴포넌트 작성 규칙
1. **UI 컴포넌트**: 재사용 가능한 기본 컴포넌트
2. **뷰 컴포넌트**: 특정 페이지나 기능을 담당하는 컴포넌트
3. **타입 정의**: constants/adConstants.ts에서 중앙 관리
4. **유틸리티 함수**: 기능별로 분리하여 utils/ 디렉토리에 배치

### 파일 명명 규칙
- **컴포넌트**: PascalCase (예: CountrySelector.tsx)
- **유틸리티**: camelCase (예: formatters.ts)
- **상수**: camelCase (예: adConstants.ts)

## 🚀 향후 계획

- [ ] 커스텀 훅 추가 (useAdData, useFilters 등)
- [ ] API 연동
- [ ] 실시간 데이터 동기화
- [ ] 다크 모드 지원
- [ ] 반응형 디자인 개선
- [ ] 테스트 코드 작성

## 📝 라이선스

MIT License
// Updated for Node.js version compatibility
