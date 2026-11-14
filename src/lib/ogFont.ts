import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Open Graph ImageResponse(Satori)용 로컬 한글/영문 웹폰트(Pretendard Subset) 로더
 * 외부 네트워크 요청 없이 디스크에서 즉시 로드하여 모든 배포/실행 환경에서 안정적으로 동작합니다.
 */

interface LoadedFont {
  name: string;
  data: ArrayBuffer;
  style: "normal";
  weight: 400 | 700;
}

let cachedFontsPromise: Promise<LoadedFont[]> | null = null;

async function loadLocalFont(filename: string): Promise<ArrayBuffer | null> {
  try {
    const fontPath = path.join(process.cwd(), "src", "assets", "fonts", filename);
    const buffer = await readFile(fontPath);
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  } catch (err) {
    console.warn(`[ogFont] 로컬 폰트 로드 실패 (${filename}):`, err);
    return null;
  }
}

export async function getOgFonts(): Promise<LoadedFont[]> {
  if (!cachedFontsPromise) {
    cachedFontsPromise = (async () => {
      const [regular, bold] = await Promise.all([
        loadLocalFont("Pretendard-Regular.subset.woff"),
        loadLocalFont("Pretendard-Bold.subset.woff"),
      ]);

      const fonts: LoadedFont[] = [];
      if (regular) {
        fonts.push({ name: "Pretendard", data: regular, style: "normal", weight: 400 });
      }
      if (bold) {
        fonts.push({ name: "Pretendard", data: bold, style: "normal", weight: 700 });
      }

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
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
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
