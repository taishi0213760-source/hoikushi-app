import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ExamCountdown from "@/components/ExamCountdown";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "保育士試験 対策アプリ",
  description: "保育士試験の過去問演習ができるスマホ対応Webアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 試験日カウントダウン（全画面共通・最上部） */}
        <ExamCountdown />
        {/* メインコンテンツ（ボトムナビ分の余白を確保） */}
        <div className="pb-20">
          {children}
        </div>
        {/* ボトムナビゲーション */}
        <BottomNav />
      </body>
    </html>
  );
}
