'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Worksite } from '@/lib/supabase'

export default function WorksitesPage() {
  const [worksites, setWorksites] = useState<Worksite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorksites()
  }, [])

  const loadWorksites = async () => {
    try {
      const { data, error } = await supabase
        .from('worksites')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setWorksites(data)
    } catch (error) {
      console.error('Error loading worksites:', error)
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
        <h1 style={{ fontSize: '2rem' }}>Şantiyeler</h1>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          + Yeni Şantiye
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {worksites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Henüz şantiye bulunmuyor</p>
            <p>Yeni bir şantiye eklemek için yukarıdaki butona tıklayın.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Ad</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Konum</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Durum</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Başlangıç</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Bitiş</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Bütçe</th>
                </tr>
              </thead>
              <tbody>
                {worksites.map((worksite) => (
                  <tr key={worksite.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{worksite.name}</td>
                    <td style={{ padding: '1rem' }}>{worksite.location || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        backgroundColor: 
                          worksite.status === 'active' ? '#e0f2fe' :
                          worksite.status === 'completed' ? '#dcfce7' :
                          worksite.status === 'planning' ? '#fef3c7' :
                          worksite.status === 'paused' ? '#fee2e2' : '#f3f4f6',
                        color:
                          worksite.status === 'active' ? '#0369a1' :
                          worksite.status === 'completed' ? '#15803d' :
                          worksite.status === 'planning' ? '#a16207' :
                          worksite.status === 'paused' ? '#991b1b' : '#374151'
                      }}>
                        {worksite.status === 'active' ? 'Aktif' : 
                         worksite.status === 'planning' ? 'Planlama' :
                         worksite.status === 'completed' ? 'Tamamlandı' :
                         worksite.status === 'paused' ? 'Duraklatıldı' : 'İptal'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {worksite.start_date ? new Date(worksite.start_date).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {worksite.end_date ? new Date(worksite.end_date).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>
                      {worksite.budget ? `₺${parseFloat(worksite.budget.toString()).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
