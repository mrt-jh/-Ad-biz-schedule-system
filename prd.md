# 📌 광고사업팀 캘린더 등록 프로그램 PRD

## 1. 프로젝트 개요

**목표**:  
광고상품 및 지면별 집행 계획을 등록/조회/관리할 수 있는 캘린더 기반 스케줄링 시스템 구축  
- 제안/확정 상태 구분
- 지면/카테고리/담당자/국가 필터링
- Supabase DB + Next.js 프론트 + Vercel 배포

---

## 2. 주요 기능 정의

### 2.1 광고 등록
- 광고 제안 또는 확정 등록
- 입력 항목:
  - 광고 카테고리 (`category_id`)
  - 상품명 (`product_name`)
  - 광고주명 (`advertiser_name`)
  - 담당자 (`sales_owner_id`)
  - 집행 기간 (`start_date`, `end_date`)
  - 타겟 국가 (`country_id[]`)
  - 1순위 여부 (`is_priority`)
  - 보장 노출수 (`guaranteed_exposure`)
  - 상태 (`status`: `proposed` or `confirmed`)
  - 비고 (`memo`) - 선택

### 2.2 광고 리스트/관리
- 전체 광고 목록 조회 (제안/확정 필터 가능)
- 검색 필터: 카테고리, 담당자, 국가, 상태

### 2.3 광고 캘린더 뷰
- `FullCalendar.js` 기반 일별 광고 집행 스케줄 표시
- 상태별 색상 구분 (`제안`: 흐림, `확정`: 강조색)
- 중복 블로킹: `확정` 일정끼리는 겹침 불가

### 2.4 광고 상세
- 광고 상세 정보 및 편집 (권한 필요 시 제한 가능)
- 수정/삭제 기능 (RLS 설정 가능)

---

## 3. 시스템 아키텍처

```txt
[Client: Next.js (Vercel)]
  └─ 광고 등록/조회/캘린더 화면
        ↓ (API 요청)
[Backend: Supabase (PostgreSQL)]
  ├─ ad_schedule
  ├─ sales_owner
  ├─ funnel_category
  ├─ country_list
  └─ ad_schedule_country_map
