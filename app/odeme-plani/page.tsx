'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { paymentScheduleService } from '@/lib/services'
import { PaymentSchedule } from '@/types/database'

export default function OdemePlaniPage() {
  const [payments, setPayments] = useState<PaymentSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPayments()
  }, [])

  async function loadPayments() {
    try {
      setLoading(true)
      setError(null)
      const data = await paymentScheduleService.getAll()
      // Hafta numarasına göre sırala
      const sorted = data.sort((a, b) => a.week_number - b.week_number)
      setPayments(sorted)
    } catch (err: any) {
      console.error('Ödeme planı yüklenirken hata:', err)
      setError(err.message || 'Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'paid':
        return 'Ödendi'
      case 'pending':
        return 'Bekliyor'
      case 'overdue':
        return 'Gecikmiş'
      default:
        return status
    }
  }

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
  const totalPaid = payments.reduce((sum, p) => sum + p.paid_amount, 0)
  const remaining = totalAmount - totalPaid

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ödeme Planı</h1>
          <p className="text-gray-600 mt-2">Hakediş ve ödeme takvimi</p>
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
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-600 mb-1">Toplam Tutar</div>
                <div className="text-2xl font-bold text-blue-600">
                  {totalAmount.toLocaleString('tr-TR')} ₺
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-600 mb-1">Ödenen</div>
                <div className="text-2xl font-bold text-green-600">
                  {totalPaid.toLocaleString('tr-TR')} ₺
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-600 mb-1">Kalan</div>
                <div className="text-2xl font-bold text-orange-600">
                  {remaining.toLocaleString('tr-TR')} ₺
                </div>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hafta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Açıklama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Planlanan Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tutar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ödenen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ödeme Tarihi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.week_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {payment.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.payment_date).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {payment.amount.toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {payment.paid_amount.toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.paid_date ? new Date(payment.paid_date).toLocaleDateString('tr-TR') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {getStatusText(payment.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 text-gray-600 text-sm">
              Toplam {payments.length} ödeme kaydı
            </div>
          </>
        )}
      </main>
    </div>
  )
}
