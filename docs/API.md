# API Dokümantasyonu

## Supabase Client Kullanımı

### Kurulum

```typescript
import { supabase } from '@/lib/supabase'
```

## Authentication API

### Kayıt Olma

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe',
      role: 'employer'
    }
  }
})
```

### Giriş Yapma

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Çıkış Yapma

```typescript
const { error } = await supabase.auth.signOut()
```

### Session Kontrolü

```typescript
const { data: { session } } = await supabase.auth.getSession()
```

## Database API

### Worksites (Şantiyeler)

#### Tüm Şantiyeleri Listele

```typescript
const { data, error } = await supabase
  .from('worksites')
  .select('*')
  .order('created_at', { ascending: false })
```

#### Belirli Bir Şantiye

```typescript
const { data, error } = await supabase
  .from('worksites')
  .select('*')
  .eq('id', worksiteId)
  .single()
```

#### Yeni Şantiye Oluştur

```typescript
const { data, error } = await supabase
  .from('worksites')
  .insert({
    name: 'Yeni Şantiye',
    description: 'Açıklama',
    location: 'İstanbul',
    status: 'planning',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    budget: 1000000,
    created_by: userId
  })
  .select()
  .single()
```

#### Şantiye Güncelle

```typescript
const { data, error } = await supabase
  .from('worksites')
  .update({
    status: 'active',
    budget: 1200000
  })
  .eq('id', worksiteId)
  .select()
  .single()
```

#### Şantiye Sil

```typescript
const { error } = await supabase
  .from('worksites')
  .delete()
  .eq('id', worksiteId)
```

### Schedules (İş Programları)

#### Program Listele

```typescript
const { data, error } = await supabase
  .from('schedules')
  .select('*')
  .eq('worksite_id', worksiteId)
  .order('start_date', { ascending: true })
```

#### Yeni Program Oluştur

```typescript
const { data, error } = await supabase
  .from('schedules')
  .insert({
    worksite_id: worksiteId,
    title: 'Temel İşleri',
    description: 'Temel kazısı ve betonu',
    start_date: '2024-01-15',
    end_date: '2024-02-15',
    assigned_to: userId,
    status: 'not_started',
    created_by: currentUserId
  })
  .select()
  .single()
```

### Costs (Maliyetler)

#### Maliyet Listele

```typescript
const { data, error } = await supabase
  .from('costs')
  .select('*')
  .eq('worksite_id', worksiteId)
  .order('date', { ascending: false })
```

#### Yeni Maliyet Ekle

```typescript
const { data, error } = await supabase
  .from('costs')
  .insert({
    worksite_id: worksiteId,
    category: 'Malzeme',
    description: 'Çimento alımı',
    amount: 50000,
    date: '2024-01-10',
    created_by: userId
  })
  .select()
  .single()
```

#### Toplam Maliyet Hesapla

```typescript
const { data, error } = await supabase
  .from('costs')
  .select('amount')
  .eq('worksite_id', worksiteId)

const totalCost = data?.reduce((sum, cost) => sum + parseFloat(cost.amount), 0) || 0
```

### Progress Records (İlerleme Kayıtları)

#### İlerleme Kayıtları Listele

```typescript
const { data, error } = await supabase
  .from('progress_records')
  .select('*')
  .eq('worksite_id', worksiteId)
  .order('recorded_date', { ascending: false })
```

#### Yeni İlerleme Kaydı

```typescript
const { data, error } = await supabase
  .from('progress_records')
  .insert({
    worksite_id: worksiteId,
    schedule_id: scheduleId,
    title: 'Temel İşleri Tamamlandı',
    description: 'Temel betonu dökümü bitti',
    percentage: 100,
    status: 'completed',
    recorded_date: '2024-02-15',
    created_by: userId
  })
  .select()
  .single()
```

### Worksite Assignments (Şantiye Atamaları)

#### Kullanıcı Ata

```typescript
const { data, error } = await supabase
  .from('worksite_assignments')
  .insert({
    worksite_id: worksiteId,
    user_id: userToAssignId
  })
  .select()
  .single()
```

#### Atamayı Kaldır

```typescript
const { error } = await supabase
  .from('worksite_assignments')
  .delete()
  .eq('worksite_id', worksiteId)
  .eq('user_id', userId)
```

## Realtime Subscriptions

### Şantiye Değişikliklerini İzle

```typescript
const channel = supabase
  .channel('worksites-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'worksites'
    },
    (payload) => {
      console.log('Worksite changed:', payload)
      // UI'ı güncelle
    }
  )
  .subscribe()

