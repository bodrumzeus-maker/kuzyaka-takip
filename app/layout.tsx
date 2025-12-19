import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kuzyaka Takip - İş/Şantiye Takip Sistemi',
  description: 'Supabase tabanlı iş ve şantiye takip uygulaması',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
