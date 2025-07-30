// 간소화된 3개 테이블 스키마 타입 정의

export interface Database {
  public: {
    Tables: {
      // 담당자 테이블
      sales_owners: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          department: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          department?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          department?: string | null;
          created_at?: string;
        };
      };
      
      // 국가 테이블
      countries: {
        Row: {
          id: string;
          name: string;
          continent: string;
          code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          continent: string;
          code?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          continent?: string;
          code?: string | null;
          created_at?: string;
        };
      };
      
      // 광고 테이블
      ads: {
        Row: {
          id: string;
          major_category: string;
          minor_category: string | null;
          advertiser_name: string;
          sales_owner_id: string | null;
          start_date: string;
          end_date: string;
          countries: string[];
          continents: string[];
          is_priority: boolean;
          guaranteed_exposure: number;
          status: 'proposed' | 'confirmed';
          memo: string;
          slot_type: string;
          slot_order: number | null;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          major_category: string;
          minor_category?: string | null;
          advertiser_name: string;
          sales_owner_id?: string | null;
          start_date: string;
          end_date: string;
          countries?: string[];
          continents?: string[];
          is_priority?: boolean;
          guaranteed_exposure: number;
          status: 'proposed' | 'confirmed';
          memo?: string;
          slot_type: string;
          slot_order?: number | null;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          major_category?: string;
          minor_category?: string | null;
          advertiser_name?: string;
          sales_owner_id?: string | null;
          start_date?: string;
          end_date?: string;
          countries?: string[];
          continents?: string[];
          is_priority?: boolean;
          guaranteed_exposure?: number;
          status?: 'proposed' | 'confirmed';
          memo?: string;
          slot_type?: string;
          slot_order?: number | null;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}