-- =====================================================
-- 개선된 스키마용 샘플 데이터
-- =====================================================

-- 1. 광고주 데이터
INSERT INTO advertisers (name, company_type, contact_email, contact_phone) VALUES
('대한항공', 'airline', 'marketing@koreanair.com', '+82-2-2656-2000'),
('아시아나항공', 'airline', 'ads@asiana.co.kr', '+82-2-2669-2000'),
('제주항공', 'airline', 'biz@jejuair.net', '+82-2-2669-2000'),
('에어서울', 'airline', 'marketing@airseoul.com', '+82-2-2669-2000'),
('티웨이항공', 'airline', 'biz@twayair.com', '+82-2-2669-2000'),
('진에어', 'airline', 'marketing@jinair.com', '+82-2-2669-2000'),
('에어부산', 'airline', 'biz@airbusan.com', '+82-2-2669-2000'),
('스카이스캐너', 'ota', 'partnership@skyscanner.com', '+44-20-7123-4567'),
('트립닷컴', 'ota', 'biz@trip.com', '+1-800-916-6666'),
('호텔스닷컴', 'ota', 'partnership@hotels.com', '+1-800-246-8357'),
('야놀자', 'ota', 'biz@yanolja.com', '+82-2-6956-1000'),
('카카오', 'platform', 'biz@kakao.com', '+82-2-3000-0000'),
('네이버', 'platform', 'biz@naver.com', '+82-2-3484-0000'),
('구글', 'platform', 'ads@google.com', '+1-650-253-0000'),
('페이스북', 'platform', 'biz@facebook.com', '+1-650-543-4800'),
('인스타그램', 'platform', 'biz@instagram.com', '+1-650-543-4800');

-- 2. 담당자 데이터
INSERT INTO sales_owners (name, email, phone, department) VALUES
('김영희', 'kim.younghee@company.com', '+82-10-1234-5678', 'Sales Team A'),
('박철수', 'park.chulsoo@company.com', '+82-10-2345-6789', 'Sales Team B'),
('이민수', 'lee.minsu@company.com', '+82-10-3456-7890', 'Sales Team A'),
('최지영', 'choi.jiyoung@company.com', '+82-10-4567-8901', 'Sales Team B'),
('정수진', 'jung.sujin@company.com', '+82-10-5678-9012', 'Sales Team C'),
('한동훈', 'han.donghoon@company.com', '+82-10-6789-0123', 'Sales Team A');

-- 3. 카테고리 데이터 (퍼널 구조)
INSERT INTO categories (name, parent_id, funnel_type, description, sort_order) VALUES
-- 개별 퍼널
('메인홈 팝업', NULL, 'individual', '메인홈 진입 시 팝업 광고', 1),
('체크리스트', NULL, 'individual', '여행 준비물 체크리스트', 2),
('숏컷', NULL, 'individual', '앱 숏컷 광고', 3),
('숏컷 스플래시', NULL, 'individual', '숏컷 진입 시 스플래시', 4),
('앱진입 스플래시 배너', NULL, 'individual', '앱 진입 시 배너', 5),
('메인홈 탭', NULL, 'individual', '메인홈 탭 광고', 6),
('메인홈 피드', NULL, 'individual', '메인홈 피드 광고', 7),
('인앱 페이지 제작', NULL, 'individual', '인앱 페이지 제작 서비스', 8),

-- 메인 퍼널
('인터랙티브', NULL, 'main', '인터랙티브 광고', 9),
('메인홈 전면배너', NULL, 'main', '메인홈 전면 배너', 10),
('메인홈 배너', NULL, 'main', '메인홈 일반 배너', 11),

-- 퍼널 패키지
('검색 퍼널', NULL, 'package', '검색 기반 퍼널', 12),
('해외 여행 퍼널', NULL, 'package', '해외 여행 패키지', 13),
('여행자 퍼널', NULL, 'package', '여행자 타겟 퍼널', 14),
('국내 여행 퍼널', NULL, 'package', '국내 여행 패키지', 15),

-- CRM
('친구톡', NULL, 'crm', '카카오톡 친구톡', 16),
('앱푸시', NULL, 'crm', '앱 푸시 알림', 17),
('메시지 광고', NULL, 'crm', 'SMS/MMS 광고', 18);

