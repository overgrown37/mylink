/**
 * Open Graph ImageResponse(Satori)용 한글 웹폰트(Noto Sans KR) 로더
 * 모듈 레벨 캐시를 사용하여 최초 1회만 다운로드하고, 네트워크 오류 시에도 안전하게 빈 배열을 반환합니다.
 */

interface LoadedFont {
  name: string;
  data: ArrayBuffer;
  style: "normal";
  weight: 400 | 700;
}

let cachedFontsPromise: Promise<LoadedFont[]> | null = null;

async function fetchGoogleFontTtf(weight: 400 | 700): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@${weight}&display=swap`;
    const cssRes = await fetch(cssUrl, {
      headers: {
        // Satori는 woff2를 지원하지 않으므로 구형 Safari UA로 TTF 포맷 응답 유도
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
      signal: AbortSignal.timeout(4000),
    });
    if (!cssRes.ok) return null;

    const css = await cssRes.text();
    const match = css.match(/src:\s*url\((https:\/\/[^)]+\.ttf)\)/);
    if (!match?.[1]) return null;

    const fontRes = await fetch(match[1], {
      signal: AbortSignal.timeout(4000),
    });
    if (!fontRes.ok) return null;

    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export async function getOgFonts(): Promise<LoadedFont[]> {
  if (!cachedFontsPromise) {
    cachedFontsPromise = (async () => {
      const [regular, bold] = await Promise.all([
        fetchGoogleFontTtf(400),
        fetchGoogleFontTtf(700),
      ]);

      const fonts: LoadedFont[] = [];
      if (regular) {
        fonts.push({ name: "Noto Sans KR", data: regular, style: "normal", weight: 400 });
      }
      if (bold) {
        fonts.push({ name: "Noto Sans KR", data: bold, style: "normal", weight: 700 });
      }

      // 실패 시 다음 요청에서 재시도할 수 있도록 캐시 초기화
      if (fonts.length === 0) {
        cachedFontsPromise = null;
      }

      return fonts;
    })();
  }

  return cachedFontsPromise;
}

/**
 * 외부 프로필 이미지 URL을 안전한 Data URI로 변환 (타임아웃 및 CORS/차단 방어)
 */
export async function fetchSafeAvatarDataUri(url?: string | null): Promise<string | null> {
  if (!url || !url.startsWith("http")) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) return null;
    const buf = await res.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
}
