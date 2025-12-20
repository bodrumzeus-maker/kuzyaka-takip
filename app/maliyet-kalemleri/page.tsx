'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { costItemsService } from '@/lib/services'
import { CostItem } from '@/types/database'

export default function MaliyetKalemleriPage() {
  const [items, setItems] = useState<CostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    try {
      setLoading(true)
      setError(null)
      const data = await costItemsService.getAll()
      setItems(data)
    } catch (err: any) {
      console.error('Maliyet kalemleri yüklenirken hata:', err)
      setError(err.message || 'Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(item => 
    filter === '' || 
    item.assigned_building.toLowerCase().includes(filter.toLowerCase()) ||
    item.main_item.toLowerCase().includes(filter.toLowerCase())
  )

  const totalCost = filteredItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Maliyet Kalemleri</h1>
          <p className="text-gray-600 mt-2">İş kalemleri ve maliyet detayları</p>
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <input
                  type="text"
                  placeholder="Bina veya iş kalemi ara..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="text-right">
                  <div className="text-sm text-gray-600">Toplam Maliyet</div>
                  <div className="text-2xl font-bold text-green-600">
                    {totalCost.toLocaleString('tr-TR')} ₺
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Program ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bina
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ana Kalem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alt Kalem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Miktar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Birim Fiyat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Toplam
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredItems.map((item) => {
                      const total = item.quantity * item.unit_price
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.schedule_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.assigned_building}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.main_item}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {item.sub_item || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.unit_price.toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {total.toLocaleString('tr-TR')} ₺
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 text-gray-600 text-sm">
              Toplam {filteredItems.length} kayıt gösteriliyor
            </div>
          </>
        )}
      </main>
    </div>
  )
}