-- 4. 구좌 타입 데이터
INSERT INTO slot_types (name, category_id, max_slots, priority_order, description) VALUES
-- 개별 퍼널 구좌
('1순위', (SELECT id FROM categories WHERE name = '메인홈 팝업'), 1, 1, '최우선 팝업'),
('2순위', (SELECT id FROM categories WHERE name = '메인홈 팝업'), 1, 2, '차순위 팝업'),
('타겟1', (SELECT id FROM categories WHERE name = '체크리스트'), 1, 1, '체크리스트 타겟1'),
('타겟2', (SELECT id FROM categories WHERE name = '체크리스트'), 1, 2, '체크리스트 타겟2'),
('타겟3', (SELECT id FROM categories WHERE name = '체크리스트'), 1, 3, '체크리스트 타겟3'),
('타겟1', (SELECT id FROM categories WHERE name = '숏컷'), 1, 1, '숏컷 타겟1'),
('광고 숏컷', (SELECT id FROM categories WHERE name = '숏컷 스플래시'), 1, 1, '숏컷 스플래시'),
('타겟1', (SELECT id FROM categories WHERE name = '앱진입 스플래시 배너'), 1, 1, '앱진입 배너'),
('타겟1', (SELECT id FROM categories WHERE name = '메인홈 탭'), 1, 1, '메인홈 탭'),
('타겟1', (SELECT id FROM categories WHERE name = '메인홈 피드'), 1, 1, '메인홈 피드'),
('타겟1', (SELECT id FROM categories WHERE name = '인앱 페이지 제작'), 1, 1, '인앱 페이지'),

-- 메인 퍼널 구좌
('타겟1', (SELECT id FROM categories WHERE name = '인터랙티브'), 1, 1, '인터랙티브 타겟1'),
('타겟2', (SELECT id FROM categories WHERE name = '인터랙티브'), 1, 2, '인터랙티브 타겟2'),
('타겟3', (SELECT id FROM categories WHERE name = '인터랙티브'), 1, 3, '인터랙티브 타겟3'),
('타겟4', (SELECT id FROM categories WHERE name = '인터랙티브'), 1, 4, '인터랙티브 타겟4'),
('타겟5', (SELECT id FROM categories WHERE name = '인터랙티브'), 1, 5, '인터랙티브 타겟5'),
('타겟6', (SELECT id FROM categories WHERE name = '인터랙티브'), 1, 6, '인터랙티브 타겟6'),
('타겟7', (SELECT id FROM categories WHERE name = '인터랙티브'), 1, 7, '인터랙티브 타겟7'),
('Biz-core', (SELECT id FROM categories WHERE name = '인터랙티브'), 2, 8, '인터랙티브 Biz-core'),
('제안1', (SELECT id FROM categories WHERE name = '인터랙티브'), 1, 9, '인터랙티브 제안1'),
('제안2', (SELECT id FROM categories WHERE name = '인터랙티브'), 1, 10, '인터랙티브 제안2'),

('타겟1', (SELECT id FROM categories WHERE name = '메인홈 전면배너'), 1, 1, '전면배너 타겟1'),
('타겟2', (SELECT id FROM categories WHERE name = '메인홈 전면배너'), 1, 2, '전면배너 타겟2'),
('타겟3', (SELECT id FROM categories WHERE name = '메인홈 전면배너'), 1, 3, '전면배너 타겟3'),
('Biz-core', (SELECT id FROM categories WHERE name = '메인홈 전면배너'), 2, 4, '전면배너 Biz-core'),
('제안1', (SELECT id FROM categories WHERE name = '메인홈 전면배너'), 1, 5, '전면배너 제안1'),
('제안2', (SELECT id FROM categories WHERE name = '메인홈 전면배너'), 1, 6, '전면배너 제안2'),

('타겟1', (SELECT id FROM categories WHERE name = '메인홈 배너'), 1, 1, '배너 타겟1'),
('타겟2', (SELECT id FROM categories WHERE name = '메인홈 배너'), 1, 2, '배너 타겟2'),
('타겟3', (SELECT id FROM categories WHERE name = '메인홈 배너'), 1, 3, '배너 타겟3'),
('제안1', (SELECT id FROM categories WHERE name = '메인홈 배너'), 1, 4, '배너 제안1'),
('제안2', (SELECT id FROM categories WHERE name = '메인홈 배너'), 1, 5, '배너 제안2'),

