'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Schedule } from '@/lib/supabase'

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSchedules()
  }, [])

  const loadSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) throw error
      if (data) setSchedules(data)
    } catch (error) {
      console.error('Error loading schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>İş Programları</h1>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          + Yeni Program
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {schedules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Henüz iş programı bulunmuyor</p>
            <p>Yeni bir program eklemek için yukarıdaki butona tıklayın.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {schedules.map((schedule) => (
              <div key={schedule.id} style={{
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{schedule.title}</h3>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    backgroundColor:
                      schedule.status === 'completed' ? '#dcfce7' :
                      schedule.status === 'in_progress' ? '#e0f2fe' :
                      schedule.status === 'blocked' ? '#fee2e2' : '#f3f4f6',
                    color:
                      schedule.status === 'completed' ? '#15803d' :
                      schedule.status === 'in_progress' ? '#0369a1' :
                      schedule.status === 'blocked' ? '#991b1b' : '#374151'
                  }}>
                    {schedule.status === 'completed' ? 'Tamamlandı' :
                     schedule.status === 'in_progress' ? 'Devam Ediyor' :
                     schedule.status === 'blocked' ? 'Engellenmiş' : 'Başlamadı'}
                  </span>
                </div>
                {schedule.description && (
                  <p style={{ color: '#666', marginBottom: '1rem' }}>{schedule.description}</p>
                )}
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#666' }}>
                  <span>📅 Başlangıç: {new Date(schedule.start_date).toLocaleDateString('tr-TR')}</span>
                  <span>🏁 Bitiş: {new Date(schedule.end_date).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
