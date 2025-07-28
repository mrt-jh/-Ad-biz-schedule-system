import { createClient } from '@supabase/supabase-js'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      advertisers: {
        Row: {
          id: string
          name: string
          company_type: string
          contact_email: string | null
          contact_phone: string | null
          status: 'active' | 'inactive' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          company_type: string
          contact_email?: string | null
          contact_phone?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          company_type?: string
          contact_email?: string | null
          contact_phone?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
      }
      sales_owners: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          department: string | null
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          department?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          department?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          funnel_type: string
          description: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          funnel_type: string
          description?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          funnel_type?: string
          description?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      slot_types: {
        Row: {
          id: string
          name: string
          category_id: string | null
          max_slots: number
          priority_order: number
          description: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category_id?: string | null
          max_slots?: number
          priority_order?: number
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category_id?: string | null
          max_slots?: number
          priority_order?: number
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      countries: {
        Row: {
          id: string
          code: string
          name: string
          continent: string
          region: string | null
          population: number | null
          gdp_per_capita: number | null
          internet_users_percentage: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          continent: string
          region?: string | null
          population?: number | null
          gdp_per_capita?: number | null
          internet_users_percentage?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          continent?: string
          region?: string | null
          population?: number | null
          gdp_per_capita?: number | null
          internet_users_percentage?: number | null
          is_active?: boolean
          created_at?: string
        }
      }
      pricing_rules: {
        Row: {
          id: string
          category_id: string | null
          slot_type_id: string | null
          country_id: string | null
          daily_max_impressions: number
          ctr: number
          cpc: number | null
          cpm: number | null
          effective_date: string
          expiry_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          slot_type_id?: string | null
          country_id?: string | null
          daily_max_impressions: number
          ctr: number
          cpc?: number | null
          cpm?: number | null
          effective_date: string
          expiry_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          slot_type_id?: string | null
          country_id?: string | null
          daily_max_impressions?: number
          ctr?: number
          cpc?: number | null
          cpm?: number | null
          effective_date?: string
          expiry_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          name: string
          advertiser_id: string
          sales_owner_id: string
          category_id: string
          description: string | null
          budget: number | null
          start_date: string
          end_date: string
          status:
            | 'draft'
            | 'proposed'
            | 'confirmed'
            | 'active'
            | 'paused'
            | 'completed'
            | 'cancelled'
          priority_level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          advertiser_id: string
          sales_owner_id: string
          category_id: string
          description?: string | null
          budget?: number | null
          start_date: string
          end_date: string
          status?:
            | 'draft'
            | 'proposed'
            | 'confirmed'
            | 'active'
            | 'paused'
            | 'completed'
            | 'cancelled'
          priority_level?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          advertiser_id?: string
          sales_owner_id?: string
          category_id?: string
          description?: string | null
          budget?: number | null
          start_date?: string
          end_date?: string
          status?:
            | 'draft'
            | 'proposed'
            | 'confirmed'
            | 'active'
            | 'paused'
            | 'completed'
            | 'cancelled'
          priority_level?: number
          created_at?: string
          updated_at?: string
        }
      }
      ad_schedules: {
        Row: {
          id: string
          campaign_id: string
          slot_type_id: string
          slot_order: number | null
          start_date: string
          end_date: string
          guaranteed_exposure: number
          actual_exposure: number | null
          status:
            | 'scheduled'
            | 'active'
            | 'paused'
            | 'completed'
            | 'cancelled'
          memo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          slot_type_id: string
          slot_order?: number | null
          start_date: string
          end_date: string
          guaranteed_exposure: number
          actual_exposure?: number | null
          status?:
            | 'scheduled'
            | 'active'
            | 'paused'
            | 'completed'
            | 'cancelled'
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          slot_type_id?: string
          slot_order?: number | null
          start_date?: string
          end_date?: string
          guaranteed_exposure?: number
          actual_exposure?: number | null
          status?:
            | 'scheduled'
            | 'active'
            | 'paused'
            | 'completed'
            | 'cancelled'
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ad_targeting: {
        Row: {
          id: string
          ad_schedule_id: string
          country_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ad_schedule_id: string
          country_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ad_schedule_id?: string
          country_id?: string | null
          created_at?: string
        }
      }
      bizcore_relations: {
        Row: {
          id: string
          main_ad_schedule_id: string
          bizcore_ad_schedule_id: string
          relation_type: 'primary' | 'secondary'
          created_at: string
        }
        Insert: {
          id?: string
          main_ad_schedule_id: string
          bizcore_ad_schedule_id: string
          relation_type?: 'primary' | 'secondary'
          created_at?: string
        }
        Update: {
          id?: string
          main_ad_schedule_id?: string
          bizcore_ad_schedule_id?: string
          relation_type?: 'primary' | 'secondary'
          created_at?: string
        }
      }
      exposure_history: {
        Row: {
          id: string
          ad_schedule_id: string
          date: string
          impressions: number
          clicks: number
          spend: number
          created_at: string
        }
        Insert: {
          id?: string
          ad_schedule_id: string
          date: string
          impressions?: number
          clicks?: number
          spend?: number
          created_at?: string
        }
        Update: {
          id?: string
          ad_schedule_id?: string
          date?: string
          impressions?: number
          clicks?: number
          spend?: number
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          type: string
          title: string
          message: string
          target_user_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          title: string
          message: string
          target_user_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          title?: string
          message?: string
          target_user_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
