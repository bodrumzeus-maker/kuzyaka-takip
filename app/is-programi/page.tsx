'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { workScheduleService } from '@/lib/services'
import { WorkSchedule } from '@/types/database'

export default function IsProgramiPage() {
  const [schedules, setSchedules] = useState<WorkSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSchedules()
  }, [])

  async function loadSchedules() {
    try {
      setLoading(true)
      setError(null)
      const data = await workScheduleService.getAll()
      setSchedules(data)
    } catch (err: any) {
      console.error('İş programı yüklenirken hata:', err)
      setError(err.message || 'Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">İş Programı</h1>
          <p className="text-gray-600 mt-2">Haftalık iş planlama ve imalat grupları</p>
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
            <div className="grid grid-cols-1 gap-6">
              {schedules.map((schedule) => (
                <div key={schedule.manual_id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {schedule.manual_id} - {schedule.manufacturing_groups.join(', ')}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {schedule.buildings.map((building, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {building}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-sm text-gray-600 mb-2 font-semibold">İş Haftaları:</div>
                    <div className="flex flex-wrap gap-2">
                      {schedule.work_weeks.map((week, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                          Hafta {week}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    Oluşturulma: {new Date(schedule.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-gray-600 text-sm">
              Toplam {schedules.length} iş programı kaydı
            </div>
          </>
        )}
      </main>
    </div>
  )
}
