'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { iscilerService } from '@/lib/services'
import { Isci } from '@/types/database'

export default function IscilerPage() {
  const [isciler, setIsciler] = useState<Isci[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadIsciler()
  }, [])

  async function loadIsciler() {
    try {
      setLoading(true)
      setError(null)
      const data = await iscilerService.getAll()
      setIsciler(data)
    } catch (err: any) {
      console.error('İşçiler yüklenirken hata:', err)
      setError(err.message || 'İşçiler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  function getDurumRenk(durum: string) {
    switch (durum) {
      case 'aktif':
        return 'bg-green-100 text-green-800'
      case 'izinli':
        return 'bg-yellow-100 text-yellow-800'
      case 'ayrıldi':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function getDurumText(durum: string) {
    switch (durum) {
      case 'aktif':
        return 'Aktif'
      case 'izinli':
        return 'İzinli'
      case 'ayrıldi':
        return 'Ayrıldı'
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
            <h1 className="text-3xl font-bold text-gray-900">İşçiler</h1>
            <p className="text-gray-600 mt-2">İşçi bilgilerini takip edin</p>
          </div>
          <Link
            href="/isciler/yeni"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Yeni İşçi Ekle
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
              Supabase bağlantınızı ve tablo yapınızı kontrol edin.
            </p>
          </div>
        )}

        {!loading && !error && isciler.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">👷</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz işçi kaydı yok</h3>
            <p className="text-gray-600 mb-6">İlk işçi kaydını ekleyerek başlayın</p>
            <Link
              href="/isciler/yeni"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Yeni İşçi Ekle
            </Link>
          </div>
        )}

        {!loading && !error && isciler.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İsim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pozisyon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Günlük Ücret
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isciler.map((isci) => (
                  <tr key={isci.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {isci.ad} {isci.soyad}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{isci.pozisyon}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {isci.telefon && <div>{isci.telefon}</div>}
                        {isci.email && <div className="text-xs text-gray-400">{isci.email}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {isci.gunluk_ucret ? `${isci.gunluk_ucret.toLocaleString('tr-TR')} ₺` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDurumRenk(isci.durum)}`}>
                        {getDurumText(isci.durum)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/isciler/${isci.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
