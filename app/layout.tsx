import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Şantiye Takip Sistemi",
  description: "Şantiye projelerini, işçileri ve malzemeleri takip edin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
