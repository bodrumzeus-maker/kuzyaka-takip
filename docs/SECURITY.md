# Güvenlik Modeli

## Row Level Security (RLS) Politikaları

### Genel Prensipler
- **En Az Ayrıcalık İlkesi**: Kullanıcılar sadece gerekli verilere erişebilir
- **JWT Claims Kontrolü**: Roller JWT token'dan otomatik olarak çıkarılır
- **Veritabanı Seviyesinde Güvenlik**: API bypass edilemez

### Rol Hiyerarşisi

#### Admin (Yönetici)
- Tüm tablolara tam erişim (SELECT, INSERT, UPDATE, DELETE)
- Tüm kullanıcıları görüntüleme ve düzenleme
- Tüm şantiyeleri yönetme
- Sistem çapında değişiklik yapabilme

#### Moderator (Moderatör)
- Tüm şantiyelere okuma ve yazma erişimi
- Yeni şantiye oluşturabilme
- Şantiye atamaları yapabilme
- Kullanıcıları görüntüleme (sadece kendi profilini düzenleyebilir)

#### Employer (İşveren)
- Sadece kendi oluşturduğu şantiyelere tam erişim
- Atandığı şantiyelere okuma ve yazma erişimi
- Kendi şantiyelerine kullanıcı atayabilme
- Kendi profilini görüntüleme ve düzenleme

## RLS Politika Detayları

### users Tablosu
```sql
-- Kullanıcılar kendi profillerini görebilir
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

-- Adminler tüm kullanıcıları görebilir
CREATE POLICY "Admins can view all users"
    ON public.users FOR SELECT
    USING (public.get_user_role() = 'admin');

-- Kullanıcılar kendi profillerini güncelleyebilir
CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Adminler herhangi bir kullanıcıyı güncelleyebilir
CREATE POLICY "Admins can update any user"
    ON public.users FOR UPDATE
    USING (public.get_user_role() = 'admin');
```

### worksites Tablosu
```sql
-- Kullanıcılar erişim yetkisi olan şantiyeleri görebilir
CREATE POLICY "Users can view worksites they have access to"
    ON public.worksites FOR SELECT
    USING (public.has_worksite_access(id));

-- Admin ve moderatörler şantiye oluşturabilir
CREATE POLICY "Admins and moderators can create worksites"
    ON public.worksites FOR INSERT
    WITH CHECK (public.get_user_role() IN ('admin', 'moderator'));

-- İşverenler de şantiye oluşturabilir
CREATE POLICY "Employers can create worksites"
    ON public.worksites FOR INSERT
    WITH CHECK (public.get_user_role() = 'employer');

-- Sadece yetkili kullanıcılar şantiye güncelleyebilir
-- Admin: Tüm şantiyeler
-- Moderator: Tüm şantiyeler
-- Employer: Kendi şantiyeleri
```

### Erişim Kontrolü Fonksiyonları

#### get_user_role()
Mevcut kullanıcının rolünü JWT'den çıkarır:
```sql
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (SELECT role FROM public.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### has_worksite_access(worksite_uuid)
Kullanıcının şantiye erişim yetkisini kontrol eder:
```sql
CREATE OR REPLACE FUNCTION public.has_worksite_access(worksite_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role_val user_role;
BEGIN
    user_role_val := public.get_user_role();
    
    -- Adminler tüm şantiyelere erişebilir
    IF user_role_val = 'admin' THEN
        RETURN TRUE;
    END IF;
    
    -- Moderatörler tüm şantiyelere erişebilir
    IF user_role_val = 'moderator' THEN
        RETURN TRUE;
    END IF;
    
    -- İşverenler sadece kendi şantiyelerine veya atandıkları şantiyelere erişebilir
    RETURN EXISTS (
        SELECT 1 FROM public.worksites 
        WHERE id = worksite_uuid AND created_by = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.worksite_assignments 
        WHERE worksite_id = worksite_uuid AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## JWT Token Yapısı

### Token Claims
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "admin|moderator|employer",
  "aud": "authenticated",
  "exp": 1234567890
}
```

### Rol Kontrolü
- Roller JWT'nin `user_metadata` alanında saklanır
- Signup sırasında rol atanır
- RLS politikaları JWT'yi otomatik olarak okur

## Güvenlik En İyi Uygulamaları

### 1. Şifre Politikaları
- Minimum 6 karakter
- Supabase Auth tarafından hash'lenir (bcrypt)
- Düz metin olarak asla saklanmaz

### 2. Session Yönetimi
- JWT expiry: 3600 saniye (1 saat)
- Refresh token otomatik yenileme
- Logout ile token iptal edilir

### 3. API Güvenliği
- Tüm istekler JWT token gerektirir
- RLS politikaları API'yi bypass edemez
- Rate limiting (Supabase tarafından yönetilir)

### 4. Veri Bütünlüğü
- Foreign key constraints
- Cascade delete
- Unique constraints
- NOT NULL validations

### 5. Audit Trail
- `created_at` ve `updated_at` timestamp'leri
- `created_by` ile oluşturan kullanıcı kaydı
- Trigger'larla otomatik güncelleme

## Güvenlik Testleri

### Test Senaryoları
1. **Yetkisiz Erişim**: Başka kullanıcının şantiyesine erişmeyi deneyin
2. **Rol Yükseltme**: Employer rolü ile admin işlemi yapmayı deneyin
3. **SQL Injection**: Supabase client güvenli API kullanır
4. **XSS**: React otomatik olarak escape eder

### Güvenlik Kontrol Listesi
- [ ] RLS tüm tablolarda aktif
- [ ] JWT token tüm isteklerde kontrol edilir
- [ ] Roller doğru şekilde atanmış
- [ ] Cascade delete ilişkileri doğru
- [ ] Input validasyonu client ve server tarafında
- [ ] CORS politikaları doğru yapılandırılmış

## Güvenlik Güncellemeleri

### Migration Stratejisi
- Her güvenlik değişikliği yeni migration ile
- Geri alma (rollback) planı hazır olmalı
- Test ortamında önce test edilmeli

### Versiyon Kontrolü
- Migration dosyaları tarih ile versiyonlanır
- Değişiklik geçmişi git ile takip edilir
- Her deployment öncesi güvenlik review

## İletişim

Güvenlik açığı bulursanız lütfen:
1. Public issue açmayın
2. Proje sahibine özel mesaj gönderin
3. Detaylı açıklama ve PoC ekleyin
