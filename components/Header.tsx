'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
            Şantiye Takip Sistemi
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/projeler" className="text-gray-600 hover:text-gray-900 transition-colors">
              Projeler
            </Link>
            <Link href="/isciler" className="text-gray-600 hover:text-gray-900 transition-colors">
              İşçiler
            </Link>
            <Link href="/malzemeler" className="text-gray-600 hover:text-gray-900 transition-colors">
              Malzemeler
            </Link>
            <Link href="/gorevler" className="text-gray-600 hover:text-gray-900 transition-colors">
              Görevler
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
