import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rgfqxsimebtcaixhqccx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZnF4c2ltZWJ0Y2FpeGhxY2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MDI3MTEsImV4cCI6MjA4MTM3ODcxMX0.Yhvrh5covDV59arW6WZG-b3h2TSNloEbrVUcmjxSjmg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔍 Supabase veritabanındaki gerçek tabloları keşfediyorum...\n')

// PostgreSQL system catalogs'dan tablo bilgisi almaya çalış
async function discoverTables() {
  try {
    // information_schema.tables sorgusu
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_names')
    
    if (tablesError) {
      console.log('⚠️  RPC fonksiyonu yok, REST API ile deneniyor...\n')
    }
  } catch (e) {
    console.log('⚠️  Direct query yapılamıyor\n')
  }

  // Yaygın tablo isimlerini test et
  const possibleTables = [
    // Türkçe isimler
    'projeler', 'proje', 'projects',
    'isciler', 'isci', 'workers', 'personel',
    'malzemeler', 'malzeme', 'materials', 'stok', 'envanter',
    'gorevler', 'gorev', 'tasks', 'isler',
    'musteriler', 'musteri', 'customers', 'clients',
    'tedarikciler', 'tedarikci', 'suppliers',
    'faturalar', 'fatura', 'invoices',
    'odemeler', 'odeme', 'payments',
    'masraflar', 'masraf', 'expenses',
    'kategoriler', 'kategori', 'categories',
    'santiyeler', 'santiye', 'sites', 'construction_sites',
    'ekipman', 'equipment', 'araclar', 'vehicles',
    'devam', 'attendance', 'yoklama',
    'raporlar', 'rapor', 'reports',
    'notlar', 'not', 'notes',
    'users', 'kullanicilar', 'profiles',
    // İngilizce alternatifler
    'items', 'orders', 'transactions', 'documents',
    'files', 'attachments', 'comments', 'activities'
  ]

  console.log('📋 Mevcut tabloları kontrol ediyorum...\n')
  const foundTables = []

  for (const tableName of possibleTables) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
      
      if (!error) {
        foundTables.push({ name: tableName, count: count || 0 })
        console.log(`✅ ${tableName.padEnd(25)} | ${count || 0} kayıt`)
        
        // İlk satırı al ve yapıyı göster
        const { data: sample, error: sampleError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (sample && sample.length > 0) {
          const columns = Object.keys(sample[0])
          console.log(`   📝 Kolonlar (${columns.length}): ${columns.join(', ')}`)
          console.log(`   📄 Örnek veri:`)
          console.log(JSON.stringify(sample[0], null, 4))
          console.log('')
        } else {
          console.log(`   ⚠️  Boş tablo\n`)
        }
      }
    } catch (e) {
      // Sessizce devam et
    }
  }

  if (foundTables.length === 0) {
    console.log('\n❌ Hiçbir tablo bulunamadı!')
    console.log('Lütfen Supabase Dashboard\'dan mevcut tabloları kontrol edin.')
  } else {
    console.log(`\n✅ Toplam ${foundTables.length} tablo bulundu:`)
    foundTables.forEach(t => console.log(`   - ${t.name} (${t.count} kayıt)`))
  }
}

discoverTables().catch(console.error)
