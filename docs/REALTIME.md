# Realtime Features Guide

Bu döküman Supabase Realtime özellikleri ile canlı veri güncellemelerinin nasıl kullanılacağını açıklar.

## Realtime Nedir?

Supabase Realtime, PostgreSQL değişikliklerini gerçek zamanlı olarak dinlemenizi sağlar. Bir kullanıcı veriyi güncellediğinde, diğer tüm kullanıcılar anında güncellemeleri görür.

## Kurulum

Realtime özelliği Supabase'de varsayılan olarak aktiftir. Kod tarafında ekstra kurulum gerekmez.

## Temel Kullanım

### 1. Tablo Değişikliklerini Dinleme

```typescript
// Şantiyelerdeki tüm değişiklikleri dinle
const channel = supabase
  .channel('worksites-all-changes')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE tümü
      schema: 'public',
      table: 'worksites'
    },
    (payload) => {
      console.log('Değişiklik:', payload)
      // payload.eventType: 'INSERT' | 'UPDATE' | 'DELETE'
      // payload.new: Yeni veri (INSERT ve UPDATE için)
      // payload.old: Eski veri (UPDATE ve DELETE için)
    }
  )
  .subscribe()

// Subscription'ı temizle (component unmount'ta)
return () => {
  channel.unsubscribe()
}
```

### 2. Spesifik Event Dinleme

```typescript
// Sadece yeni eklemeleri dinle
const channel = supabase
  .channel('worksites-inserts')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'worksites'
    },
    (payload) => {
      console.log('Yeni şantiye:', payload.new)
      // UI'a yeni şantiyeyi ekle
    }
  )
  .subscribe()
```

```typescript
// Sadece güncellemeleri dinle
const channel = supabase
  .channel('worksites-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'worksites'
    },
    (payload) => {
      console.log('Güncellenen şantiye:', payload.new)
      console.log('Eski değer:', payload.old)
      // UI'daki şantiyeyi güncelle
    }
  )
  .subscribe()
```

```typescript
// Sadece silmeleri dinle
const channel = supabase
  .channel('worksites-deletes')
  .on(
    'postgres_changes',
    {
      event: 'DELETE',
      schema: 'public',
      table: 'worksites'
    },
    (payload) => {
      console.log('Silinen şantiye:', payload.old)
      // UI'dan şantiyeyi kaldır
    }
  )
  .subscribe()
```

## React Component Örnekleri

### Örnek 1: Canlı Şantiye Listesi

```typescript
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Worksite } from '@/lib/supabase'

export default function LiveWorksiteList() {
  const [worksites, setWorksites] = useState<Worksite[]>([])

  useEffect(() => {
    // İlk yükleme
    loadWorksites()

    // Realtime subscription
    const channel = supabase
      .channel('worksites-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'worksites'
        },
        handleRealtimeUpdate
      )
      .subscribe()

    // Cleanup
    return () => {
      channel.unsubscribe()
    }
  }, [])

  const loadWorksites = async () => {
    const { data } = await supabase
      .from('worksites')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setWorksites(data)
  }

  const handleRealtimeUpdate = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      // Yeni şantiye eklendi
      setWorksites(prev => [payload.new, ...prev])
    } else if (payload.eventType === 'UPDATE') {
      // Şantiye güncellendi
      setWorksites(prev =>
        prev.map(w => w.id === payload.new.id ? payload.new : w)
      )
    } else if (payload.eventType === 'DELETE') {
      // Şantiye silindi
      setWorksites(prev =>
        prev.filter(w => w.id !== payload.old.id)
      )
    }
  }

  return (
    <div>
      <h2>Canlı Şantiye Listesi</h2>
      {worksites.map(worksite => (
        <div key={worksite.id}>
          <h3>{worksite.name}</h3>
          <p>{worksite.status}</p>
        </div>
      ))}
    </div>
  )
}
```

### Örnek 2: Canlı Maliyet Toplamı

```typescript
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LiveCostTotal({ worksiteId }: { worksiteId: string }) {
  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    // İlk hesaplama
    calculateTotal()

    // Realtime subscription
    const channel = supabase
      .channel(`costs-${worksiteId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'costs',
          filter: `worksite_id=eq.${worksiteId}`
        },
        () => {
          // Her değişiklikte yeniden hesapla
          calculateTotal()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [worksiteId])

  const calculateTotal = async () => {
    const { data } = await supabase
      .from('costs')
      .select('amount')
      .eq('worksite_id', worksiteId)

    const total = data?.reduce((sum, cost) => sum + parseFloat(cost.amount), 0) || 0
    setTotalCost(total)
  }

  return (
    <div>
      <h3>Toplam Maliyet</h3>
      <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
        ₺{totalCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
      </p>
      <small>Canlı güncelleniyor...</small>
    </div>
  )
}
```

### Örnek 3: Canlı Bildirimler

```typescript
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning'
  timestamp: Date
}

