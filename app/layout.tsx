import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Distrik Bunyi — Musik Indonesia",
  description: "Web informasi musik yang menampilkan berita musik serta rilisan sepekan di tanah air.",
  keywords: ["musik indonesia", "indie indonesia", "rilisan baru", "distrik bunyi"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
