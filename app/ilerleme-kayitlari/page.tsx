'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { progressLogsService } from '@/lib/services'
import { ProgressLog } from '@/types/database'

export default function IlerlemeKayitlariPage() {
  const [logs, setLogs] = useState<ProgressLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    loadLogs()
  }, [])

  async function loadLogs() {
    try {
      setLoading(true)
      setError(null)
      const data = await progressLogsService.getAll()
      setLogs(data)
    } catch (err: any) {
      console.error('İlerleme kayıtları yüklenirken hata:', err)
      setError(err.message || 'Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  function getStageColor(stage: string) {
    switch (stage) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'planning':
        return 'bg-yellow-100 text-yellow-800'
      case 'on_hold':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function getStageText(stage: string) {
    switch (stage) {
      case 'completed':
        return 'Tamamlandı'
      case 'in_progress':
        return 'Devam Ediyor'
      case 'planning':
        return 'Planlamada'
      case 'on_hold':
        return 'Beklemede'
      default:
        return stage
    }
  }

  function getResponseColor(response: string | null) {
    switch (response) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function getResponseText(response: string | null) {
    switch (response) {
      case 'approved':
        return 'Onaylandı'
      case 'rejected':
        return 'Reddedildi'
      case 'pending':
        return 'Bekliyor'
      default:
        return '-'
    }
  }

  const filteredLogs = logs.filter(log => 
    filter === '' || 
    log.assigned_building.toLowerCase().includes(filter.toLowerCase()) ||
    log.description.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">İlerleme Kayıtları</h1>
          <p className="text-gray-600 mt-2">Günlük iş ilerlemeleri ve müşteri onayları</p>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">⚠️ Hata</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <input
                type="text"
                placeholder="Bina veya açıklama ara..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredLogs.map((log) => (
                <div key={log.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{log.assigned_building}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(log.stage)}`}>
                          {getStageText(log.stage)}
                        </span>
                        {log.is_client_visible && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getResponseColor(log.client_response)}`}>
                            {getResponseText(log.client_response)}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Program ID: {log.schedule_id} | Tarih: {new Date(log.log_date).toLocaleDateString('tr-TR')}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{log.description}</p>
                    </div>
                  </div>

                  {log.client_note && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm font-semibold text-blue-900 mb-1">Müşteri Notu:</div>
                      <div className="text-sm text-blue-800">{log.client_note}</div>
                    </div>
                  )}

                  {log.quantity > 0 && (
                    <div className="mt-4 flex gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">Miktar:</span> {log.quantity} {log.unit}
                      </div>
                      {log.actual_cost > 0 && (
                        <div>
                          <span className="font-semibold">Fiili Maliyet:</span> {log.actual_cost.toLocaleString('tr-TR')} ₺
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 text-gray-600 text-sm">
              Toplam {filteredLogs.length} ilerleme kaydı gösteriliyor
            </div>
          </>
        )}
      </main>
    </div>
  )
}
