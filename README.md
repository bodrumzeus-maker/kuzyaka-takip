# Şantiye Takip Sistemi

Supabase backend'e bağlı modern bir şantiye yönetim sistemi. Next.js ve TypeScript ile geliştirilmiştir.

## Özellikler

- 💰 **Maliyet Kalemleri** - İş kalemleri, birimler, fiyatlar ve toplam maliyetler
- 📅 **Ödeme Planı** - Haftalık hakediş planı, ödeme takibi ve durum yönetimi
- 📊 **İlerleme Kayıtları** - Günlük iş ilerlemeleri, müşteri onayları ve notlar
- 📋 **İş Programı** - Haftalık planlama, imalat grupları ve bina atamaları

## Veri Yapısı

Sistem 4 ana tablo üzerine kuruludur:

### 1. cost_items_rows (Maliyet Kalemleri)
- İş programı ID'si (schedule_id)
- Atanan bina (assigned_building)
- Ana ve alt iş kalemleri
- Miktar, birim, birim fiyat
- Toplam maliyet hesaplaması

### 2. payment_schedule_rows (Ödeme Planı)
- Hafta numarası ve tarih
- Planlanan ve ödenen tutarlar
- Durum takibi (pending, paid, overdue)
- Hakediş açıklamaları

### 3. progress_logs_rows (İlerleme Kayıtları)
- Günlük iş kayıtları
- Müşteri görünürlüğü
- Onay durumu (pending, approved, rejected)
- Müşteri notları ve geçmiş
- Medya URL'leri

### 4. work_schedule_rows (İş Programı)
- Manual ID
- Bina listesi
- İmalat grupları
- Hafta dağılımı

## Kurulum

### 1. Repository'yi klonlayın
```bash
git clone https://github.com/bodrumzeus-maker/kuzyaka-takip.git
cd kuzyaka-takip
```

### 2. Bağımlılıkları yükleyin
```bash
npm install
```

### 3. Environment Variables'ları Ayarlayın

`.env.local` dosyası oluşturun:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://rgfqxsimebtcaixhqccx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Development Server'ı Başlatın
```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Production Build

```bash
npm run build
npm start
```

## Vercel'e Deploy

1. GitHub repository'nizi [Vercel](https://vercel.com)'e bağlayın
2. Environment variables'ları ekleyin
3. Deploy butonuna tıklayın

Sistem otomatik olarak https://kuzyakatakip.vercel.app/ adresinde yayınlanacaktır.

## Proje Yapısı

```
kuzyaka-takip/
├── app/
│   ├── page.tsx                    # Ana sayfa (Dashboard)
│   ├── maliyet-kalemleri/          # Maliyet kalemleri modülü
│   ├── odeme-plani/                # Ödeme planı modülü
│   ├── ilerleme-kayitlari/         # İlerleme kayıtları modülü
│   └── is-programi/                # İş programı modülü
├── components/
│   └── Header.tsx                  # Navigasyon header
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── supabase-service.ts         # Generic CRUD service
│   └── services.ts                 # Modül-spesifik servisler
├── types/
│   └── database.ts                 # TypeScript tip tanımlamaları
└── public/                         # Statik dosyalar
```

## Teknolojiler

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## Özellikler

### Maliyet Kalemleri
- Tüm iş kalemlerinin listesi
- Bina ve iş kalemi bazında filtreleme
- Otomatik toplam maliyet hesaplama
- Program ID ile ilişkilendirme

### Ödeme Planı
- Haftalık ödeme takvimi
- Toplam, ödenen ve kalan tutar özeti
- Ödeme durumu takibi
- Hakediş açıklamaları

### İlerleme Kayıtları
- Günlük iş ilerlemeleri
- Müşteri onay sistemi
- Müşteri notları
- Aşama takibi (planning, in_progress, completed, on_hold)

### İş Programı
- Haftalık iş planlaması
- Bina ve imalat grubu yönetimi
- Çoklu hafta ataması

## Lisans

MIT
