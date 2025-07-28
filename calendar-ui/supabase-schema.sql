-- 광고 테이블 생성
CREATE TABLE ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  major_category TEXT NOT NULL,
  minor_category TEXT,
  advertiser_name TEXT NOT NULL,
  sales_owner TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  countries TEXT[] NOT NULL DEFAULT '{}',
  continents TEXT[] NOT NULL DEFAULT '{}',
  is_priority BOOLEAN NOT NULL DEFAULT false,
  guaranteed_exposure INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('proposed', 'confirmed')),
  memo TEXT NOT NULL DEFAULT '',
  slot_type TEXT CHECK (slot_type IN ('타겟1', '타겟2', '타겟3', '타겟4', '타겟5', '타겟6', '타겟7', '제안1', '제안2', 'Biz-core')),
  slot_order INTEGER,
  parent_id UUID REFERENCES ads(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 가격 정보 테이블 생성
CREATE TABLE pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  placement TEXT NOT NULL,
  target TEXT NOT NULL,
  daily_max_impression INTEGER NOT NULL,
  ctr DECIMAL(5,4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_ads_start_date ON ads(start_date);
CREATE INDEX idx_ads_end_date ON ads(end_date);
CREATE INDEX idx_ads_advertiser_name ON ads(advertiser_name);
CREATE INDEX idx_ads_status ON ads(status);
CREATE INDEX idx_ads_sales_owner ON ads(sales_owner);
CREATE INDEX idx_ads_parent_id ON ads(parent_id);

-- 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 업데이트 트리거 생성
CREATE TRIGGER update_ads_updated_at 
  BEFORE UPDATE ON ads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기/쓰기 가능하도록 정책 설정 (개발용)
CREATE POLICY "Allow all operations on ads" ON ads
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on pricing" ON pricing
  FOR ALL USING (true) WITH CHECK (true);

-- 샘플 데이터 삽입 (선택사항)
INSERT INTO pricing (placement, target, daily_max_impression, ctr) VALUES
('메인홈 팝업', '1순위', 1000000, 0.0250),
('메인홈 팝업', '2순위', 800000, 0.0200),
('체크리스트', '타겟1', 500000, 0.0300),
('체크리스트', '타겟2', 400000, 0.0250),
('체크리스트', '타겟3', 300000, 0.0200),
('숏컷', '타겟1', 200000, 0.0350),
('숏컷 스플래시', '광고 숏컷', 150000, 0.0400),
('앱진입 스플래시 배너', '타겟1', 300000, 0.0300),
('메인홈 탭', '타겟1', 400000, 0.0250),
('메인홈 피드', '타겟1', 600000, 0.0200),
('인앱 페이지 제작', '타겟1', 100000, 0.0500),
('인터랙티브', '타겟1', 800000, 0.0150),
('인터랙티브', '타겟2', 600000, 0.0120),
('인터랙티브', '타겟3', 400000, 0.0100),
('인터랙티브', '타겟4', 300000, 0.0080),
('인터랙티브', '타겟5', 200000, 0.0060),
('인터랙티브', '타겟6', 150000, 0.0050),
('인터랙티브', '타겟7', 100000, 0.0040),
('인터랙티브', 'Biz-core', 500000, 0.0200),
('인터랙티브', '제안1', 200000, 0.0150),
('인터랙티브', '제안2', 150000, 0.0120),
('메인홈 전면배너', '타겟1', 1000000, 0.0100),
('메인홈 전면배너', '타겟2', 800000, 0.0080),
('메인홈 전면배너', '타겟3', 600000, 0.0060),
('메인홈 전면배너', 'Biz-core', 400000, 0.0150),
('메인홈 전면배너', '제안1', 300000, 0.0120),
('메인홈 전면배너', '제안2', 200000, 0.0100),
('메인홈 배너', '타겟1', 500000, 0.0080),
('메인홈 배너', '타겟2', 400000, 0.0060),
('메인홈 배너', '타겟3', 300000, 0.0050),
('메인홈 배너', '제안1', 200000, 0.0100),
('메인홈 배너', '제안2', 150000, 0.0080),
('검색 퍼널', '타겟1', 300000, 0.0200),
('검색 퍼널', '타겟2', 250000, 0.0180),
('검색 퍼널', '타겟3', 200000, 0.0150),
('검색 퍼널', '제안1', 150000, 0.0250),
('검색 퍼널', '제안2', 100000, 0.0200),
('해외 여행 퍼널', '타겟1', 200000, 0.0250),
('해외 여행 퍼널', '타겟2', 150000, 0.0200),
('해외 여행 퍼널', '타겟3', 100000, 0.0150),
('해외 여행 퍼널', '제안1', 80000, 0.0300),
('해외 여행 퍼널', '제안2', 60000, 0.0250),
('여행자 퍼널', '타겟1', 180000, 0.0220),
('여행자 퍼널', '타겟2', 120000, 0.0180),
('여행자 퍼널', '타겟3', 80000, 0.0150),
('여행자 퍼널', '제안1', 60000, 0.0280),
('여행자 퍼널', '제안2', 40000, 0.0220),
('국내 여행 퍼널', '타겟1', 250000, 0.0180),
('국내 여행 퍼널', '타겟2', 200000, 0.0150),
('국내 여행 퍼널', '타겟3', 150000, 0.0120),
('국내 여행 퍼널', '제안1', 100000, 0.0220),
('국내 여행 퍼널', '제안2', 80000, 0.0180),
('친구톡', '캠페인1', 50000, 0.0800),
('친구톡', '캠페인2', 40000, 0.0700),
('친구톡', '캠페인3', 30000, 0.0600),
('앱푸시', '캠페인1', 100000, 0.0500),
('앱푸시', '캠페인2', 80000, 0.0450),
('앱푸시', '캠페인3', 60000, 0.0400),
('메시지 광고', '캠페인1', 30000, 0.1000),
('메시지 광고', '캠페인2', 25000, 0.0900),
('메시지 광고', '캠페인3', 20000, 0.0800); 