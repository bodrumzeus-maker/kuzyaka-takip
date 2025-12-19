'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { gorevlerService } from '@/lib/services'
import { Gorev } from '@/types/database'

export default function GorevlerPage() {
  const [gorevler, setGorevler] = useState<Gorev[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGorevler()
  }, [])

  async function loadGorevler() {
    try {
      setLoading(true)
      setError(null)
      const data = await gorevlerService.getAll()
      setGorevler(data)
    } catch (err: any) {
      console.error('Görevler yüklenirken hata:', err)
      setError(err.message || 'Görevler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  function getDurumRenk(durum: string) {
    switch (durum) {
      case 'tamamlandi':
        return 'bg-green-100 text-green-800'
      case 'devam_ediyor':
        return 'bg-blue-100 text-blue-800'
      case 'beklemede':
        return 'bg-yellow-100 text-yellow-800'
      case 'iptal':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function getOncelikRenk(oncelik: string) {
    switch (oncelik) {
      case 'acil':
        return 'bg-red-100 text-red-800'
      case 'yuksek':
        return 'bg-orange-100 text-orange-800'
      case 'orta':
        return 'bg-yellow-100 text-yellow-800'
      case 'dusuk':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Görevler</h1>
            <p className="text-gray-600 mt-2">İş takibi ve planlama</p>
          </div>
          <Link
            href="/gorevler/yeni"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Yeni Görev Ekle
          </Link>
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

        {!loading && !error && gorevler.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz görev yok</h3>
            <p className="text-gray-600 mb-6">İlk görevi ekleyerek başlayın</p>
            <Link
              href="/gorevler/yeni"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Yeni Görev Ekle
            </Link>
          </div>
        )}

        {!loading && !error && gorevler.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gorevler.map((gorev) => (
              <div
                key={gorev.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">{gorev.baslik}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getOncelikRenk(gorev.oncelik)}`}>
                    {gorev.oncelik.charAt(0).toUpperCase() + gorev.oncelik.slice(1)}
                  </span>
                </div>
                
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getDurumRenk(gorev.durum)}`}>
                  {gorev.durum.replace('_', ' ').charAt(0).toUpperCase() + gorev.durum.replace('_', ' ').slice(1)}
                </span>
                
                {gorev.aciklama && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{gorev.aciklama}</p>
                )}
                
                <div className="space-y-1 text-sm text-gray-500">
                  {gorev.baslangic_tarihi && (
                    <div>📅 Başlangıç: {new Date(gorev.baslangic_tarihi).toLocaleDateString('tr-TR')}</div>
                  )}
                  {gorev.bitis_tarihi && (
                    <div>🏁 Bitiş: {new Date(gorev.bitis_tarihi).toLocaleDateString('tr-TR')}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
