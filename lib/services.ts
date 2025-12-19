import { SupabaseService } from './supabase-service'
import { Proje, Isci, Malzeme, Gorev } from '@/types/database'

export const projelerService = new SupabaseService<Proje>('projeler')
export const iscilerService = new SupabaseService<Isci>('isciler')
export const malzemelerService = new SupabaseService<Malzeme>('malzemeler')
export const gorevlerService = new SupabaseService<Gorev>('gorevler')
