import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/siteConfig";

const STAT_TITLE = "링크 통계 분석 대시보드";
const STAT_DESCRIPTION =
  "내 마이링크의 실시간 누적 클릭 수, 링크별 클릭 비교 막대 차트, 점유율 도넛 차트 및 순위 데이터를 한눈에 분석하세요.";

export const metadata: Metadata = {
  title: STAT_TITLE,
  description: STAT_DESCRIPTION,
  alternates: {
    canonical: "/stat",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: `${STAT_TITLE} | ${SITE_NAME}`,
    description: STAT_DESCRIPTION,
    url: "/stat",
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} | 나만의 원링크 프로필`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${STAT_TITLE} | ${SITE_NAME}`,
    description: STAT_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function StatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
