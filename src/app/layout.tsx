import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kuzyaka Köyü Takip Sistemi',
  description: 'Kuzyaka köyü için geliştirilmiş takip sistemi',
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
