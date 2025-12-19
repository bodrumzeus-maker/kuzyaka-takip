'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Cost } from '@/lib/supabase'

export default function CostsPage() {
  const [costs, setCosts] = useState<Cost[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    loadCosts()
  }, [])

  const loadCosts = async () => {
    try {
      const { data, error } = await supabase
        .from('costs')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      if (data) {
        setCosts(data)
        const total = data.reduce((sum, cost) => sum + parseFloat(cost.amount.toString()), 0)
        setTotalCost(total)
      }
    } catch (error) {
      console.error('Error loading costs:', error)
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
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Maliyetler</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
            Toplam: ₺{totalCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          + Yeni Maliyet
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {costs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Henüz maliyet kaydı bulunmuyor</p>
            <p>Yeni bir maliyet eklemek için yukarıdaki butona tıklayın.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Kategori</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Açıklama</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Tarih</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Tutar</th>
                </tr>
              </thead>
              <tbody>
                {costs.map((cost) => (
                  <tr key={cost.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        backgroundColor: '#f3f4f6',
                        color: '#374151'
                      }}>
                        {cost.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{cost.description || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      {new Date(cost.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#dc2626' }}>
                      ₺{parseFloat(cost.amount.toString()).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
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
