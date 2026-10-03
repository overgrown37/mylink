"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Sparkles, Link2, AlertCircle } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";

// ─── Zod 스키마 정의 ──────────────────────────────────────────────────────────
const addLinkSchema = z.object({
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

type AddLinkFormValues = z.infer<typeof addLinkSchema>;

// ─── 이모지 프리셋 ────────────────────────────────────────────────────────────
const EMOJI_PRESETS = ["🔗", "🚀", "✨", "💡", "🎨", "📝", "☕", "💖", "🔥", "⭐"];

// ─── 에러 메시지 공통 컴포넌트 ────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-[11px] text-[#ec48bd] font-medium mt-1 flex items-center gap-1 animate-in fade-in-50">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export function AddLinkDialog() {
  const [open, setOpen] = useState(false);
  const addLink = useProfileStore((state) => state.addLink);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddLinkFormValues>({
    resolver: zodResolver(addLinkSchema),
    defaultValues: {
      title: "",
      url: "",
      subtitle: "",
      icon: "🔗",
      badge: "",
      isFeatured: false,
    },
  });

  const watchedTitle = watch("title");
  const watchedSubtitle = watch("subtitle") ?? "";
  const watchedIcon = watch("icon");

  const onSubmit = (data: AddLinkFormValues) => {
    let formattedUrl = data.url.trim();
    if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith("mailto:")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    addLink({
      type: "link",
      title: data.title.trim(),
      url: formattedUrl,
      subtitle: data.subtitle?.trim() || undefined,
      icon: data.icon?.trim() || "🔗",
      badge: data.badge?.trim() || undefined,
      isFeatured: data.isFeatured,
      category: "custom",
    });

    reset();
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            data-testid="open-add-link-dialog"
            variant="outline"
            className="w-full h-12 border-dashed border-[#5865f2]/60 hover:border-[#35ed7e] bg-[#5865f2]/10 hover:bg-[#5865f2]/20 text-white font-semibold rounded-2xl gap-2 transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(88,101,242,0.3)] active:scale-[0.99] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#35ed7e]" />
            <span>새 링크 추가하기</span>
          </Button>
        }
      />

      <DialogContent className="bg-[#12163a] border border-[#5865f2]/40 text-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-6 sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#5865f2]/20 border border-[#5865f2]/40 text-[#5865f2]">
              <Link2 className="w-5 h-5" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold text-white tracking-tight">
                새 링크 추가
              </DialogTitle>
              <DialogDescription className="text-xs text-white/60 mt-0.5">
                프로필에 노출될 새로운 링크와 세부 정보를 입력하세요.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 my-2">

          {/* ── 링크 제목 ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="link-title" className="text-xs font-semibold text-white/90">
                링크 제목 <span className="text-[#ec48bd]">*</span>
              </Label>
              <span className="text-[10px] text-white/40">{watchedTitle.length}/50</span>
            </div>
            <Input
              id="link-title"
              data-testid="input-link-title"
              placeholder="예: 내 노션 포트폴리오, 주간 뉴스레터"
              {...register("title")}
              className={`bg-[#1e2353]/60 border-white/10 text-white placeholder:text-white/30 h-10 rounded-xl text-sm transition-all ${
                errors.title
                  ? "border-[#ec48bd] ring-1 ring-[#ec48bd]/50 focus-visible:border-[#ec48bd] focus-visible:ring-[#ec48bd]/50"
                  : "focus-visible:border-[#5865f2] focus-visible:ring-[#5865f2]/50"
              }`}
            />
            <FieldError message={errors.title?.message} />
          </div>

          {/* ── 이동할 URL ── */}
          <div className="space-y-1.5">
            <Label htmlFor="link-url" className="text-xs font-semibold text-white/90">
              이동할 웹 URL <span className="text-[#ec48bd]">*</span>
            </Label>
            <Input
              id="link-url"
              data-testid="input-link-url"
              placeholder="https://example.com 또는 velog.io"
              {...register("url")}
              className={`bg-[#1e2353]/60 border-white/10 text-white placeholder:text-white/30 h-10 rounded-xl text-sm transition-all ${
                errors.url
                  ? "border-[#ec48bd] ring-1 ring-[#ec48bd]/50 focus-visible:border-[#ec48bd] focus-visible:ring-[#ec48bd]/50"
                  : "focus-visible:border-[#5865f2] focus-visible:ring-[#5865f2]/50"
              }`}
            />
            <FieldError message={errors.url?.message} />
          </div>

          {/* ── 한 줄 설명 ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="link-subtitle" className="text-xs font-semibold text-white/90">
                한 줄 설명 <span className="text-white/40 text-[11px]">(선택)</span>
              </Label>
              <span className="text-[10px] text-white/40">{watchedSubtitle.length}/80</span>
            </div>
            <Input
              id="link-subtitle"
              data-testid="input-link-subtitle"
              placeholder="예: 최신 작업물과 이력서가 정리되어 있습니다"
              {...register("subtitle")}
              className={`bg-[#1e2353]/60 border-white/10 text-white placeholder:text-white/30 h-10 rounded-xl text-sm transition-all ${
                errors.subtitle
                  ? "border-[#ec48bd] ring-1 ring-[#ec48bd]/50 focus-visible:border-[#ec48bd] focus-visible:ring-[#ec48bd]/50"
                  : "focus-visible:border-[#5865f2] focus-visible:ring-[#5865f2]/50"
              }`}
            />
            <FieldError message={errors.subtitle?.message} />
          </div>

          {/* ── 이모지 아이콘 선택 ── */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white/90">아이콘 이모지</Label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {EMOJI_PRESETS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setValue("icon", emoji)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border transition-all cursor-pointer ${
                    watchedIcon === emoji
                      ? "bg-[#5865f2] border-white/40 scale-110 shadow-sm"
                      : "bg-[#1e2353]/40 border-white/10 hover:bg-[#1e2353]"
                  }`}
                >
                  {emoji}
                </button>
              ))}
              {/* 직접 입력 */}
              <Input
                {...register("icon")}
                maxLength={4}
                className="w-14 h-8 text-center bg-[#1e2353]/60 border-white/10 text-white text-sm rounded-lg"
                title="직접 입력"
              />
            </div>
          </div>

          {/* ── 뱃지 & 시그니처 강조 ── */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="link-badge" className="text-xs font-semibold text-white/90">
                뱃지 텍스트 <span className="text-white/40 text-[11px]">(선택)</span>
              </Label>
              <Input
                id="link-badge"
                data-testid="input-link-badge"
                placeholder="예: NEW, HOT"
                {...register("badge")}
                className={`bg-[#1e2353]/60 border-white/10 text-white placeholder:text-white/30 h-9 rounded-xl text-xs transition-all ${
                  errors.badge
                    ? "border-[#ec48bd] ring-1 ring-[#ec48bd]/50 focus-visible:border-[#ec48bd] focus-visible:ring-[#ec48bd]/50"
                    : "focus-visible:border-[#5865f2] focus-visible:ring-[#5865f2]/50"
                }`}
              />
              <FieldError message={errors.badge?.message} />
            </div>

            <div className="flex flex-col justify-end pb-1">
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      data-testid="checkbox-link-featured"
                      checked={field.value}
                      onChange={field.onChange}
                      className="rounded border-white/20 bg-[#1e2353] w-4 h-4 cursor-pointer accent-[#5865f2]"
                    />
                    <span className="text-xs font-medium text-white/80 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#ec48bd]" />
                      시그니처 강조 카드
                    </span>
                  </label>
                )}
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-white/10 gap-2 sm:justify-end">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  취소
                </Button>
              }
            />
            <Button
              type="submit"
              data-testid="btn-submit-link"
              disabled={isSubmitting}
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold rounded-xl px-5 shadow-[0_4px_16px_rgba(88,101,242,0.4)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              추가하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddLinkDialog;
