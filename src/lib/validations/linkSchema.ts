import { z } from "zod";

/**
 * 링크 추가 및 수정 공통 Zod 유효성 검사 스키마
 */
export const linkSchema = z.object({
  title: z
    .string()
    .min(1, "링크 제목을 입력해주세요.")
    .min(2, "링크 제목은 최소 2글자 이상 입력해주세요.")
    .max(50, "링크 제목은 최대 50자까지 입력 가능합니다."),

  url: z
    .string()
    .min(1, "이동할 웹 URL을 입력해주세요.")
    .refine(
      (val) => {
        const trimmed = val.trim();
        if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(trimmed)) return true;
        try {
          const urlToParse = /^https?:\/\//i.test(trimmed)
            ? trimmed
            : `https://${trimmed}`;
          const parsed = new URL(urlToParse);
          return (
            parsed.hostname.includes(".") || parsed.hostname === "localhost"
          );
        } catch {
          return false;
        }
      },
      { message: "올바른 URL 형식(예: https://example.com 또는 velog.io)을 입력해주세요." }
    ),

  subtitle: z
    .string()
    .max(80, "설명은 최대 80자까지 입력 가능합니다.")
    .optional(),

  icon: z.string().max(4).optional(),

  badge: z
    .string()
    .max(15, "뱃지 텍스트는 최대 15자까지 입력 가능합니다.")
    .optional(),

  isFeatured: z.boolean().optional(),
});

export type LinkFormValues = z.infer<typeof linkSchema>;

/**
 * 이모지 프리셋
 */
export const EMOJI_PRESETS = ["🔗", "🚀", "✨", "💡", "🎨", "📝", "☕", "💖", "🔥", "⭐"];

/**
 * URL 프로토콜 보정 헬퍼 함수
 */
export const formatLinkUrl = (rawUrl: string): string => {
  const trimmed = rawUrl.trim();
  if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith("mailto:")) {
    return `https://${trimmed}`;
  }
  return trimmed;
};
