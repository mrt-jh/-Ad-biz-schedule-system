-- =====================================================
-- 개선된 광고 스케줄링 시스템 데이터베이스 스키마
-- =====================================================

-- 1. 광고주 테이블
CREATE TABLE advertisers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  company_type VARCHAR(50) NOT NULL, -- 'airline', 'hotel', 'ota', 'platform'
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 담당자 테이블
CREATE TABLE sales_owners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 카테고리 테이블 (퍼널 구조)
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id),
  funnel_type VARCHAR(50) NOT NULL, -- 'individual', 'main', 'package', 'crm'
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 구좌 타입 테이블
CREATE TABLE slot_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id),
  max_slots INTEGER DEFAULT 1,
  priority_order INTEGER DEFAULT 0,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 국가 테이블
CREATE TABLE countries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(3) NOT NULL UNIQUE, -- ISO 3166-1 alpha-3
  name VARCHAR(100) NOT NULL,
  continent VARCHAR(50) NOT NULL,
  region VARCHAR(50),
  population BIGINT,
  gdp_per_capita DECIMAL(15,2),
  internet_users_percentage DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 가격 정보 테이블
CREATE TABLE pricing_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id),
  slot_type_id UUID REFERENCES slot_types(id),
  country_id UUID REFERENCES countries(id),
  daily_max_impressions INTEGER NOT NULL,
  ctr DECIMAL(5,4) NOT NULL, -- Click Through Rate
  cpc DECIMAL(10,2), -- Cost Per Click
  cpm DECIMAL(10,2), -- Cost Per Mille
  effective_date DATE NOT NULL,
  expiry_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slot_type_id, country_id, effective_date)
);

-- 7. 광고 캠페인 테이블
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  advertiser_id UUID REFERENCES advertisers(id) NOT NULL,
  sales_owner_id UUID REFERENCES sales_owners(id) NOT NULL,
  category_id UUID REFERENCES categories(id) NOT NULL,
  description TEXT,
  budget DECIMAL(15,2),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'proposed', 'confirmed', 'active', 'paused', 'completed', 'cancelled')),
  priority_level INTEGER DEFAULT 0, -- 0: normal, 1: high, 2: urgent
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (end_date >= start_date)
);

-- 8. 광고 스케줄 테이블 (핵심 테이블)
CREATE TABLE ad_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) NOT NULL,
  slot_type_id UUID REFERENCES slot_types(id) NOT NULL,
  slot_order INTEGER DEFAULT 1, -- Biz-core의 경우 1, 2 등
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guaranteed_exposure INTEGER NOT NULL,
  actual_exposure INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'paused', 'completed', 'cancelled')),
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (end_date >= start_date)
);

-- 9. 광고 타겟팅 테이블 (다대다 관계)
CREATE TABLE ad_targeting (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_schedule_id UUID REFERENCES ad_schedules(id) ON DELETE CASCADE,
  country_id UUID REFERENCES countries(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ad_schedule_id, country_id)
);

-- 10. Biz-core 연관 테이블
CREATE TABLE bizcore_relations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  main_ad_schedule_id UUID REFERENCES ad_schedules(id) ON DELETE CASCADE,
  bizcore_ad_schedule_id UUID REFERENCES ad_schedules(id) ON DELETE CASCADE,
  relation_type VARCHAR(20) DEFAULT 'primary' CHECK (relation_type IN ('primary', 'secondary')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(main_ad_schedule_id, bizcore_ad_schedule_id)
);

-- 11. 노출수 이력 테이블
CREATE TABLE exposure_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_schedule_id UUID REFERENCES ad_schedules(id) NOT NULL,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  spend DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ad_schedule_id, date)
);

-- 12. 알림 테이블
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'exposure_limit', 'schedule_conflict', 'campaign_end'
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  target_user_id UUID, -- 향후 사용자 테이블과 연결
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 인덱스 생성
-- =====================================================

-- 성능 최적화를 위한 인덱스
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_advertiser ON campaigns(advertiser_id);
CREATE INDEX idx_ad_schedules_dates ON ad_schedules(start_date, end_date);
CREATE INDEX idx_ad_schedules_campaign ON ad_schedules(campaign_id);
CREATE INDEX idx_ad_schedules_status ON ad_schedules(status);
CREATE INDEX idx_pricing_rules_effective ON pricing_rules(effective_date, expiry_date);
CREATE INDEX idx_exposure_history_date ON exposure_history(date);
CREATE INDEX idx_categories_funnel ON categories(funnel_type);
CREATE INDEX idx_countries_continent ON countries(continent);

-- =====================================================
-- 트리거 함수
-- =====================================================

-- 업데이트 시간 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_advertisers_updated_at BEFORE UPDATE ON advertisers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_owners_updated_at BEFORE UPDATE ON sales_owners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON pricing_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ad_schedules_updated_at BEFORE UPDATE ON ad_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS (Row Level Security) 설정
-- =====================================================

ALTER TABLE advertisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE slot_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_targeting ENABLE ROW LEVEL SECURITY;
ALTER TABLE bizcore_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE exposure_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 개발용 정책 (모든 작업 허용)
CREATE POLICY "Allow all operations" ON advertisers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON sales_owners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON slot_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON countries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON pricing_rules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON ad_schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON ad_targeting FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON bizcore_relations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON exposure_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON notifications FOR ALL USING (true) WITH CHECK (true); 