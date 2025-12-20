import { SupabaseService } from './supabase-service'
import { CostItem, PaymentSchedule, ProgressLog, WorkSchedule } from '@/types/database'

export const costItemsService = new SupabaseService<CostItem>('cost_items_rows')
export const paymentScheduleService = new SupabaseService<PaymentSchedule>('payment_schedule_rows')
export const progressLogsService = new SupabaseService<ProgressLog>('progress_logs_rows')
export const workScheduleService = new SupabaseService<WorkSchedule>('work_schedule_rows')
