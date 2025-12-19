# Kuzyaka Takip - Yapılması Gerekenler

## 🚀 Hızlı Başlangıç (İlk Kullanıcılar İçin)

### 1. Başlamadan Önce İhtiyacınız Olanlar

**Bilgisayarınızda kurulu olmalı:**
- Node.js (versiyon 18 veya üzeri)
- Bir tarayıcı (Chrome, Firefox vb.)
- İnternet bağlantısı

**Hesaplar:**
- Ücretsiz Supabase hesabı (supabase.com'dan)

---

## 📋 Adım Adım Kurulum

### Adım 1: Projeyi İndirin

```bash
# GitHub'dan projeyi bilgisayarınıza indirin
git clone https://github.com/bodrumzeus-maker/kuzyaka-takip.git

# Proje klasörüne girin
cd kuzyaka-takip
```

### Adım 2: Gerekli Paketleri Kurun

```bash
# Terminalde şu komutu çalıştırın (birkaç dakika sürebilir)
npm install
```

### Adım 3: Supabase Hesabı Oluşturun

1. Tarayıcınızda **supabase.com** adresine gidin
2. "Start your project" butonuna tıklayın ve **ücretsiz** hesap açın
3. Yeni bir proje oluşturun:
   - **Proje adı**: kuzyaka-takip
   - **Şifre**: Güçlü bir şifre seçin (bunu unutmayın!)
   - **Bölge**: Frankfurt (size en yakın olanı seçin)

### Adım 4: Veritabanını Hazırlayın

**Kolay Yol (Tavsiye Edilen):**

1. Supabase Dashboard'da (sol menüden) **SQL Editor** seçin
2. Bilgisayarınızda proje klasöründe şu dosyayı açın:
   - `supabase/migrations/20231219000001_initial_schema.sql`
3. İçindeki **tüm metni** kopyalayın
4. Supabase SQL Editor'e yapıştırın
5. **"Run"** butonuna tıklayın

✅ Başarılı mesajı görmelisiniz!

### Adım 5: Bağlantı Bilgilerini Ayarlayın

1. Proje klasöründe `.env.example` dosyasını bulun
2. Bu dosyayı **kopyalayın** ve adını `.env.local` yapın
3. `.env.local` dosyasını bir metin editörüyle açın

**Supabase'den bilgileri alın:**
1. Supabase Dashboard → **Settings** (sol altta) → **API** seçin
2. **Project URL** ve **anon public** key'i kopyalayın
3. `.env.local` dosyasına yapıştırın:

```env
NEXT_PUBLIC_SUPABASE_URL=buraya-project-url-yapistirin
NEXT_PUBLIC_SUPABASE_ANON_KEY=buraya-anon-key-yapistirin
```

### Adım 6: Uygulamayı Başlatın

```bash
# Terminalde bu komutu çalıştırın
npm run dev
```

🎉 Başarılı! Tarayıcınızda **http://localhost:3000** adresine gidin.

---

## 👤 İlk Kullanıcı Oluşturma

### 1. Kayıt Olun

1. Ana sayfada **"Giriş Yap"** butonuna tıklayın
2. **"Kayıt Ol"** linkine tıklayın
3. Formu doldurun:
   - **Ad Soyad**: İsminizi yazın
   - **E-posta**: E-posta adresiniz (gerçek olması şart değil)
   - **Şifre**: En az 6 karakter (örn: `123456`)
   - **Rol**: **Yönetici (Admin)** seçin (ilk kullanıcı olarak)

4. **"Kayıt Ol"** butonuna tıklayın

✅ Otomatik olarak giriş yapılır ve Dashboard'a yönlendirilirsiniz!

---

## 🏗️ Şantiye Ekleme ve Yönetim

### Yöntem 1: Tarayıcı Console Üzerinden (Hızlı Test)

1. Dashboard'dayken **F12** tuşuna basın (Developer Tools açılır)
2. **Console** sekmesine geçin
3. Aşağıdaki kodu kopyalayıp yapıştırın:

```javascript
// Yeni şantiye ekle
const { data, error } = await supabase
  .from('worksites')
  .insert({
    name: 'Test Şantiyesi',
    description: 'İlk test şantiyem',
    location: 'İstanbul, Kadıköy',
    status: 'active',
    budget: 1000000,
    start_date: '2024-01-01',
    end_date: '2024-12-31'
  })
  .select()
  .single()

console.log('Eklenen şantiye:', data)
```

4. **Enter** tuşuna basın
5. Sayfayı yenileyin (F5) - şantiye listede görünecek!

### Yöntem 2: Supabase Dashboard Üzerinden

1. Supabase Dashboard → **Table Editor** seçin
2. **worksites** tablosunu seçin
3. **"Insert row"** butonuna tıklayın
4. Bilgileri doldurun:
   - name: Şantiye adı
   - status: active
   - budget: 1000000
   - start_date: 2024-01-01
   - location: İstanbul
5. **Save** edin

---

## 💰 Maliyet Ekleme

Console'da:

```javascript
// Önce şantiye ID'sini alın
const { data: worksites } = await supabase.from('worksites').select('id').limit(1)
const worksiteId = worksites[0].id

// Maliyet ekleyin
const { data } = await supabase
  .from('costs')
  .insert({
    worksite_id: worksiteId,
    category: 'Malzeme',
    description: 'Çimento ve demir',
    amount: 50000,
    date: '2024-01-15'
  })
  .select()

console.log('Eklenen maliyet:', data)
```

---

## 📊 İlerleme Kaydı Ekleme

```javascript
// Şantiye ID'si ile ilerleme ekle
const { data } = await supabase
  .from('progress_records')
  .insert({
    worksite_id: worksiteId, // yukarıdan aldığınız ID
    title: 'Temel İşleri Tamamlandı',
    description: 'Temel betonu döküldü',
    percentage: 100,
    status: 'completed',
    recorded_date: '2024-02-01'
  })
  .select()

console.log('İlerleme kaydı:', data)
```

---

## 🔧 Sık Karşılaşılan Sorunlar ve Çözümler

### Sorun 1: "Invalid API key" Hatası
**Çözüm:**
- `.env.local` dosyasındaki bilgileri kontrol edin
- Supabase Dashboard'dan doğru URL ve Key'i kopyaladığınızdan emin olun
- Uygulamayı yeniden başlatın: `Ctrl+C` sonra `npm run dev`

### Sorun 2: Sayfa Açılmıyor
**Çözüm:**
```bash
# Terminalde şunu çalıştırın
npx kill-port 3000
npm run dev
```

### Sorun 3: "Row Level Security" Hatası
**Çözüm:**
- SQL migration'ı doğru çalıştırdığınızdan emin olun
- Supabase Dashboard → SQL Editor'de tekrar çalıştırın

### Sorun 4: Kullanıcı Tablosunda Kayıt Yok
**Çözüm:**
- Kayıt olun (signup yapın)
- Migration'da trigger otomatik olarak users tablosuna ekler
- Supabase Dashboard → Table Editor → users'da kontrol edin

---

## 👥 Farklı Rollerde Kullanıcı Oluşturma

### Admin Kullanıcı (Tüm Yetkilere Sahip)
Kayıt sırasında zaten "Admin" seçtiniz ✅

### Moderator Kullanıcı
1. Yeni bir e-posta ile kayıt olun
2. Rol olarak "Moderatör" seçin
3. Tüm şantiyeleri görebilir ama sadece düzenleyebilir (silemez)

### Employer Kullanıcı (Normal Kullanıcı)
1. Yeni bir e-posta ile kayıt olun
2. Rol olarak "İşveren" seçin
3. Sadece kendi oluşturduğu şantiyeleri görebilir

---

## 📱 Kullanılabilir Sayfalar

Dashboard'da sol menüden erişebileceğiniz sayfalar:

1. **🏠 Ana Sayfa**: İstatistikler ve özet bilgiler
2. **🏗️ Şantiyeler**: Tüm şantiyeler listesi
3. **📅 İş Programı**: Programlar ve görevler
4. **💰 Maliyetler**: Harcamalar ve maliyet takibi
5. **📊 İlerleme**: İlerleme kayıtları

---

## 🎓 Daha Fazla Bilgi

### Dokümantasyon
Proje klasöründe `docs/` klasörüne bakın:
- **QUICKSTART.md**: Detaylı başlangıç rehberi
- **API.md**: Kod örnekleri
- **SECURITY.md**: Güvenlik bilgileri

### Yardım Gerekirse
1. README.md dosyasını okuyun
2. GitHub'da issue açın
3. docs/ klasöründeki dosyalara bakın

---

## ✅ Özet Kontrol Listesi

Kurulum tamamlandı mı?

- [ ] Node.js kurulu (kontrol: `node --version`)
- [ ] Proje indirildi (`git clone`)
- [ ] Paketler kuruldu (`npm install`)
- [ ] Supabase hesabı açıldı
- [ ] Supabase'de proje oluşturuldu
- [ ] SQL migration çalıştırıldı
- [ ] `.env.local` dosyası oluşturuldu
- [ ] Bağlantı bilgileri girildi
- [ ] Uygulama başlatıldı (`npm run dev`)
- [ ] Kayıt olundu (Admin rolüyle)
- [ ] Dashboard'a giriş yapıldı
- [ ] İlk şantiye eklendi
- [ ] Şantiye listede görünüyor

Hepsi ✅ ise başarılı! 🎉

---

## 🚀 Sonraki Adımlar

1. **Daha fazla şantiye ekleyin**
2. **Maliyetleri kaydedin**
3. **İlerleme takibi yapın**
4. **Farklı kullanıcılar ekleyin**
5. **Şantiye atamalarını test edin**

İyi çalışmalar! 💪
