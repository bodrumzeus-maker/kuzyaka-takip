-- Şantiye Takip Sistemi - Supabase Veritabanı Şeması
-- Bu SQL dosyasını Supabase Dashboard > SQL Editor'da çalıştırın

-- Projeler tablosu
CREATE TABLE IF NOT EXISTS projeler (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ad VARCHAR(255) NOT NULL,
    aciklama TEXT,
    baslangic_tarihi DATE NOT NULL,
    bitis_tarihi DATE,
    durum VARCHAR(50) CHECK (durum IN ('planlaniyor', 'devam_ediyor', 'tamamlandi', 'askida')) DEFAULT 'planlaniyor',
    butce DECIMAL(15, 2),
    lokasyon VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İşçiler tablosu
CREATE TABLE IF NOT EXISTS isciler (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    soyad VARCHAR(100) NOT NULL,
    telefon VARCHAR(20),
    email VARCHAR(255),
    pozisyon VARCHAR(100) NOT NULL,
    proje_id UUID REFERENCES projeler(id) ON DELETE SET NULL,
    gunluk_ucret DECIMAL(10, 2),
    baslangic_tarihi DATE NOT NULL,
    durum VARCHAR(50) CHECK (durum IN ('aktif', 'izinli', 'ayrıldi')) DEFAULT 'aktif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Malzemeler tablosu
CREATE TABLE IF NOT EXISTS malzemeler (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ad VARCHAR(255) NOT NULL,
    kategori VARCHAR(100),
    birim VARCHAR(50) NOT NULL,
    miktar DECIMAL(15, 3) NOT NULL DEFAULT 0,
    birim_fiyat DECIMAL(10, 2),
    proje_id UUID REFERENCES projeler(id) ON DELETE SET NULL,
    tedarikci VARCHAR(255),
    aciklama TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Görevler tablosu
CREATE TABLE IF NOT EXISTS gorevler (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    baslik VARCHAR(255) NOT NULL,
    aciklama TEXT,
    proje_id UUID REFERENCES projeler(id) ON DELETE CASCADE,
    atanan_isci_id UUID REFERENCES isciler(id) ON DELETE SET NULL,
    durum VARCHAR(50) CHECK (durum IN ('beklemede', 'devam_ediyor', 'tamamlandi', 'iptal')) DEFAULT 'beklemede',
    oncelik VARCHAR(50) CHECK (oncelik IN ('dusuk', 'orta', 'yuksek', 'acil')) DEFAULT 'orta',
    baslangic_tarihi DATE,
    bitis_tarihi DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexler (performans için)
CREATE INDEX IF NOT EXISTS idx_isciler_proje_id ON isciler(proje_id);
CREATE INDEX IF NOT EXISTS idx_malzemeler_proje_id ON malzemeler(proje_id);
CREATE INDEX IF NOT EXISTS idx_gorevler_proje_id ON gorevler(proje_id);
CREATE INDEX IF NOT EXISTS idx_gorevler_atanan_isci_id ON gorevler(atanan_isci_id);

-- Updated_at otomatik güncelleme için trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Her tablo için updated_at trigger'ları
DROP TRIGGER IF EXISTS update_projeler_updated_at ON projeler;
CREATE TRIGGER update_projeler_updated_at
    BEFORE UPDATE ON projeler
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_isciler_updated_at ON isciler;
CREATE TRIGGER update_isciler_updated_at
    BEFORE UPDATE ON isciler
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_malzemeler_updated_at ON malzemeler;
CREATE TRIGGER update_malzemeler_updated_at
    BEFORE UPDATE ON malzemeler
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gorevler_updated_at ON gorevler;
CREATE TRIGGER update_gorevler_updated_at
    BEFORE UPDATE ON gorevler
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) politikaları
-- Şimdilik tüm tablolar için genel okuma/yazma izni veriyoruz
-- Üretim ortamında bu politikaları kullanıcı kimlik doğrulamasına göre düzenlemelisiniz

ALTER TABLE projeler ENABLE ROW LEVEL SECURITY;
ALTER TABLE isciler ENABLE ROW LEVEL SECURITY;
ALTER TABLE malzemeler ENABLE ROW LEVEL SECURITY;
ALTER TABLE gorevler ENABLE ROW LEVEL SECURITY;

-- Herkese okuma ve yazma izni (geliştirme için)
-- NOT: Üretim ortamında bu politikaları güvenlik gereksinimlerinize göre güncelleyin
CREATE POLICY "Herkese açık erişim" ON projeler FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Herkese açık erişim" ON isciler FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Herkese açık erişim" ON malzemeler FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Herkese açık erişim" ON gorevler FOR ALL USING (true) WITH CHECK (true);

-- Örnek veriler (isteğe bağlı)
INSERT INTO projeler (ad, aciklama, baslangic_tarihi, durum, butce, lokasyon) VALUES
('Villa İnşaatı', 'Bodrum''da 3 katlı villa projesi', '2024-01-15', 'devam_ediyor', 1500000, 'Bodrum, Muğla'),
('Ofis Binası Tadilat', 'Merkez ofis binası iç tadilat işleri', '2024-02-01', 'planlaniyor', 500000, 'İstanbul, Şişli');

INSERT INTO isciler (ad, soyad, telefon, pozisyon, gunluk_ucret, baslangic_tarihi, durum, proje_id)
SELECT 'Mehmet', 'Yılmaz', '0532 111 2233', 'Usta', 1500, '2024-01-15', 'aktif', id FROM projeler WHERE ad = 'Villa İnşaatı' LIMIT 1;

INSERT INTO isciler (ad, soyad, telefon, pozisyon, gunluk_ucret, baslangic_tarihi, durum, proje_id)
SELECT 'Ayşe', 'Demir', '0533 222 3344', 'Kalfa', 1200, '2024-01-20', 'aktif', id FROM projeler WHERE ad = 'Villa İnşaatı' LIMIT 1;

INSERT INTO malzemeler (ad, kategori, birim, miktar, birim_fiyat, tedarikci, proje_id)
SELECT 'Çimento', 'İnşaat Malzemesi', 'Ton', 50, 2500, 'ABC İnşaat', id FROM projeler WHERE ad = 'Villa İnşaatı' LIMIT 1;

INSERT INTO malzemeler (ad, kategori, birim, miktar, birim_fiyat, tedarikci, proje_id)
SELECT 'Demir', 'İnşaat Malzemesi', 'Ton', 30, 15000, 'XYZ Demir', id FROM projeler WHERE ad = 'Villa İnşaatı' LIMIT 1;

INSERT INTO gorevler (baslik, aciklama, durum, oncelik, baslangic_tarihi, proje_id)
SELECT 'Temel Kazısı', 'Binanın temel kazı işleri', 'tamamlandi', 'yuksek', '2024-01-15', id FROM projeler WHERE ad = 'Villa İnşaatı' LIMIT 1;

INSERT INTO gorevler (baslik, aciklama, durum, oncelik, baslangic_tarihi, proje_id)
SELECT 'Duvar Örgüsü', '1. kat duvar örgü işleri', 'devam_ediyor', 'yuksek', '2024-02-01', id FROM projeler WHERE ad = 'Villa İnşaatı' LIMIT 1;
