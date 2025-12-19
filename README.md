# Şantiye Takip Sistemi

Modern ve kullanıcı dostu bir şantiye yönetim sistemi. Next.js ve Supabase ile geliştirilmiştir.

## Özellikler

- 🏗️ **Proje yönetimi** - Şantiye projelerinizi planlayın ve takip edin
- 👷 **İşçi takibi** - İşçi bilgilerini, pozisyonlarını ve ücretlerini yönetin
- 🧱 **Malzeme envanteri** - Malzeme stok ve tedarik takibi
- 📋 **Görev planlaması** - İş atamalarını ve görev durumlarını takip edin
- 📊 **Anlık istatistikler** - Dashboard üzerinden tüm verilere genel bakış
- 🎨 **Modern UI** - Responsive tasarım, kullanıcı dostu arayüz

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

### 3. Supabase Projesini Ayarlayın

#### a) Veritabanı Tablolarını Oluşturun

1. [Supabase Dashboard](https://app.supabase.com)'a gidin
2. **SQL Editor** sekmesini açın
3. `supabase/schema.sql` dosyasındaki SQL kodunu kopyalayıp çalıştırın
4. Bu işlem aşağıdaki tabloları oluşturacaktır:
   - `projeler` - Şantiye projeleri
   - `isciler` - İşçi kayıtları
   - `malzemeler` - Malzeme envanteri
   - `gorevler` - Görev ve iş takibi

#### b) Environment Variables'ları Ayarlayın

`.env.local` dosyasını oluşturun:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> 💡 **Not:** Bu bilgileri Supabase Dashboard > Settings > API bölümünden alabilirsiniz.

### 4. Development Server'ı Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Supabase Veri Yapısını İnceleme

Supabase'deki mevcut tabloları ve veri yapısını görmek için:

```bash
npx tsx scripts/inspect-supabase.ts
```

## Production Build

```bash
npm run build
npm start
```

## Vercel'e Deploy

### Otomatik Deployment

1. GitHub repository'nizi [Vercel](https://vercel.com)'e bağlayın
2. Environment variables'ları ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy butonuna tıklayın

### Manuel Deployment

```bash
npm install -g vercel
vercel --prod
```

Daha fazla bilgi için [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) bakın.

## Proje Yapısı

```
kuzyaka-takip/
├── app/                    # Next.js App Router sayfaları
│   ├── page.tsx           # Ana sayfa (dashboard)
│   ├── projeler/          # Proje yönetimi sayfaları
│   ├── isciler/           # İşçi yönetimi sayfaları
│   ├── malzemeler/        # Malzeme yönetimi sayfaları
│   └── gorevler/          # Görev yönetimi sayfaları
├── components/            # React bileşenleri
│   └── Header.tsx         # Navigasyon header'ı
├── lib/                   # Yardımcı fonksiyonlar ve servisler
│   ├── supabase.ts        # Supabase client
│   ├── supabase-service.ts # Generic CRUD service
│   └── services.ts        # Modül-spesifik servisler
├── types/                 # TypeScript tip tanımlamaları
│   └── database.ts        # Veritabanı şeması tipleri
├── supabase/             # Supabase konfigürasyonu
│   └── schema.sql        # Veritabanı şema SQL dosyası
└── public/               # Statik dosyalar
```

## Teknolojiler

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (opsiyonel)
- **Deployment:** Vercel

## Veri Modeli

### Projeler
- Proje adı, açıklama, lokasyon
- Başlangıç/bitiş tarihleri
- Durum takibi (planlaniyor, devam_ediyor, tamamlandi, askida)
- Bütçe yönetimi

### İşçiler
- Kişisel bilgiler (ad, soyad, iletişim)
- Pozisyon ve günlük ücret
- Proje atamaları
- Durum (aktif, izinli, ayrıldı)

### Malzemeler
- Malzeme adı, kategori
- Miktar ve birim
- Birim fiyat
- Tedarikçi bilgileri
- Proje bağlantısı

### Görevler
- Görev başlığı ve açıklama
- Durum (beklemede, devam_ediyor, tamamlandi, iptal)
- Öncelik (düşük, orta, yüksek, acil)
- İşçi ataması
- Tarih takibi

## Güvenlik

⚠️ **Önemli:** `supabase/schema.sql` dosyasındaki RLS (Row Level Security) politikaları geliştirme amaçlıdır ve herkese tam erişim verir. Üretim ortamında mutlaka kullanıcı kimlik doğrulaması ve yetkilendirme politikaları eklemelisiniz.

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

MIT
