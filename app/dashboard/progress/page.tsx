'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { ProgressRecord } from '@/lib/supabase'

export default function ProgressPage() {
  const [progressRecords, setProgressRecords] = useState<ProgressRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgressRecords()
  }, [])

  const loadProgressRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('progress_records')
        .select('*')
        .order('recorded_date', { ascending: false })

      if (error) throw error
      if (data) setProgressRecords(data)
    } catch (error) {
      console.error('Error loading progress records:', error)
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
        <h1 style={{ fontSize: '2rem' }}>İlerleme Kayıtları</h1>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          + Yeni Kayıt
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {progressRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Henüz ilerleme kaydı bulunmuyor</p>
            <p>Yeni bir kayıt eklemek için yukarıdaki butona tıklayın.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {progressRecords.map((record) => (
              <div key={record.id} style={{
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {record.title}
                    </h3>
                    {record.description && (
                      <p style={{ color: '#666', marginBottom: '1rem' }}>{record.description}</p>
                    )}
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    marginLeft: '1rem',
                    backgroundColor:
                      record.status === 'completed' ? '#dcfce7' :
                      record.status === 'in_progress' ? '#e0f2fe' :
                      record.status === 'blocked' ? '#fee2e2' : '#f3f4f6',
                    color:
                      record.status === 'completed' ? '#15803d' :
                      record.status === 'in_progress' ? '#0369a1' :
                      record.status === 'blocked' ? '#991b1b' : '#374151'
                  }}>
                    {record.status === 'completed' ? 'Tamamlandı' :
                     record.status === 'in_progress' ? 'Devam Ediyor' :
                     record.status === 'blocked' ? 'Engellenmiş' : 'Başlamadı'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: '#666' }}>
                    📅 {new Date(record.recorded_date).toLocaleDateString('tr-TR')}
                  </span>
                  {record.percentage !== null && record.percentage !== undefined && (
                    <div style={{ flex: 1, maxWidth: '300px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          flex: 1,
                          height: '8px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${record.percentage}%`,
                            height: '100%',
                            backgroundColor: '#0070f3',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <span style={{ fontWeight: '600', minWidth: '45px' }}>
                          {record.percentage}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
