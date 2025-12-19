import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Kuzyaka Takip - İş/Şantiye Takip Sistemi
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
        Supabase tabanlı profesyonel iş ve şantiye takip uygulaması
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginTop: '3rem'
      }}>
        <div style={{ 
          padding: '2rem', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔐 Güvenli Giriş</h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Supabase Auth ile JWT tabanlı güvenli kimlik doğrulama
          </p>
          <Link href="/auth/login" style={{ 
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#0070f3',
            color: 'white',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
            Giriş Yap
          </Link>
        </div>

        <div style={{ 
          padding: '2rem', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>👥 Rol Tabanlı Erişim</h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Admin, Moderatör ve İşveren rolleriyle kapsamlı yetkilendirme
          </p>
          <ul style={{ listStylePosition: 'inside', color: '#666' }}>
            <li>Admin: Tam yetki</li>
            <li>Moderator: Tüm şantiyelere erişim</li>
            <li>Employer: Kendi şantiyeleri</li>
          </ul>
        </div>

        <div style={{ 
          padding: '2rem', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📊 Kapsamlı Takip</h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            İş programı, maliyet ve ilerleme kayıtları yönetimi
          </p>
          <ul style={{ listStylePosition: 'inside', color: '#666' }}>
            <li>Şantiye yönetimi</li>
            <li>Program planları</li>
            <li>Maliyet takibi</li>
            <li>İlerleme raporları</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔒 Güvenlik Özellikleri</h2>
        <ul style={{ listStylePosition: 'inside', color: '#666', lineHeight: '1.8' }}>
          <li><strong>Row Level Security (RLS):</strong> Veritabanı seviyesinde güvenlik politikaları</li>
          <li><strong>JWT Claims:</strong> Rollere göre otomatik yetkilendirme</li>
          <li><strong>En Az Ayrıcalık İlkesi:</strong> Kullanıcılar sadece gerekli verilere erişebilir</li>
          <li><strong>Versiyonlu Migrations:</strong> Tüm veritabanı değişiklikleri izlenebilir</li>
          <li><strong>Realtime Ready:</strong> Canlı veri güncellemeleri için hazır altyapı</li>
          <li><strong>Edge Functions:</strong> Sunucu taraflı iş mantığı desteği</li>
        </ul>
      </div>
    </main>
  )
}
