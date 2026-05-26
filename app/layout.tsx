import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MusicChatWidget from "@/components/MusicChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Distrik Bunyi — Musik Indonesia",
  description: "Web informasi musik yang menampilkan berita musik serta rilisan sepekan di tanah air.",
  keywords: ["musik indonesia", "indie indonesia", "rilisan baru", "distrik bunyi"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('distrikbunyi-theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = saved || (prefersDark ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <MusicChatWidget />
      </body>
    </html>
  );
}
