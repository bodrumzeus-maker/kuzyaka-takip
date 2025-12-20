'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { costItemsService, paymentScheduleService, progressLogsService, workScheduleService } from '@/lib/services'

export default function Home() {
  const [stats, setStats] = useState({
    costItems: 0,
    payments: 0,
    progressLogs: 0,
    workSchedules: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      setLoading(true)
      const [costItems, payments, progressLogs, workSchedules] = await Promise.all([
        costItemsService.count().catch(() => 0),
        paymentScheduleService.count().catch(() => 0),
        progressLogsService.count().catch(() => 0),
        workScheduleService.count().catch(() => 0),
      ])
      setStats({ costItems, payments, progressLogs, workSchedules })
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hoş Geldiniz
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Şantiye projelerinizin maliyet, ödeme, ilerleme ve iş programı takibini tek bir yerden yönetin.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/maliyet-kalemleri" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Maliyet Kalemleri</h3>
              <p className="text-gray-600">İş kalemlerini ve maliyetlerini takip edin</p>
            </div>
          </Link>

          <Link href="/odeme-plani" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ödeme Planı</h3>
              <p className="text-gray-600">Hakediş ve ödeme takviminizi yönetin</p>
            </div>
          </Link>

          <Link href="/ilerleme-kayitlari" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">İlerleme Kayıtları</h3>
              <p className="text-gray-600">Günlük iş ilerlemelerini kaydedin</p>
            </div>
          </Link>

          <Link href="/is-programi" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">İş Programı</h3>
              <p className="text-gray-600">Haftalık iş planlamasını görüntüleyin</p>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İstatistikler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {loading ? '...' : stats.costItems}
              </div>
              <div className="text-gray-600">Maliyet Kalemi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {loading ? '...' : stats.payments}
              </div>
              <div className="text-gray-600">Ödeme Planı</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {loading ? '...' : stats.progressLogs}
              </div>
              <div className="text-gray-600">İlerleme Kaydı</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {loading ? '...' : stats.workSchedules}
              </div>
              <div className="text-gray-600">İş Programı</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 Şantiye Takip Sistemi. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