// Subscription'ı temizle
channel.unsubscribe()
```

### Belirli Bir Şantiyenin Değişikliklerini İzle

```typescript
const channel = supabase
  .channel(`worksite-${worksiteId}`)
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'worksites',
      filter: `id=eq.${worksiteId}`
    },
    (payload) => {
      console.log('Worksite updated:', payload.new)
    }
  )
  .subscribe()
```

### İlerleme Kayıtları Realtime

```typescript
const channel = supabase
  .channel('progress-updates')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'progress_records',
      filter: `worksite_id=eq.${worksiteId}`
    },
    (payload) => {
      console.log('New progress record:', payload.new)
      // Yeni kaydı UI'a ekle
    }
  )
  .subscribe()
```

## Edge Functions

### Şantiye Validasyonu

```typescript
const { data, error } = await supabase.functions.invoke('validate-worksite', {
  body: {
    worksiteId: worksiteId
  },
  headers: {
    Authorization: `Bearer ${session.access_token}`
  }
})

if (data.isValid) {
  console.log('Şantiye geçerli')
} else {
  console.log('Hatalar:', data.errors)
  console.log('Uyarılar:', data.warnings)
}
```

## Filtreleme ve Sıralama

### Filtreleme Operatörleri

```typescript
// Eşittir
.eq('status', 'active')

// Eşit değil
.neq('status', 'cancelled')

// Büyüktür
.gt('budget', 100000)

// Küçüktür
.lt('budget', 1000000)

// Büyük eşit
.gte('budget', 100000)

// Küçük eşit
.lte('budget', 1000000)

// Like (metin arama)
.like('name', '%Şantiye%')

// In (array içinde)
.in('status', ['active', 'planning'])

// Is null
.is('description', null)
```

### Sıralama

```typescript
// Artan sıralama
.order('created_at', { ascending: true })

// Azalan sıralama
.order('budget', { ascending: false })

// Çoklu sıralama
.order('status', { ascending: true })
.order('created_at', { ascending: false })
```

### Sayfalama

```typescript
// İlk 10 kayıt
.range(0, 9)

// 11-20 arası kayıtlar
.range(10, 19)

// Limit ve offset
.limit(10)
```

## Hata Yönetimi

### Hata Kontrolü

```typescript
const { data, error } = await supabase
  .from('worksites')
  .select('*')

if (error) {
  console.error('Hata:', error.message)
  console.error('Detay:', error.details)
  console.error('Hint:', error.hint)
  return
}

// data ile devam et
console.log('Veriler:', data)
```

### Try-Catch Kullanımı

```typescript
try {
  const { data, error } = await supabase
    .from('worksites')
    .insert({ /* ... */ })
    .select()
    .single()
  
  if (error) throw error
  
  console.log('Başarılı:', data)
} catch (error) {
  console.error('İşlem başarısız:', error)
  // Kullanıcıya hata mesajı göster
}
```

## TypeScript Tipleri

### Custom Types

```typescript
import type { 
  User, 
  Worksite, 
  Schedule, 
  Cost, 
  ProgressRecord 
} from '@/lib/supabase'

// Kullanım
const worksite: Worksite = {
  id: 'uuid',
  name: 'Şantiye Adı',
  // ...
}
```

### Database Response Types

```typescript
import type { Database } from '@/lib/database.types'

// Supabase tarafından generate edilebilir
type Worksite = Database['public']['Tables']['worksites']['Row']
type WorksiteInsert = Database['public']['Tables']['worksites']['Insert']
type WorksiteUpdate = Database['public']['Tables']['worksites']['Update']
```

## Performans İpuçları

### Select Optimization

```typescript
// Sadece gerekli alanları seç
.select('id, name, status')

// İlişkili tabloları join et
.select('*, created_by:users(full_name, email)')
```

### Index Kullanımı

Veritabanında zaten oluşturulmuş indexler:
- `worksites.created_by`
- `worksites.status`
- `schedules.worksite_id`
- `costs.worksite_id`
- `progress_records.worksite_id`

### Batch Operations

```typescript
// Toplu insert
const { data, error } = await supabase
  .from('costs')
  .insert([
    { worksite_id, category: 'Malzeme', amount: 10000, date: '2024-01-01', created_by: userId },
    { worksite_id, category: 'İşçilik', amount: 20000, date: '2024-01-02', created_by: userId },
    { worksite_id, category: 'Taşıma', amount: 5000, date: '2024-01-03', created_by: userId }
  ])
```
