import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'admin' | 'moderator' | 'employer'

export interface User {
  id: string
  email: string
  full_name?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Worksite {
  id: string
  name: string
  description?: string
  location?: string
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled'
  start_date?: string
  end_date?: string
  budget?: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface Schedule {
  id: string
  worksite_id: string
  title: string
  description?: string
  start_date: string
  end_date: string
  assigned_to?: string
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
  created_by: string
  created_at: string
  updated_at: string
}

export interface Cost {
  id: string
  worksite_id: string
  category: string
  description?: string
  amount: number
  date: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface ProgressRecord {
  id: string
  worksite_id: string
  schedule_id?: string
  title: string
  description?: string
  percentage?: number
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
  recorded_date: string
  created_by: string
  created_at: string
  updated_at: string
}
