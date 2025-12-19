# Kuzyaka Takip - İş/Şantiye Takip Sistemi

Supabase tabanlı profesyonel iş ve şantiye takip uygulaması. JWT tabanlı rol yönetimi, RLS güvenlik politikaları ve realtime özellikleriyle kapsamlı bir takip sistemi.

## 🚀 Özellikler

### Kimlik Doğrulama & Yetkilendirme
- **Supabase Auth** ile güvenli kimlik doğrulama
- **JWT Claims** tabanlı rol yönetimi (Admin, Moderator, Employer)
- **Row Level Security (RLS)** politikaları ile veritabanı seviyesinde güvenlik
- En az ayrıcalık ilkesi (Principle of Least Privilege)

### Şantiye Yönetimi
- Şantiye oluşturma, düzenleme ve silme
- Durum takibi (Planlama, Aktif, Duraklatıldı, Tamamlandı, İptal)
- Bütçe ve tarih yönetimi
- Konum bilgisi

### İş Programı
- İş programları oluşturma
- Görev atama
- Başlangıç ve bitiş tarihleri
- Durum takibi (Başlamadı, Devam Ediyor, Tamamlandı, Engellenmiş)

### Maliyet Takibi
- Kategori bazlı maliyet kaydı
- Tarihli harcama takibi
- Toplam maliyet raporlama

### İlerleme Kaydı
- Yüzdelik ilerleme takibi
- Durum bazlı raporlama
- Tarihli kayıtlar

## 🏗️ Teknoloji Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Edge Functions)
- **Database**: PostgreSQL with RLS
- **Authentication**: Supabase Auth (JWT)
- **Styling**: Inline CSS (Minimal dependencies)

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Supabase hesabı

### Adımlar

1. Repository'yi klonlayın:
```bash
git clone https://github.com/bodrumzeus-maker/kuzyaka-takip.git
cd kuzyaka-takip
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env.example` dosyasını `.env.local` olarak kopyalayın ve Supabase bilgilerinizi girin:
```bash
cp .env.example .env.local
```

4. `.env.local` dosyasını düzenleyin:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Supabase migration'larını çalıştırın:
```bash
# Supabase CLI'yi yükleyin (eğer yoksa)
npm install -g supabase

# Migration'ları uygulayın
supabase db push
```

6. Uygulamayı başlatın:
```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 🗄️ Veritabanı Yapısı

### Tablolar

#### users
- Kullanıcı profil bilgileri
- Roller: admin, moderator, employer
- Auth.users tablosuyla ilişkili

#### worksites
- Şantiye/İş bilgileri
- Durum, bütçe, tarih yönetimi
- RLS politikalarıyla korunmuş

#### worksite_assignments
- Kullanıcı-şantiye atamaları
- Erişim kontrolü

#### schedules
- İş programları
- Görev atamaları
- Tarih ve durum takibi

#### costs
- Maliyet kayıtları
- Kategori ve tutar bilgisi

#### progress_records
- İlerleme kayıtları
- Yüzdelik tamamlanma
- Durum takibi

### RLS Politikaları

Her tablo için detaylı RLS politikaları uygulanmıştır:
- **Admin**: Tüm kayıtlara tam erişim
- **Moderator**: Tüm şantiyelere okuma/yazma erişimi
- **Employer**: Sadece kendi oluşturduğu veya atandığı şantiyelere erişim

## 🔒 Güvenlik

### Row Level Security (RLS)
Tüm tablolarda RLS aktif:
- Kullanıcılar sadece yetkili oldukları verilere erişebilir
- JWT claims üzerinden otomatik rol kontrolü
- Veritabanı seviyesinde güvenlik

### En Az Ayrıcalık İlkesi
- Her rol sadece gerekli yetkilere sahip
- Cascade delete ile veri bütünlüğü
- Foreign key constraints

### Versiyonlu Migrations
- Tüm veritabanı değişiklikleri migration'larla yönetilir
- Geri alınabilir değişiklikler
- Versiyon kontrolü

## 🔄 Realtime Özellikler

Supabase Realtime'a hazır altyapı:
```typescript
// Örnek realtime subscription
const channel = supabase
  .channel('worksites-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'worksites' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

## ⚡ Edge Functions

Edge Functions için örnek yapı oluşturulmuştur:
- `validate-worksite`: Şantiye validasyon fonksiyonu
- JWT token bazlı kimlik doğrulama
- CORS desteği

## 🎯 Kullanım

### Kayıt Olma
1. `/auth/register` sayfasına gidin
2. E-posta, şifre ve rol seçin
3. Kayıt olun

### Giriş Yapma
1. `/auth/login` sayfasına gidin
2. E-posta ve şifrenizi girin
3. Dashboard'a yönlendirileceksiniz

### Şantiye Yönetimi
1. Dashboard'dan "Şantiyeler" menüsüne gidin
2. "Yeni Şantiye" butonuna tıklayın
3. Gerekli bilgileri doldurun

### Rol Bazlı Erişim
- **Admin**: Tüm şantiyeleri görebilir ve yönetebilir
- **Moderator**: Tüm şantiyeleri görebilir ve düzenleyebilir
- **Employer**: Sadece kendi şantiyelerini yönetebilir

## 📝 Geliştirme

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Supabase Local Development
```bash
# Supabase'i local olarak başlat
npm run supabase:start

# Status kontrolü
npm run supabase:status

# Durdur
npm run supabase:stop
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 İletişim

Proje Sahibi - [@bodrumzeus-maker](https://github.com/bodrumzeus-maker)

Proje Link: [https://github.com/bodrumzeus-maker/kuzyaka-takip](https://github.com/bodrumzeus-maker/kuzyaka-takip)