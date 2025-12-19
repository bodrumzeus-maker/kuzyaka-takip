# Kuzyaka Köyü Takip Sistemi

Kuzyaka köyü için geliştirilmiş modern web tabanlı takip sistemi.

## 🚀 Kurulum ve Başlangıç

Bu projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edin:

### 1. Projeyi İndirin

Bilgisayarınızda terminali açın ve projeyi klonlayın:

```bash
git clone https://github.com/bodrumzeus-maker/kuzyaka-takip.git
cd kuzyaka-takip
```

### 2. Bağımlılıkları Yükleyin

Gerekli npm paketlerini yükleyin:

```bash
npm install
```

### 3. Supabase Hesabı Oluşturun

1. [Supabase.com](https://supabase.com) adresine gidin
2. Ücretsiz hesap oluşturun veya giriş yapın
3. "New Project" butonuna tıklayarak yeni bir proje oluşturun
4. Proje ayarlarından şu bilgileri not edin:
   - Project URL
   - Anon (public) key

### 4. SQL Migration'ı Çalıştırın

1. Supabase dashboard'unuzda "SQL Editor" bölümüne gidin
2. `supabase/migrations/20231219_init.sql` dosyasındaki SQL kodunu kopyalayın
3. SQL Editor'e yapıştırın ve "RUN" butonuna tıklayın

### 5. Ortam Değişkenlerini Ayarlayın

Proje kök dizininde `.env.local` dosyası oluşturun:

```bash
cp .env.local.example .env.local
```

`.env.local` dosyasını düzenleyin ve Supabase bilgilerinizi girin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6. Uygulamayı Başlatın

Development sunucusunu başlatın:

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📦 Kullanılan Teknolojiler

- **Next.js 15** - React framework
- **Supabase** - Backend ve veritabanı
- **TypeScript** - Tip güvenli JavaScript
- **Tailwind CSS** - Styling

## 🛠️ Diğer Komutlar

```bash
# Production build oluşturma
npm run build

# Production modunda çalıştırma
npm start

# Kod kontrolü (linting)
npm run lint
```

## 📝 Proje Yapısı

```
kuzyaka-takip/
├── supabase/
│   └── migrations/       # Veritabanı migration dosyaları
├── .env.local.example    # Örnek ortam değişkenleri
├── package.json          # Proje bağımlılıkları
└── README.md            # Bu dosya
```

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak isterseniz:

1. Bu repository'yi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/yeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeniOzellik`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.