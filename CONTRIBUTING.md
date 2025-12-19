# Contributing to Kuzyaka Takip

Kuzyaka Takip projesine katkıda bulunmayı düşündüğünüz için teşekkür ederiz!

## Nasıl Katkıda Bulunulur

### 1. Repository'yi Fork Edin

GitHub'da repository'nin sağ üst köşesindeki "Fork" butonuna tıklayın.

### 2. Fork'u Klonlayın

```bash
git clone https://github.com/your-username/kuzyaka-takip.git
cd kuzyaka-takip
```

### 3. Branch Oluşturun

```bash
git checkout -b feature/amazing-feature
```

### 4. Değişikliklerinizi Yapın

- Kod standartlarına uyun
- TypeScript kullanın
- Değişikliklerinizi test edin
- Anlamlı commit mesajları yazın

### 5. Commit Edin

```bash
git add .
git commit -m "feat: Add amazing feature"
```

#### Commit Message Formatı

Conventional Commits formatını kullanıyoruz:

- `feat:` Yeni özellik
- `fix:` Bug fix
- `docs:` Dokümantasyon değişiklikleri
- `style:` Kod formatı (whitespace, noktalı virgül, vb.)
- `refactor:` Ne bug fix ne de özellik eklemeyen kod değişikliği
- `perf:` Performance iyileştirmesi
- `test:` Test ekleme veya düzeltme
- `chore:` Build process veya auxiliary tool değişiklikleri

### 6. Push Edin

```bash
git push origin feature/amazing-feature
```

### 7. Pull Request Oluşturun

GitHub'da repository'nize gidin ve "New Pull Request" butonuna tıklayın.

## Geliştirme Ortamı Kurulumu

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Git

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Environment variables ayarla
cp .env.example .env.local
# .env.local dosyasını düzenleyin

# Development server'ı başlat
npm run dev
```

## Kod Standartları

### TypeScript

- Strict mode kullanın
- Any type kullanmaktan kaçının
- Interface'leri tip tanımlamaları için kullanın

### React

- Functional components kullanın
- Hooks doğru şekilde kullanın
- Props için type tanımlamaları yapın

### Naming Conventions

- **Dosyalar**: kebab-case (örn: `worksite-list.tsx`)
- **Components**: PascalCase (örn: `WorksiteList`)
- **Functions**: camelCase (örn: `getUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (örn: `MAX_ITEMS`)

### Code Style

```typescript
// İyi ✓
const getUserProfile = async (userId: string): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// Kötü ✗
async function getUserProfile(userId) {
  const result = await supabase.from('users').select('*').eq('id', userId).single()
  if (result.error) throw result.error
  return result.data
}
```

## Testing

```bash
# Tests çalıştır (eğer varsa)
npm test

# Lint kontrolü
npm run lint

# Build kontrolü
npm run build
```

## Database Migrations

Yeni migration oluştururken:

```sql
-- Migration başlığı ve açıklama ekle
-- Version: YYYYMMDD_NNN
-- Description: What this migration does

-- SQL kodunuz
```

Migration dosya adı: `YYYYMMDD000NNN_description.sql`

## Documentation

Yeni özellikler eklerken:

- README.md'yi güncelleyin
- API.md'ye örnek kullanım ekleyin
- Gerekirse SECURITY.md'yi güncelleyin
- Code içinde JSDoc yorumları ekleyin

## Pull Request Checklist

Pull request göndermeden önce:

- [ ] Kod çalışıyor ve test edildi
- [ ] Lint hataları yok
- [ ] Build başarılı
- [ ] TypeScript hataları yok
- [ ] Dokümantasyon güncellendi
- [ ] Commit mesajları anlamlı
- [ ] Branch güncel (main branch'ten merge edildi)

## Code Review Process

1. Pull request otomatik olarak review'a alınır
2. Maintainer'lar yorumlar ve değişiklik önerileri yapar
3. Gerekli değişiklikler yapılır
4. Approve edildikten sonra merge edilir

## İletişim

- Issues: GitHub Issues kullanın
- Discussions: GitHub Discussions kullanın
- Security: Güvenlik sorunları için SECURITY.md'ye bakın

## License

Katkıda bulunarak, katkılarınızın projenin lisansı (MIT) altında lisanslanacağını kabul etmiş olursunuz.

## Teşekkürler!

Zaman ayırdığınız ve projeye katkıda bulunduğunuz için teşekkür ederiz! 🎉
