'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { projelerService } from '@/lib/services'
import { Proje } from '@/types/database'

export default function ProjelerPage() {
  const [projeler, setProjeler] = useState<Proje[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProjeler()
  }, [])

  async function loadProjeler() {
    try {
      setLoading(true)
      setError(null)
      const data = await projelerService.getAll()
      setProjeler(data)
    } catch (err: any) {
      console.error('Projeler yüklenirken hata:', err)
      setError(err.message || 'Projeler yüklenemedi')
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
      case 'planlaniyor':
        return 'bg-yellow-100 text-yellow-800'
      case 'askida':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function getDurumText(durum: string) {
    switch (durum) {
      case 'tamamlandi':
        return 'Tamamlandı'
      case 'devam_ediyor':
        return 'Devam Ediyor'
      case 'planlaniyor':
        return 'Planlanıyor'
      case 'askida':
        return 'Askıda'
      default:
        return durum
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projeler</h1>
            <p className="text-gray-600 mt-2">Şantiye projelerinizi yönetin</p>
          </div>
          <Link
            href="/projeler/yeni"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Yeni Proje Ekle
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
            <p className="text-sm text-red-600 mt-2">
              Supabase bağlantınızı ve tablo yapınızı kontrol edin. Eğer tablolar oluşturulmamışsa, lütfen Supabase dashboard'dan gerekli tabloları oluşturun.
            </p>
          </div>
        )}

        {!loading && !error && projeler.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz proje yok</h3>
            <p className="text-gray-600 mb-6">İlk projenizi ekleyerek başlayın</p>
            <Link
              href="/projeler/yeni"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Yeni Proje Ekle
            </Link>
          </div>
        )}

        {!loading && !error && projeler.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projeler.map((proje) => (
              <Link
                key={proje.id}
                href={`/projeler/${proje.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{proje.ad}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDurumRenk(proje.durum)}`}>
                    {getDurumText(proje.durum)}
                  </span>
                </div>
                
                {proje.aciklama && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{proje.aciklama}</p>
                )}
                
                <div className="space-y-2 text-sm">
                  {proje.lokasyon && (
                    <div className="flex items-center text-gray-500">
                      <span className="mr-2">📍</span>
                      <span>{proje.lokasyon}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-500">
                    <span className="mr-2">📅</span>
                    <span>Başlangıç: {new Date(proje.baslangic_tarihi).toLocaleDateString('tr-TR')}</span>
                  </div>
                  {proje.bitis_tarihi && (
                    <div className="flex items-center text-gray-500">
                      <span className="mr-2">🏁</span>
                      <span>Bitiş: {new Date(proje.bitis_tarihi).toLocaleDateString('tr-TR')}</span>
                    </div>
                  )}
                  {proje.butce && (
                    <div className="flex items-center text-gray-500">
                      <span className="mr-2">💰</span>
                      <span>{proje.butce.toLocaleString('tr-TR')} ₺</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
