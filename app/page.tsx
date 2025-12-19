import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Şantiye Takip Sistemi</h1>
            <nav className="flex gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Ana Sayfa
              </Link>
            </nav>
          </div>
        </div>
      </header>

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
              <div className="text-3xl font-bold text-blue-600">-</div>
              <div className="text-gray-600">Aktif Proje</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">-</div>
              <div className="text-gray-600">İşçi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">-</div>
              <div className="text-gray-600">Malzeme</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">-</div>
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
  );
}
