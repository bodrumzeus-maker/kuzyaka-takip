// Gerçek Supabase veri yapısına göre tip tanımlamaları

export interface CostItem {
  id: string
  schedule_id: string
  assigned_building: string
  main_item: string
  sub_item: string | null
  quantity: number
  unit: string
  unit_price: number
  created_at: string
}

export interface PaymentSchedule {
  id: string
  week_number: number
  payment_date: string
  amount: number
  paid_amount: number
  paid_date: string | null
  status: 'pending' | 'paid' | 'overdue'
  description: string
  created_at: string
}

export interface ProgressLog {
  id: string
  schedule_id: string
  cost_item_id: string | null
  assigned_building: string
  log_date: string
  description: string
  quantity: number
  unit: string
  actual_cost: number
  media_urls: string[]
  is_client_visible: boolean
  stage: 'planning' | 'in_progress' | 'completed' | 'on_hold'
  client_response: 'pending' | 'approved' | 'rejected' | null
  client_note: string | null
  created_at: string
  history: any[]
}

export interface WorkSchedule {
  manual_id: string
  buildings: string[]
  manufacturing_groups: string[]
  work_weeks: number[]
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      cost_items_rows: {
        Row: CostItem
        Insert: Omit<CostItem, 'id' | 'created_at'>
        Update: Partial<Omit<CostItem, 'id' | 'created_at'>>
      }
      payment_schedule_rows: {
        Row: PaymentSchedule
        Insert: Omit<PaymentSchedule, 'id' | 'created_at'>
        Update: Partial<Omit<PaymentSchedule, 'id' | 'created_at'>>
      }
      progress_logs_rows: {
        Row: ProgressLog
        Insert: Omit<ProgressLog, 'id' | 'created_at'>
        Update: Partial<Omit<ProgressLog, 'id' | 'created_at'>>
      }
      work_schedule_rows: {
        Row: WorkSchedule
        Insert: Omit<WorkSchedule, 'created_at'>
        Update: Partial<Omit<WorkSchedule, 'created_at'>>
      }
    }
  }
}
