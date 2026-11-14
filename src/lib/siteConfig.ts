import { headers } from "next/headers";

export const SITE_NAME = "마이링크 (MyLink)";
export const PRODUCTION_DOMAIN = "mylink-six-omega.vercel.app";
export const PRODUCTION_URL = `https://${PRODUCTION_DOMAIN}`;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : PRODUCTION_URL);

/**
 * 실행 환경에 맞춰 정확한 Base URL을 반환합니다.
 * 외부 OG 크롤러 및 검색엔진이 접근할 수 있도록 localhost 폴백 대신 공식 배포 도메인을 기본값으로 사용합니다.
 */
export async function getRequestBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  try {
    const headerList = await headers();
    const host = headerList.get("x-forwarded-host") || headerList.get("host");
    if (host && !host.startsWith("localhost") && !host.startsWith("127.0.0.1")) {
      const proto = headerList.get("x-forwarded-proto") || "https";
      return `${proto}://${host}`;
    }
  } catch {
    // 빌드 타임 등 요청 컨텍스트 외부에서는 공식 배포 URL 사용
  }

  return SITE_URL;
}
