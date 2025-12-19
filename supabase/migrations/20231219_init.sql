-- Kuzyaka Köyü Takip Sistemi için veritabanı şeması

-- Etkinlikler tablosu
CREATE TABLE IF NOT EXISTS etkinlikler (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  baslik TEXT NOT NULL,
  aciklama TEXT,
  tarih DATE NOT NULL,
  konum TEXT,
  durum TEXT DEFAULT 'planlanıyor',
  notlar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Katılımcılar tablosu
CREATE TABLE IF NOT EXISTS katilimcilar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  etkinlik_id UUID REFERENCES etkinlikler(id) ON DELETE CASCADE,
  isim TEXT NOT NULL,
  iletisim TEXT,
  notlar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_etkinlikler_durum ON etkinlikler(durum);
CREATE INDEX IF NOT EXISTS idx_etkinlikler_tarih ON etkinlikler(tarih);
CREATE INDEX IF NOT EXISTS idx_katilimcilar_etkinlik_id ON katilimcilar(etkinlik_id);

-- Updated_at otomatik güncellemesi için trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_etkinlikler_updated_at BEFORE UPDATE ON etkinlikler
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
