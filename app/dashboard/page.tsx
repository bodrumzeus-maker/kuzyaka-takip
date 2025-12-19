'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Worksite } from '@/lib/supabase'

export default function DashboardPage() {
  const [worksites, setWorksites] = useState<Worksite[]>([])
  const [stats, setStats] = useState({
    totalWorksites: 0,
    activeWorksites: 0,
    totalSchedules: 0,
    totalCosts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load worksites
      const { data: worksitesData } = await supabase
        .from('worksites')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (worksitesData) {
        setWorksites(worksitesData)
      }

      // Load stats
      const { count: totalWorksites } = await supabase
        .from('worksites')
        .select('*', { count: 'exact', head: true })

      const { count: activeWorksites } = await supabase
        .from('worksites')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      const { count: totalSchedules } = await supabase
        .from('schedules')
        .select('*', { count: 'exact', head: true })

      const { data: costsData } = await supabase
        .from('costs')
        .select('amount')

      const totalCosts = costsData?.reduce((sum, cost) => sum + parseFloat(cost.amount || '0'), 0) || 0

      setStats({
        totalWorksites: totalWorksites || 0,
        activeWorksites: activeWorksites || 0,
        totalSchedules: totalSchedules || 0,
        totalCosts
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard</h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            Toplam Şantiye
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {stats.totalWorksites}
          </p>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            Aktif Şantiye
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0070f3' }}>
            {stats.activeWorksites}
          </p>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            Toplam Program
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {stats.totalSchedules}
          </p>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            Toplam Maliyet
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f00' }}>
            ₺{stats.totalCosts.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          Son Şantiyeler
        </h2>
        {worksites.length === 0 ? (
          <p style={{ color: '#666' }}>Henüz şantiye bulunmuyor.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Ad</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Konum</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Durum</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Bütçe</th>
                </tr>
              </thead>
              <tbody>
                {worksites.map((worksite) => (
                  <tr key={worksite.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>{worksite.name}</td>
                    <td style={{ padding: '1rem' }}>{worksite.location || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        backgroundColor: worksite.status === 'active' ? '#e0f2fe' : '#f0f0f0',
                        color: worksite.status === 'active' ? '#0369a1' : '#666'
                      }}>
                        {worksite.status === 'active' ? 'Aktif' : 
                         worksite.status === 'planning' ? 'Planlama' :
                         worksite.status === 'completed' ? 'Tamamlandı' :
                         worksite.status === 'paused' ? 'Duraklatıldı' : 'İptal'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {worksite.budget ? `₺${parseFloat(worksite.budget.toString()).toLocaleString('tr-TR')}` : '-'}
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
