import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SITE_NAME, getRequestBaseUrl } from "@/lib/siteConfig";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const DEFAULT_TITLE = `${SITE_NAME} | 나만의 원링크 프로필`;
const DEFAULT_DESCRIPTION =
  "흩어진 모든 링크를 단 하나의 공간에. Google 3초 로그인으로 나만의 고유 URL을 만들고 실시간 클릭 통계를 확인하는 스마트 멀티 링크 서비스입니다.";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getRequestBaseUrl();

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: DEFAULT_TITLE,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: [
      "마이링크",
      "MyLink",
      "원링크",
      "멀티링크",
      "링크트리",
      "프로필 링크",
      "바이오 링크",
      "링크 클릭 통계",
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      url: "/",
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    },
  };
}

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
