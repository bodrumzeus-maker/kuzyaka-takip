'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { projelerService, iscilerService, malzemelerService, gorevlerService } from '@/lib/services'

export default function Home() {
  const [stats, setStats] = useState({
    projeler: 0,
    isciler: 0,
    malzemeler: 0,
    gorevler: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      setLoading(true)
      const [projeler, isciler, malzemeler, gorevler] = await Promise.all([
        projelerService.count().catch(() => 0),
        iscilerService.count().catch(() => 0),
        malzemelerService.count().catch(() => 0),
        gorevlerService.count().catch(() => 0),
      ])
      setStats({ projeler, isciler, malzemeler, gorevler })
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
            Şantiye projelerinizi, işçilerinizi, malzemelerinizi ve görevlerinizi tek bir yerden yönetin.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/projeler" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeler</h3>
              <p className="text-gray-600">Şantiye projelerinizi yönetin</p>
            </div>
          </Link>

          <Link href="/isciler" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">👷</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">İşçiler</h3>
              <p className="text-gray-600">İşçi bilgilerini takip edin</p>
            </div>
          </Link>

          <Link href="/malzemeler" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">🧱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Malzemeler</h3>
              <p className="text-gray-600">Malzeme envanterini yönetin</p>
            </div>
          </Link>

          <Link href="/gorevler" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Görevler</h3>
              <p className="text-gray-600">İş takibi ve planlama</p>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İstatistikler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {loading ? '...' : stats.projeler}
              </div>
              <div className="text-gray-600">Aktif Proje</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {loading ? '...' : stats.isciler}
              </div>
              <div className="text-gray-600">İşçi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {loading ? '...' : stats.malzemeler}
              </div>
              <div className="text-gray-600">Malzeme</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {loading ? '...' : stats.gorevler}
              </div>
              <div className="text-gray-600">Görev</div>
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
