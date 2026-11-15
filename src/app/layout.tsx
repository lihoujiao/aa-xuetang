import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const noto = Noto_Sans_SC({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AA 学堂",
    template: "%s｜AA 学堂",
  },
  description: "从手头的一件事开始，按章节把练习做成能看的结果。",
  alternates: { canonical: `${siteUrl}/` },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "AA 学堂",
    title: "AA 学堂",
    description: "从手头的一件事开始，按章节把练习做成能看的结果。",
    url: `${siteUrl}/`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${noto.variable} antialiased`}>{children}</body>
    </html>
  );
}
