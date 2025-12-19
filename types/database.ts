// Genel şantiye takip sistemi veri tipleri
// Supabase'deki gerçek tablolar ile güncellenecek

export interface Database {
  public: {
    Tables: {
      projeler: {
        Row: Proje
        Insert: Omit<Proje, 'id' | 'created_at'>
        Update: Partial<Omit<Proje, 'id' | 'created_at'>>
      }
      isciler: {
        Row: Isci
        Insert: Omit<Isci, 'id' | 'created_at'>
        Update: Partial<Omit<Isci, 'id' | 'created_at'>>
      }
      malzemeler: {
        Row: Malzeme
        Insert: Omit<Malzeme, 'id' | 'created_at'>
        Update: Partial<Omit<Malzeme, 'id' | 'created_at'>>
      }
      gorevler: {
        Row: Gorev
        Insert: Omit<Gorev, 'id' | 'created_at'>
        Update: Partial<Omit<Gorev, 'id' | 'created_at'>>
      }
    }
  }
}

export interface Proje {
  id: string
  ad: string
  aciklama?: string
  baslangic_tarihi: string
  bitis_tarihi?: string
  durum: 'planlaniyor' | 'devam_ediyor' | 'tamamlandi' | 'askida'
  butce?: number
  lokasyon?: string
  created_at: string
  updated_at?: string
}

export interface Isci {
  id: string
  ad: string
  soyad: string
  telefon?: string
  email?: string
  pozisyon: string
  proje_id?: string
  gunluk_ucret?: number
  baslangic_tarihi: string
  durum: 'aktif' | 'izinli' | 'ayrıldi'
  created_at: string
  updated_at?: string
}

export interface Malzeme {
  id: string
  ad: string
  kategori?: string
  birim: string
  miktar: number
  birim_fiyat?: number
  proje_id?: string
  tedarikci?: string
  aciklama?: string
  created_at: string
  updated_at?: string
}

export interface Gorev {
  id: string
  baslik: string
  aciklama?: string
  proje_id?: string
  atanan_isci_id?: string
  durum: 'beklemede' | 'devam_ediyor' | 'tamamlandi' | 'iptal'
  oncelik: 'dusuk' | 'orta' | 'yuksek' | 'acil'
  baslangic_tarihi?: string
  bitis_tarihi?: string
  created_at: string
  updated_at?: string
}