export default function LiveNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const channel = supabase
      .channel('all-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'worksites'
        },
        (payload) => {
          addNotification({
            id: Date.now().toString(),
            message: `Yeni şantiye eklendi: ${payload.new.name}`,
            type: 'success',
            timestamp: new Date()
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'worksites'
        },
        (payload) => {
          if (payload.old.status !== payload.new.status) {
            addNotification({
              id: Date.now().toString(),
              message: `${payload.new.name} durumu değişti: ${payload.new.status}`,
              type: 'info',
              timestamp: new Date()
            })
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'progress_records'
        },
        (payload) => {
          addNotification({
            id: Date.now().toString(),
            message: `Yeni ilerleme kaydı: ${payload.new.title}`,
            type: 'success',
            timestamp: new Date()
          })
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]) // Son 10 bildirim

    // 5 saniye sonra otomatik kaldır
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }, 5000)
  }

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 1000
    }}>
      {notifications.map(notif => (
        <div
          key={notif.id}
          style={{
            padding: '1rem',
            marginBottom: '0.5rem',
            backgroundColor: notif.type === 'success' ? '#dcfce7' :
                             notif.type === 'info' ? '#e0f2fe' : '#fef3c7',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <p style={{ fontWeight: 'bold' }}>{notif.message}</p>
          <small>{notif.timestamp.toLocaleTimeString('tr-TR')}</small>
        </div>
      ))}
    </div>
  )
}
```

## Filtreler ile Kullanım

### Belirli Bir Kaydı Dinleme

```typescript
// Sadece belirli bir şantiyeyi dinle
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
      console.log('Bu şantiye güncellendi:', payload.new)
    }
  )
  .subscribe()
```

### Kullanıcıya Özel Veriler

```typescript
// Sadece kendi oluşturduğum şantiyeleri dinle
const { data: { user } } = await supabase.auth.getUser()

const channel = supabase
  .channel('my-worksites')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'worksites',
      filter: `created_by=eq.${user.id}`
    },
    (payload) => {
      console.log('Şantiyemde değişiklik:', payload)
    }
  )
  .subscribe()
```

## Çoklu Tablo Dinleme

```typescript
// Hem şantiyeleri hem maliyetleri dinle
const channel = supabase
  .channel('worksite-and-costs')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'worksites'
    },
    (payload) => {
      console.log('Şantiye değişti:', payload)
    }
  )
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'costs'
    },
    (payload) => {
      console.log('Maliyet değişti:', payload)
    }
  )
  .subscribe()
```

## Presence (Kimler Online)

```typescript
// Kimler şantiye detay sayfasında görmek için
const channel = supabase.channel(`worksite-${worksiteId}`, {
  config: {
    presence: {
      key: userId
    }
  }
})

// Presence state'i track et
channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState()
    console.log('Online kullanıcılar:', Object.keys(state))
  })
  .on('presence', { event: 'join' }, ({ key }) => {
    console.log('Katıldı:', key)
  })
  .on('presence', { event: 'leave' }, ({ key }) => {
    console.log('Ayrıldı:', key)
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        user_id: userId,
        online_at: new Date().toISOString()
      })
    }
  })
```

## Broadcast (Mesajlaşma)

```typescript
// Kullanıcılar arası mesajlaşma
const channel = supabase.channel('team-chat')

// Mesaj gönder
channel.send({
  type: 'broadcast',
  event: 'message',
  payload: { text: 'Merhaba!', user: userName }
})

// Mesaj al
channel
  .on('broadcast', { event: 'message' }, ({ payload }) => {
    console.log('Yeni mesaj:', payload.text, 'from', payload.user)
  })
  .subscribe()
```

## Performance İpuçları

### 1. Channel'ları Temizleyin

```typescript
useEffect(() => {
  const channel = supabase.channel('...')
  // ... subscription code
  
  // MUTLAKA cleanup yapın
  return () => {
    channel.unsubscribe()
  }
}, [dependencies])
```

### 2. Debounce Kullanın

```typescript
import { debounce } from 'lodash'

const handleUpdate = debounce((payload) => {
  // Çok sık güncelleme gelirse son 500ms'de sadece 1 kere çalışır
  updateUI(payload)
}, 500)

channel.on('postgres_changes', { ... }, handleUpdate)
```

### 3. Filtreleri Kullanın

```typescript
// Tüm değişiklikleri dinlemek yerine
.on('postgres_changes', { event: '*', ... })

// Sadece gerekli olanları dinleyin
.on('postgres_changes', { 
  event: 'UPDATE',
  filter: `worksite_id=eq.${worksiteId}`
})
```

## Troubleshooting

### Realtime Çalışmıyor

1. **Supabase Dashboard kontrol edin**:
   - Database → Replication → Enable realtime for tables
   - `worksites`, `costs`, `schedules`, `progress_records` için enable edin

2. **RLS Politikalarını kontrol edin**:
   - Realtime da RLS politikalarına tabidir
   - Kullanıcının veriyi görmesi için SELECT yetkisi olmalı

3. **Channel ismini kontrol edin**:
   - Her channel unique olmalı
   - Aynı channel'ı birden fazla component'te kullanmayın

### Connection Sorunları

```typescript
channel
  .on('system', { event: '*' }, (payload) => {
    console.log('System event:', payload)
  })
  .subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('✓ Connected')
    } else if (status === 'CHANNEL_ERROR') {
      console.log('✗ Connection failed')
    } else if (status === 'TIMED_OUT') {
      console.log('✗ Timed out')
    }
  })
```

## Güvenlik

⚠️ **Önemli**: Realtime subscription'lar RLS politikalarına tabidir. Kullanıcı görmeye yetkili olmadığı verileri realtime ile de göremez.

```typescript
// ✓ Güvenli: RLS politikaları uygulanır
const channel = supabase
  .channel('worksites')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'worksites'
  }, handler)
  .subscribe()

// Kullanıcı sadece yetkili olduğu şantiyelerin değişikliklerini görür
```

## Sonuç

Realtime özellikler, kullanıcı deneyimini büyük ölçüde iyileştirir. Ancak dikkatli kullanılmalıdır:

- ✓ Channel'ları temizleyin
- ✓ Filtreleri kullanın
- ✓ Debounce uygulayın
- ✓ RLS politikalarına güvenin
- ✓ Connection durumunu handle edin
