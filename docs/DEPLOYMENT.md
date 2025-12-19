# Deployment Guide

## Vercel Deployment

### 1. Vercel Hesabına Bağlan

```bash
npm install -g vercel
vercel login
```

### 2. Proje Ayarları

Vercel Dashboard'da:
1. "New Project" tıklayın
2. GitHub repository'sini seçin
3. Framework Preset: Next.js
4. Build Command: `npm run build`
5. Output Directory: `.next`

### 3. Environment Variables

Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Deploy

```bash
vercel --prod
```

## Supabase Production Setup

### 1. Supabase Projesi Oluştur

1. [supabase.com](https://supabase.com) adresinden yeni proje oluşturun
2. Proje adını ve şifresini belirleyin
3. Region seçin (yakın coğrafya = daha hızlı)

### 2. Migration'ları Uygula

```bash
# Supabase CLI ile bağlan
supabase link --project-ref your-project-ref

# Migration'ları production'a push et
supabase db push
```

### 3. Auth Ayarları

Supabase Dashboard → Authentication → Settings:

- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: 
  - `https://your-app.vercel.app`
  - `https://your-app.vercel.app/**`

### 4. API Keys

Supabase Dashboard → Settings → API:

- **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Bu değerleri Vercel environment variables'a ekleyin.

## Database Backup

### Otomatik Backup

Supabase otomatik olarak günlük backup alır:
- Point-in-time recovery (7 gün)
- Daily backups (30 gün saklanır)

### Manuel Backup

```bash
# Database dump al
supabase db dump -f backup.sql

# Restore et
supabase db reset --db-url postgresql://...
```

## Monitoring & Logs

### Vercel Logs

```bash
# Runtime logs
vercel logs your-deployment-url

# Build logs
vercel logs your-deployment-url --build
```

### Supabase Logs

Dashboard → Logs:
- API Logs
- Database Logs
- Auth Logs

## Performance Optimization

### Next.js Optimizations

```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
}
```

### Database Optimizations

1. **Indexes**: Migration'da tanımlı
2. **Connection Pooling**: Supabase otomatik
3. **Query Optimization**: Select'lerde sadece gerekli alanları çek

## Security Checklist

- [ ] Environment variables production'da set edilmiş
- [ ] RLS politikaları aktif ve test edilmiş
- [ ] CORS ayarları doğru yapılandırılmış
- [ ] API keys güvenli şekilde saklanıyor
- [ ] HTTPS enabled
- [ ] Auth redirect URLs doğru
- [ ] Rate limiting aktif

## CI/CD Pipeline

### GitHub Actions (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Troubleshooting

### Build Errors

```bash
# Local build test
npm run build

# TypeScript errors
npm run lint
```

### Database Connection Issues

- Supabase URL doğru mu kontrol edin
- API key'ler güncel mi kontrol edin
- RLS politikaları test edin

### Auth Issues

- Redirect URLs production domain ile eşleşmeli
- Email confirmations production'da aktif
- JWT secret production'a özgü

## Scaling

### Vercel Pro Features

- Daha fazla bandwidth
- Daha hızlı build time
- Daha fazla concurrent builds

### Supabase Pro Features

- Daha fazla database boyutu
- Daha fazla API requests
- Custom domain
- Point-in-time recovery

## Cost Optimization

### Vercel Free Tier

- 100GB bandwidth/month
- Unlimited personal projects
- Yeterli small-medium projects için

### Supabase Free Tier

- 500MB database
- 50,000 monthly active users
- 2GB bandwidth
- Yeterli MVP ve small projects için

## Monitoring Tools

### Recommended Services

1. **Sentry**: Error tracking
2. **LogRocket**: Session replay
3. **Vercel Analytics**: Performance metrics
4. **Supabase Dashboard**: Database metrics

## Maintenance

### Regular Tasks

- [ ] Haftalık backup kontrolü
- [ ] Aylık güvenlik güncellemeleri
- [ ] Quarterly dependency updates
- [ ] Performance monitoring
- [ ] Log review

### Update Strategy

```bash
# Dependencies güncelle
npm update

# Breaking changes kontrolü
npm outdated

# Test et
npm run build
npm run dev

# Deploy
vercel --prod
```
