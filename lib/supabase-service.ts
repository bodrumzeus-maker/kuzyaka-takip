import { supabase } from './supabase'

export class SupabaseService<T> {
  constructor(private tableName: string) {}

  async getAll() {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as T[]
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as T
  }

  async create(item: Omit<T, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(item)
      .select()
      .single()
    
    if (error) throw error
    return data as T
  }

  async update(id: string, item: Partial<T>) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(item)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as T
  }

  async delete(id: string) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  async count() {
    const { count, error } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }
}
