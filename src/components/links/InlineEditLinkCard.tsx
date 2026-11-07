"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles, AlertCircle, Loader2, Check, X } from "lucide-react";
import { LinkItem } from "@/types/profile";
import { useUpdateLinkMutation } from "@/hooks/useLinkMutations";
import { useAuthStore } from "@/store/useAuthStore";
import { trackEvent } from "@/lib/firebase";
import {
  linkSchema,
  type LinkFormValues,
  EMOJI_PRESETS,
  formatLinkUrl,
} from "@/lib/validations/linkSchema";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-[11px] text-[#ec48bd] font-medium mt-1 flex items-center gap-1 animate-in fade-in-50">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

interface InlineEditLinkCardProps {
  item: LinkItem;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function InlineEditLinkCard({
  item,
  onCancel,
  onSuccess,
}: InlineEditLinkCardProps) {
  const [saveError, setSaveError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const updateMutation = useUpdateLinkMutation();
  const isSaving = updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: item.title || "",
      url: item.url || "",
      subtitle: item.subtitle || "",
      icon: item.icon || "🔗",
      badge: item.badge || "",
      isFeatured: !!item.isFeatured,
    },
  });

  const watchedTitle = watch("title") || "";
  const watchedSubtitle = watch("subtitle") || "";
  const watchedIcon = watch("icon");

  const onSubmit = async (data: LinkFormValues) => {
    setSaveError(null);
    const startTime = Date.now();

    const formattedUrl = formatLinkUrl(data.url);

    const updatedData: Partial<LinkItem> = {
      title: data.title.trim(),
      url: formattedUrl,
      subtitle: data.subtitle?.trim() || undefined,
      icon: data.icon?.trim() || "🔗",
      badge: data.badge?.trim() || undefined,
      isFeatured: data.isFeatured,
    };

    try {
      // TanStack Query 뮤테이션을 통한 수정
      await updateMutation.mutateAsync({
        id: item.id,
        updates: updatedData,
        uid: user?.uid,
      });

      trackEvent("link_updated", {
        linkId: item.id,
        title: updatedData.title,
        url: updatedData.url,
      });

      const elapsed = Date.now() - startTime;
      if (elapsed < 400) {
        await new Promise((resolve) => setTimeout(resolve, 400 - elapsed));
      }

      if (onSuccess) onSuccess();
      onCancel();
    } catch (err: unknown) {
      console.error("Firestore 링크 수정 실패:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "링크 수정 중 오류가 발생했습니다. 다시 시도해주세요.";
      setSaveError(errorMessage);
    }
  };

  return (
    <Card
      data-testid={`inline-edit-card-${item.id}`}
      className="p-4 rounded-2xl bg-[#161a46] border-2 border-[#5865f2] shadow-[0_8px_32px_rgba(88,101,242,0.3)] animate-in fade-in zoom-in-95 duration-200"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <span className="text-xs font-bold text-[#5865f2] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#5865f2] animate-pulse" />
            링크 인라인 수정
          </span>
          <span className="text-[11px] text-white/40">Enter로 저장 불가, 아래 버튼 클릭</span>
        </div>

        {/* ── 링크 제목 ── */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor={`edit-title-${item.id}`} className="text-xs font-semibold text-white/90">
              링크 제목 <span className="text-[#ec48bd]">*</span>
            </Label>
            <span className="text-[10px] text-white/40">{watchedTitle.length}/50</span>
          </div>
          <Input
            id={`edit-title-${item.id}`}
            data-testid={`input-edit-title-${item.id}`}
            placeholder="링크 제목 입력"
            {...register("title")}
            className={`bg-[#1e2353]/90 border-white/15 text-white placeholder:text-white/30 h-9 rounded-xl text-xs sm:text-sm transition-all ${
              errors.title
                ? "border-[#ec48bd] ring-1 ring-[#ec48bd]/50"
                : "focus-visible:border-[#5865f2] focus-visible:ring-[#5865f2]/50"
            }`}
          />
          <FieldError message={errors.title?.message} />
        </div>

        {/* ── 이동할 URL ── */}
        <div className="space-y-1">
          <Label htmlFor={`edit-url-${item.id}`} className="text-xs font-semibold text-white/90">
            이동할 웹 URL <span className="text-[#ec48bd]">*</span>
          </Label>
          <Input
            id={`edit-url-${item.id}`}
            data-testid={`input-edit-url-${item.id}`}
            placeholder="https://example.com 또는 velog.io"
            {...register("url")}
            className={`bg-[#1e2353]/90 border-white/15 text-white placeholder:text-white/30 h-9 rounded-xl text-xs sm:text-sm transition-all ${
              errors.url
                ? "border-[#ec48bd] ring-1 ring-[#ec48bd]/50"
                : "focus-visible:border-[#5865f2] focus-visible:ring-[#5865f2]/50"
            }`}
          />
          <FieldError message={errors.url?.message} />
        </div>

        {/* ── 한 줄 설명 ── */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor={`edit-subtitle-${item.id}`} className="text-xs font-semibold text-white/90">
              한 줄 설명 <span className="text-white/40 text-[10px]">(선택)</span>
            </Label>
            <span className="text-[10px] text-white/40">{watchedSubtitle.length}/80</span>
          </div>
          <Input
            id={`edit-subtitle-${item.id}`}
            data-testid={`input-edit-subtitle-${item.id}`}
            placeholder="설명 문구 입력"
            {...register("subtitle")}
            className={`bg-[#1e2353]/90 border-white/15 text-white placeholder:text-white/30 h-9 rounded-xl text-xs sm:text-sm transition-all ${
              errors.subtitle
                ? "border-[#ec48bd] ring-1 ring-[#ec48bd]/50"
                : "focus-visible:border-[#5865f2] focus-visible:ring-[#5865f2]/50"
            }`}
          />
          <FieldError message={errors.subtitle?.message} />
        </div>

        {/* ── 이모지 아이콘 선택 ── */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-white/90">아이콘 이모지</Label>
          <div className="flex items-center gap-1.5 flex-wrap">
            {EMOJI_PRESETS.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => setValue("icon", emoji)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs sm:text-sm border transition-all cursor-pointer ${
                  watchedIcon === emoji
                    ? "bg-[#5865f2] border-white/40 scale-110 shadow-sm"
                    : "bg-[#1e2353]/60 border-white/10 hover:bg-[#1e2353]"
                }`}
              >
                {emoji}
              </button>
            ))}
            <Input
              {...register("icon")}
              maxLength={4}
              data-testid={`input-edit-icon-${item.id}`}
              className="w-12 h-7 text-center bg-[#1e2353]/80 border-white/10 text-white text-xs rounded-lg p-0"
              title="직접 입력"
            />
          </div>
        </div>

        {/* ── 뱃지 & 시그니처 강조 ── */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div className="space-y-1">
            <Label htmlFor={`edit-badge-${item.id}`} className="text-xs font-semibold text-white/90">
              뱃지 <span className="text-white/40 text-[10px]">(선택)</span>
            </Label>
            <Input
              id={`edit-badge-${item.id}`}
              data-testid={`input-edit-badge-${item.id}`}
              placeholder="예: NEW, HOT"
              {...register("badge")}
              className={`bg-[#1e2353]/90 border-white/15 text-white placeholder:text-white/30 h-8 rounded-lg text-xs ${
                errors.badge ? "border-[#ec48bd]" : ""
              }`}
            />
          </div>

          <div className="flex flex-col justify-end pb-1">
            <Controller
              name="isFeatured"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    data-testid={`checkbox-edit-featured-${item.id}`}
                    checked={field.value}
                    onChange={field.onChange}
                    className="rounded border-white/20 bg-[#1e2353] w-3.5 h-3.5 cursor-pointer accent-[#5865f2]"
                  />
                  <span className="text-xs font-medium text-white/80 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#ec48bd]" />
                    시그니처 강조
                  </span>
                </label>
              )}
            />
          </div>
        </div>

        {/* ── 에러 메시지 ── */}
        {saveError && (
          <div className="p-2 rounded-xl bg-[#ec48bd]/15 border border-[#ec48bd]/40 text-[#ec48bd] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* ── 액션 버튼 (취소, 저장하기) ── */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
            data-testid={`btn-cancel-edit-${item.id}`}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl text-xs h-8 px-3 cursor-pointer"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            취소
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isSaving}
            data-testid={`btn-save-edit-${item.id}`}
            className="bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold rounded-xl text-xs h-8 px-3.5 shadow-[0_2px_12px_rgba(88,101,242,0.4)] cursor-pointer disabled:opacity-60 flex items-center gap-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>저장 중...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>저장하기</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default InlineEditLinkCard;
