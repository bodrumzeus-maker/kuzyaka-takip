# Kuzyaka Köyü Takip Sistemi - Detaylı Kurulum Rehberi

Bu rehber, projeyi sıfırdan kurmak ve çalıştırmak için gereken tüm adımları detaylı bir şekilde açıklar.

## Ön Gereksinimler

Sisteminizde aşağıdaki yazılımların yüklü olması gerekir:

- **Node.js** (v18 veya üzeri) - [nodejs.org](https://nodejs.org)
- **npm** (Node.js ile birlikte gelir)
- **Git** - [git-scm.com](https://git-scm.com)

### Node.js Kurulumu Kontrolü

Terminalinizde aşağıdaki komutları çalıştırarak kurulu olup olmadığını kontrol edebilirsiniz:

```bash
node --version
npm --version
git --version
```

## Adım Adım Kurulum

### Adım 1: Bilgisayarınızda Terminali Açın

**Windows:**
- `Win + R` tuşlarına basın
- `cmd` veya `powershell` yazıp Enter'a basın

**Mac:**
- `Cmd + Space` tuşlarına basın
- `terminal` yazıp Enter'a basın

**Linux:**
- `Ctrl + Alt + T` tuşlarına basın

### Adım 2: Projeyi Git Clone ile İndirin

Terminalinizde çalışmak istediğiniz klasöre gidin ve projeyi klonlayın:

```bash
# İstediğiniz bir klasöre gidin (örnek)
cd ~/projeler

# Projeyi klonlayın
git clone https://github.com/bodrumzeus-maker/kuzyaka-takip.git

# Proje klasörüne girin
cd kuzyaka-takip
```

### Adım 3: npm install ile Paketleri Yükleyin

Proje bağımlılıklarını yüklemek için şu komutu çalıştırın:

```bash
npm install
```

Bu işlem 1-2 dakika sürebilir. İşlem tamamlandığında "added X packages" gibi bir mesaj göreceksiniz.

### Adım 4: Supabase.com'da Hesap Açın

1. Tarayıcınızda [https://supabase.com](https://supabase.com) adresine gidin

2. Sağ üst köşedeki **"Start your project"** veya **"Sign Up"** butonuna tıklayın

3. GitHub hesabınızla giriş yapabilir veya email ile kayıt olabilirsiniz

4. Giriş yaptıktan sonra **"New Project"** butonuna tıklayın

5. Proje bilgilerini doldurun:
   - **Name:** kuzyaka-takip
   - **Database Password:** Güvenli bir şifre belirleyin (bunu kaydetmeyi unutmayın!)
   - **Region:** Size en yakın bölgeyi seçin (örn: Europe West - Frankfurt)
   - **Pricing Plan:** Free seçebilirsiniz

6. **"Create new project"** butonuna tıklayın

7. Proje oluşturulurken 1-2 dakika bekleyin

### Adım 5: Supabase Proje Bilgilerini Alın

Projeniz oluştuktan sonra:

1. Sol menüden **"Settings"** (Ayarlar) bölümüne gidin

2. **"API"** sekmesine tıklayın

3. Şu bilgileri not edin:
   - **Project URL:** `https://xxxxxxxxxxxxx.supabase.co` şeklinde
   - **anon public key:** `eyJhb...` ile başlayan uzun bir anahtar

### Adım 6: SQL Migration'ı Çalıştırın

1. Supabase dashboard'unuzda sol menüden **"SQL Editor"** bölümüne gidin

2. **"New query"** butonuna tıklayın

3. Proje klasöründeki `supabase/migrations/20231219_init.sql` dosyasını bir metin editörü ile açın

4. Dosyadaki tüm SQL kodunu kopyalayın

5. Supabase SQL Editor'e yapıştırın

6. Sağ alttaki **"Run"** veya **"▶ RUN"** butonuna tıklayın

7. "Success. No rows returned" mesajını görmelisiniz

8. Sol menüden **"Table Editor"** bölümüne giderek `etkinlikler` ve `katilimcilar` tablolarının oluştuğunu kontrol edebilirsiniz

### Adım 7: .env.local Dosyasını Oluşturun

1. Proje klasöründe `.env.local.example` dosyasını kopyalayın:

```bash
cp .env.local.example .env.local
```

**Windows PowerShell için:**
```powershell
Copy-Item .env.local.example .env.local
```

2. `.env.local` dosyasını bir metin editörü ile açın (VS Code, Notepad++, vb.)

3. Dosyayı aşağıdaki gibi düzenleyin ve Adım 5'te aldığınız bilgileri girin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Dosyayı kaydedin

⚠️ **Önemli:** `.env.local` dosyası hassas bilgiler içerir ve Git'e eklenmemelidir. `.gitignore` dosyasında zaten eklidir.

### Adım 8: npm run dev ile Uygulamayı Başlatın

Artık uygulamayı çalıştırmaya hazırsınız!

```bash
npm run dev
```

Birkaç saniye sonra şu mesajı göreceksiniz:

```
▲ Next.js X.X.X
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in Xms
```

### Adım 9: Tarayıcıda Açın

1. Tarayıcınızı açın (Chrome, Firefox, Safari, vb.)

2. Adres çubuğuna `http://localhost:3000` yazın ve Enter'a basın

3. **"Kuzyaka Köyü Takip Sistemi"** başlıklı ana sayfayı görmelisiniz

🎉 **Tebrikler!** Kurulum başarıyla tamamlandı!

## Sorun Giderme

### Port 3000 zaten kullanılıyor

Eğer "Port 3000 is already in use" hatası alırsanız:

```bash
# Farklı bir port kullanın
npm run dev -- -p 3001
```

Sonra tarayıcıda `http://localhost:3001` adresine gidin.

### npm install hatası

Eğer paket yüklemede sorun yaşıyorsanız:

```bash
# npm cache'i temizleyin
npm cache clean --force

# Tekrar deneyin
npm install
```

### Supabase bağlantı hatası

- `.env.local` dosyasındaki URL ve KEY'lerin doğru olduğundan emin olun
- Değerlerin başında/sonunda boşluk olmadığından emin olun
- Supabase projenizin aktif olduğundan emin olun

### TypeScript hatası

Eğer TypeScript ile ilgili hatalar alırsanız:

```bash
# node_modules ve build dosyalarını temizleyin
rm -rf node_modules .next
npm install
```

## Geliştirme İpuçları

### Kod Değişikliklerini Görme

Kod değişiklikleri otomatik olarak tarayıcıya yansır (Hot Reload). Kaydettiğiniz anda sayfa kendini yeniler.

### Veritabanını Görüntüleme

Supabase dashboard'unuzda **"Table Editor"** bölümünden tablolarınızı görebilir, veri ekleyebilir veya düzenleyebilirsiniz.

### Loglara Bakma

Uygulamanız çalışırken terminal penceresinde logları görebilirsiniz. Hata ayıklama için faydalıdır.

## Sonraki Adımlar

Kurulum tamamlandıktan sonra:

1. `src/app/page.tsx` dosyasını düzenleyerek ana sayfayı özelleştirebilirsiniz
2. Yeni sayfalar ekleyebilirsiniz (örn: `src/app/etkinlikler/page.tsx`)
3. Supabase tablolarınıza veri ekleyerek test edebilirsiniz

## Yardım ve Destek

Herhangi bir sorunla karşılaşırsanız:

- GitHub Issues bölümünden yardım isteyebilirsiniz
- Supabase dokümanlarına bakabilirsiniz: [https://supabase.com/docs](https://supabase.com/docs)
- Next.js dokümanlarına bakabilirsiniz: [https://nextjs.org/docs](https://nextjs.org/docs)
