import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindForge Academy - Nền tảng học tập tư duy",
  description:
    "MindForge Academy - Nền tảng học tập trực tuyến giúp phát triển tư duy hệ thống, phản biện, quản trị AI và tư duy chiến lược.",
  keywords: [
    "MindForge",
    "học tập",
    "tư duy hệ thống",
    "phản biện",
    "AI",
    "chiến lược",
  ],
  authors: [{ name: "MindForge Academy" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} antialiased bg-[#fde047] text-black`}
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
