// Supabase veri yapısını keşfetmek için yardımcı script
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials eksik!')
  console.error('Lütfen .env.local dosyasında NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY değerlerini ayarlayın.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function inspectDatabase() {
  console.log('🔍 Supabase veritabanı yapısı inceleniyor...\n')
  
  try {
    // Yaygın tablo isimlerini dene
    const commonTables = [
      'projects', 'projeler', 
      'workers', 'isciler', 
      'materials', 'malzemeler',
      'tasks', 'gorevler',
      'expenses', 'masraflar',
      'time_entries', 'zaman_kayitlari',
      'users', 'kullanicilar',
      'sites', 'santiyeler',
      'equipment', 'ekipman',
      'attendance', 'devam'
    ]
    
    console.log('📋 Tablo kontrolü yapılıyor:\n')
    
    for (const tableName of commonTables) {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
      
      if (!error) {
        console.log(`\n✅ ${tableName} - ${count ?? 0} kayıt`)
        
        // İlk kaydı al ve yapıyı göster
        const { data: sample } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (sample && sample.length > 0) {
          console.log('   Kolonlar:', Object.keys(sample[0]).join(', '))
          console.log('   Örnek veri:', JSON.stringify(sample[0], null, 2))
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Hata:', error)
  }
}

inspectDatabase()
