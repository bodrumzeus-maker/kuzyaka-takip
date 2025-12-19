# Şantiye Takip Sistemi

Modern ve kullanıcı dostu bir şantiye yönetim sistemi. Next.js ve Supabase ile geliştirilmiştir.

## Özellikler

- 🏗️ Proje yönetimi
- 👷 İşçi takibi
- 🧱 Malzeme envanteri
- 📋 Görev planlaması
- 💰 Masraf takibi
- ⏰ Zaman kayıtları

## Kurulum

1. Repository'yi klonlayın:
```bash
git clone https://github.com/bodrumzeus-maker/kuzyaka-takip.git
cd kuzyaka-takip
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env.local` dosyasını oluşturun ve Supabase bilgilerinizi ekleyin:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Development server'ı başlatın:
```bash
npm run dev
```

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Supabase Veri Yapısını İnceleme

Supabase'deki mevcut tabloları ve veri yapısını görmek için:

```bash
npx tsx scripts/inspect-supabase.ts
```

## Vercel'e Deploy

1. Vercel hesabınızı GitHub repository'nize bağlayın
2. Environment variables'ları Vercel dashboard'da ayarlayın
3. Deploy butonuna tıklayın

Daha fazla bilgi için [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) bakın.

## Teknolojiler

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## Lisans

MIT
