import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "마이링크 (MyLink) | 나만의 원링크 프로필",
  description: "크리에이터, 개발자를 위한 멀티 링크 서비스 마이링크",
  openGraph: {
    title: "마이링크 (MyLink) | 나만의 원링크 프로필",
    description: "크리에이터, 개발자를 위한 멀티 링크 서비스 마이링크",
    siteName: "마이링크 (MyLink)",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("h-full antialiased bg-[#0a0d3a]", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