-- 퍼널 패키지 구좌
('타겟1', (SELECT id FROM categories WHERE name = '검색 퍼널'), 1, 1, '검색 타겟1'),
('타겟2', (SELECT id FROM categories WHERE name = '검색 퍼널'), 1, 2, '검색 타겟2'),
('타겟3', (SELECT id FROM categories WHERE name = '검색 퍼널'), 1, 3, '검색 타겟3'),
('제안1', (SELECT id FROM categories WHERE name = '검색 퍼널'), 1, 4, '검색 제안1'),
('제안2', (SELECT id FROM categories WHERE name = '검색 퍼널'), 1, 5, '검색 제안2'),

('타겟1', (SELECT id FROM categories WHERE name = '해외 여행 퍼널'), 1, 1, '해외여행 타겟1'),
('타겟2', (SELECT id FROM categories WHERE name = '해외 여행 퍼널'), 1, 2, '해외여행 타겟2'),
('타겟3', (SELECT id FROM categories WHERE name = '해외 여행 퍼널'), 1, 3, '해외여행 타겟3'),
('제안1', (SELECT id FROM categories WHERE name = '해외 여행 퍼널'), 1, 4, '해외여행 제안1'),
('제안2', (SELECT id FROM categories WHERE name = '해외 여행 퍼널'), 1, 5, '해외여행 제안2'),

('타겟1', (SELECT id FROM categories WHERE name = '여행자 퍼널'), 1, 1, '여행자 타겟1'),
('타겟2', (SELECT id FROM categories WHERE name = '여행자 퍼널'), 1, 2, '여행자 타겟2'),
('타겟3', (SELECT id FROM categories WHERE name = '여행자 퍼널'), 1, 3, '여행자 타겟3'),
('제안1', (SELECT id FROM categories WHERE name = '여행자 퍼널'), 1, 4, '여행자 제안1'),
('제안2', (SELECT id FROM categories WHERE name = '여행자 퍼널'), 1, 5, '여행자 제안2'),

('타겟1', (SELECT id FROM categories WHERE name = '국내 여행 퍼널'), 1, 1, '국내여행 타겟1'),
('타겟2', (SELECT id FROM categories WHERE name = '국내 여행 퍼널'), 1, 2, '국내여행 타겟2'),
('타겟3', (SELECT id FROM categories WHERE name = '국내 여행 퍼널'), 1, 3, '국내여행 타겟3'),
('제안1', (SELECT id FROM categories WHERE name = '국내 여행 퍼널'), 1, 4, '국내여행 제안1'),
('제안2', (SELECT id FROM categories WHERE name = '국내 여행 퍼널'), 1, 5, '국내여행 제안2'),

-- CRM 구좌
('캠페인1', (SELECT id FROM categories WHERE name = '친구톡'), 1, 1, '친구톡 캠페인1'),
('캠페인2', (SELECT id FROM categories WHERE name = '친구톡'), 1, 2, '친구톡 캠페인2'),
('캠페인3', (SELECT id FROM categories WHERE name = '친구톡'), 1, 3, '친구톡 캠페인3'),

('캠페인1', (SELECT id FROM categories WHERE name = '앱푸시'), 1, 1, '앱푸시 캠페인1'),
('캠페인2', (SELECT id FROM categories WHERE name = '앱푸시'), 1, 2, '앱푸시 캠페인2'),
('캠페인3', (SELECT id FROM categories WHERE name = '앱푸시'), 1, 3, '앱푸시 캠페인3'),

('캠페인1', (SELECT id FROM categories WHERE name = '메시지 광고'), 1, 1, '메시지 캠페인1'),
('캠페인2', (SELECT id FROM categories WHERE name = '메시지 광고'), 1, 2, '메시지 캠페인2'),
('캠페인3', (SELECT id FROM categories WHERE name = '메시지 광고'), 1, 3, '메시지 캠페인3');

