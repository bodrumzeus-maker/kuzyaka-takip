'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { malzemelerService } from '@/lib/services'
import { Malzeme } from '@/types/database'

export default function MalzemelerPage() {
  const [malzemeler, setMalzemeler] = useState<Malzeme[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMalzemeler()
  }, [])

  async function loadMalzemeler() {
    try {
      setLoading(true)
      setError(null)
      const data = await malzemelerService.getAll()
      setMalzemeler(data)
    } catch (err: any) {
      console.error('Malzemeler yüklenirken hata:', err)
      setError(err.message || 'Malzemeler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Malzemeler</h1>
            <p className="text-gray-600 mt-2">Malzeme envanterini yönetin</p>
          </div>
          <Link
            href="/malzemeler/yeni"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Yeni Malzeme Ekle
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

        {!loading && !error && malzemeler.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🧱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz malzeme kaydı yok</h3>
            <p className="text-gray-600 mb-6">İlk malzeme kaydını ekleyerek başlayın</p>
            <Link
              href="/malzemeler/yeni"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Yeni Malzeme Ekle
            </Link>
          </div>
        )}

        {!loading && !error && malzemeler.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {malzemeler.map((malzeme) => (
              <div
                key={malzeme.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{malzeme.ad}</h3>
                  {malzeme.kategori && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {malzeme.kategori}
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Miktar:</span>
                    <span className="font-medium">{malzeme.miktar} {malzeme.birim}</span>
                  </div>
                  {malzeme.birim_fiyat && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Birim Fiyat:</span>
                      <span className="font-medium">{malzeme.birim_fiyat.toLocaleString('tr-TR')} ₺</span>
                    </div>
                  )}
                  {malzeme.tedarikci && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tedarikçi:</span>
                      <span className="font-medium">{malzeme.tedarikci}</span>
                    </div>
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
