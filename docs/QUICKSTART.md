# Quick Start Guide

Bu rehber Kuzyaka Takip uygulamasını hızlı bir şekilde çalıştırmak için adım adım talimatlar içerir.

## Ön Hazırlık (5 dakika)

### 1. Node.js Kurulumu

Node.js 18 veya üzeri gereklidir. Kurulu olup olmadığını kontrol edin:

```bash
node --version
# v18.0.0 veya üzeri olmalı
```

Kurulu değilse [nodejs.org](https://nodejs.org) adresinden indirin.

### 2. Supabase Hesabı

1. [supabase.com](https://supabase.com) adresine gidin
2. "Start your project" ile ücretsiz hesap oluşturun
3. Yeni proje oluşturun:
   - Project name: `kuzyaka-takip`
   - Database Password: Güçlü bir şifre seçin
   - Region: En yakın bölge (örn: Frankfurt)

## Kurulum (10 dakika)

### 1. Projeyi İndirin

```bash
git clone https://github.com/bodrumzeus-maker/kuzyaka-takip.git
cd kuzyaka-takip
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Environment Variables Ayarlayın

```bash
# .env.example dosyasını kopyalayın
cp .env.example .env.local
```

`.env.local` dosyasını açın ve Supabase bilgilerinizi girin:

**Supabase Dashboard'da:**
- Settings → API menüsüne gidin
- Project URL ve anon public key'i kopyalayın

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Veritabanını Kurun

**Option A: Supabase Dashboard ile (Kolay)**

1. Supabase Dashboard → SQL Editor
2. `supabase/migrations/20231219000001_initial_schema.sql` dosyasını açın
3. İçeriği kopyalayın ve SQL Editor'a yapıştırın
4. "Run" butonuna tıklayın

**Option B: Supabase CLI ile (Profesyonel)**

```bash
# Supabase CLI kur
npm install -g supabase

# Login
supabase login

# Projeye bağlan
supabase link --project-ref your-project-ref

# Migration'ları çalıştır
supabase db push
```

### 5. Uygulamayı Başlatın

```bash
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresini açın.

## İlk Kullanım (5 dakika)

### 1. Kayıt Olun

1. Ana sayfada "Giriş Yap" butonuna tıklayın
2. "Kayıt Ol" linkine tıklayın
3. Formu doldurun:
   - **Ad Soyad**: İsminiz
   - **E-posta**: Geçerli bir e-posta
   - **Şifre**: En az 6 karakter
   - **Rol**: İlk kullanıcı için "Yönetici (Admin)" seçin

### 2. Giriş Yapın

Kayıt olduktan sonra otomatik olarak giriş yapılır ve Dashboard'a yönlendirilirsiniz.

### 3. İlk Şantiyeyi Oluşturun

1. Sol menüden "Şantiyeler" seçin
2. "Yeni Şantiye" butonuna tıklayın
3. Form ekleyebilirsiniz (şu an UI'da form henüz tam değil, API hazır)

## Temel Kullanım Senaryoları

### Senaryo 1: Admin Olarak Şantiye Yönetimi

```typescript
// Browser console'da test edebilirsiniz
// Dashboard'dayken F12 ile console'u açın

// Yeni şantiye oluştur
const { data, error } = await supabase
  .from('worksites')
  .insert({
    name: 'Test Şantiyesi',
    description: 'İlk test şantiyemiz',
    location: 'İstanbul',
    status: 'planning',
    budget: 1000000,
    start_date: '2024-01-01',
    end_date: '2024-12-31'
  })
  .select()
  .single()

console.log('Oluşturulan şantiye:', data)
```

### Senaryo 2: Kullanıcı Ekleme

Yeni kullanıcı eklemek için kayıt sayfasını kullanın veya Supabase Dashboard → Authentication → Users bölümünden manuel ekleyin.

### Senaryo 3: Maliyet Ekleme

```typescript
// Şantiye ID'sini yukarıdan alın
const worksiteId = 'şantiye-uuid-buraya'

const { data, error } = await supabase
  .from('costs')
  .insert({
    worksite_id: worksiteId,
    category: 'Malzeme',
    description: 'Çimento ve demir',
    amount: 50000,
    date: new Date().toISOString().split('T')[0]
  })
  .select()
  .single()

console.log('Eklenen maliyet:', data)
```

## Rol Yönetimi

### Admin Rolü Verme

Supabase Dashboard → Table Editor → users:
1. Kullanıcıyı bulun
2. `role` sütununu `admin` olarak değiştirin
3. Save edin

Kullanıcı çıkış yapıp tekrar giriş yaptığında admin yetkilerine sahip olacak.

## Troubleshooting

### Problem: "Invalid API key"
**Çözüm**: `.env.local` dosyasındaki Supabase URL ve Key'leri kontrol edin.

### Problem: "Row Level Security policy violation"
**Çözüm**: Kullanıcınız `users` tablosunda kayıtlı olmalı. Migration'lar doğru çalıştırıldı mı kontrol edin.

### Problem: Sayfa yüklenmiyor
**Çözüm**: 
```bash
# Server'ı yeniden başlatın
npm run dev

# Port zaten kullanılıyorsa
npx kill-port 3000
npm run dev
```

### Problem: Database connection error
**Çözüm**: Supabase projesinin aktif olduğunu kontrol edin. Dashboard'da "Paused" yazıyorsa "Restore" edin.

## Sonraki Adımlar

### Öğrenme Kaynakları

1. **API Kullanımı**: `docs/API.md` dosyasını okuyun
2. **Güvenlik**: `docs/SECURITY.md` dosyasını inceleyin
3. **Deployment**: `docs/DEPLOYMENT.md` ile production'a alın

### Geliştirme Fikirleri

1. **UI Geliştirme**: Form'lar ekleyin (şu an sadece liste görünümü var)
2. **Raporlama**: Grafik ve istatistikler ekleyin
3. **Bildirimler**: Realtime bildirimler ekleyin
4. **Dosya Yükleme**: Supabase Storage ile döküman yönetimi
5. **Mobil Uygulama**: React Native ile mobil versiyon

### Topluluğa Katılın

- GitHub Issues: Soru sorun, bug bildirin
- GitHub Discussions: Fikir paylaşın
- Pull Request: Katkıda bulunun

## Önemli Notlar

⚠️ **Güvenlik**
- Production'da güçlü şifreler kullanın
- API key'leri asla public repository'e commit etmeyin
- RLS politikalarını test edin

🚀 **Performans**
- Index'ler zaten optimize edilmiş
- Büyük listeler için pagination ekleyin
- Image'lar için Supabase Storage kullanın

📊 **Monitoring**
- Supabase Dashboard → Logs ile hataları takip edin
- Vercel Analytics ile performans ölçün

## Destek

Sorun yaşarsanız:
1. README.md ve docs/ klasörünü kontrol edin
2. GitHub Issues'da arayın
3. Yeni issue açın

İyi çalışmalar! 🎉