-- 5. 국가 데이터 (주요 국가들)
INSERT INTO countries (code, name, continent, region, population, gdp_per_capita, internet_users_percentage) VALUES
('KOR', '대한민국', '아시아', '동아시아', 51269185, 35000.00, 96.50),
('JPN', '일본', '아시아', '동아시아', 125836021, 39312.00, 93.00),
('CHN', '중국', '아시아', '동아시아', 1439323776, 12556.00, 70.40),
('THA', '태국', '아시아', '동남아시아', 69799978, 7274.00, 82.00),
('VNM', '베트남', '아시아', '동남아시아', 97338579, 4110.00, 73.10),
('USA', '미국', '북아메리카', '북아메리카', 331002651, 69287.00, 90.00),
('CAN', '캐나다', '북아메리카', '북아메리카', 37742154, 51989.00, 95.00),
('GBR', '영국', '유럽', '서유럽', 67886011, 46510.00, 95.00),
('DEU', '독일', '유럽', '서유럽', 83783942, 51217.00, 94.00),
('FRA', '프랑스', '유럽', '서유럽', 65273511, 43658.00, 92.00),
('ITA', '이탈리아', '유럽', '남유럽', 60461826, 35228.00, 85.00),
('ESP', '스페인', '유럽', '남유럽', 46754778, 30103.00, 91.00),
('AUS', '호주', '오세아니아', '오세아니아', 25499884, 63266.00, 88.20),
('NZL', '뉴질랜드', '오세아니아', '오세아니아', 5084300, 48219.00, 93.00);

-- 6. 가격 정보 데이터 (주요 조합들)
INSERT INTO pricing_rules (category_id, slot_type_id, country_id, daily_max_impressions, ctr, cpc, cpm, effective_date) VALUES
-- 메인홈 팝업 가격
((SELECT id FROM categories WHERE name = '메인홈 팝업'), 
 (SELECT id FROM slot_types WHERE name = '1순위' AND category_id = (SELECT id FROM categories WHERE name = '메인홈 팝업')),
 (SELECT id FROM countries WHERE code = 'KOR'), 1000000, 0.0250, 500.00, 12500.00, '2024-01-01'),
((SELECT id FROM categories WHERE name = '메인홈 팝업'), 
 (SELECT id FROM slot_types WHERE name = '2순위' AND category_id = (SELECT id FROM categories WHERE name = '메인홈 팝업')),
 (SELECT id FROM countries WHERE code = 'KOR'), 800000, 0.0200, 450.00, 9000.00, '2024-01-01'),

-- 인터랙티브 가격
((SELECT id FROM categories WHERE name = '인터랙티브'), 
 (SELECT id FROM slot_types WHERE name = '타겟1' AND category_id = (SELECT id FROM categories WHERE name = '인터랙티브')),
 (SELECT id FROM countries WHERE code = 'KOR'), 800000, 0.0150, 800.00, 12000.00, '2024-01-01'),
((SELECT id FROM categories WHERE name = '인터랙티브'), 
 (SELECT id FROM slot_types WHERE name = 'Biz-core' AND category_id = (SELECT id FROM categories WHERE name = '인터랙티브')),
 (SELECT id FROM countries WHERE code = 'KOR'), 500000, 0.0200, 1000.00, 20000.00, '2024-01-01'),

-- 메인홈 전면배너 가격
((SELECT id FROM categories WHERE name = '메인홈 전면배너'), 
 (SELECT id FROM slot_types WHERE name = '타겟1' AND category_id = (SELECT id FROM categories WHERE name = '메인홈 전면배너')),
 (SELECT id FROM countries WHERE code = 'KOR'), 1000000, 0.0100, 300.00, 3000.00, '2024-01-01'),

-- 검색 퍼널 가격
((SELECT id FROM categories WHERE name = '검색 퍼널'), 
 (SELECT id FROM slot_types WHERE name = '타겟1' AND category_id = (SELECT id FROM categories WHERE name = '검색 퍼널')),
 (SELECT id FROM countries WHERE code = 'KOR'), 300000, 0.0200, 600.00, 12000.00, '2024-01-01'),

-- CRM 가격
((SELECT id FROM categories WHERE name = '친구톡'), 
 (SELECT id FROM slot_types WHERE name = '캠페인1' AND category_id = (SELECT id FROM categories WHERE name = '친구톡')),
 (SELECT id FROM countries WHERE code = 'KOR'), 50000, 0.0800, 2000.00, 160000.00, '2024-01-01'); 