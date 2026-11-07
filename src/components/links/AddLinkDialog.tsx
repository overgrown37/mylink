"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Plus, Sparkles, Link2, AlertCircle, Loader2, LogIn } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { GoogleLogo } from "@/components/auth/GoogleAuthButton";
import { addLinkToFirestore } from "@/lib/firestoreLinks";
import { trackEvent } from "@/lib/firebase";
import { LinkItem } from "@/types/profile";

import {
  linkSchema,
  type LinkFormValues,
  EMOJI_PRESETS,
  formatLinkUrl,
} from "@/lib/validations/linkSchema";

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
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { user, loginWithGoogle, isAuthenticating } = useAuthStore();
  const currentLinks = useProfileStore((state) => state.profile.links);
  const addLink = useProfileStore((state) => state.addLink);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
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

  const onSubmit = async (data: LinkFormValues) => {
    setIsSaving(true);
    setSaveError(null);
    const startTime = Date.now();

    const formattedUrl = formatLinkUrl(data.url);

    const maxOrder = currentLinks.reduce(
      (max, item) => Math.max(max, item.order),
      0
    );

    const newLinkData: Omit<LinkItem, "id"> = {
      type: "link",
      title: data.title.trim(),
      url: formattedUrl,
      order: maxOrder + 1,
      subtitle: data.subtitle?.trim() || undefined,
      icon: data.icon?.trim() || "🔗",
      badge: data.badge?.trim() || undefined,
      isFeatured: data.isFeatured,
      category: "custom",
    };

    try {
      // 1. Firestore (users/{user.uid}/links)에 저장
      const savedLink = await addLinkToFirestore(newLinkData, user?.uid);

      // 2. Analytics 이벤트 기록
      trackEvent("link_added", { title: savedLink.title, url: savedLink.url });

      // 3. 로컬 스토어 동기화 (즉각적 반응성 확보)
      addLink(savedLink);

      // 사용자가 로딩 상태를 명확히 인지할 수 있도록 최소 500ms 스피너 노출 보장
      const elapsed = Date.now() - startTime;
      if (elapsed < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - elapsed));
      }

      reset();
      setOpen(false);
    } catch (err: unknown) {
      console.error("Firestore 저장 실패:", err);
      const errorMessage = err instanceof Error ? err.message : "링크 저장 중 오류가 발생했습니다.";
      setSaveError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
      setSaveError(null);
    }
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
                {user ? "새 링크 추가" : "로그인 안내"}
              </DialogTitle>
              <DialogDescription className="text-xs text-white/60 mt-0.5">
                {user
                  ? "프로필에 노출될 새로운 링크와 세부 정보를 입력하세요."
                  : "링크를 생성하려면 먼저 Google 로그인이 필요합니다."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!user ? (
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5865f2]/20 border border-[#5865f2]/40 flex items-center justify-center text-[#5865f2]">
              <LogIn className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-xs">
              <h3 className="text-base font-bold text-white">로그인이 필요한 기능입니다</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                나만의 링크를 생성하고 클라우드(users/{`{uid}`}/links)에 보관하려면 Google 계정으로 먼저 로그인해 주세요.
              </p>
            </div>
            <Button
              type="button"
              onClick={async () => {
                try {
                  await loginWithGoogle();
                } catch {
                  // 안전한 예외 처리
                }
              }}
              disabled={isAuthenticating}
              className="bg-white hover:bg-white/90 text-slate-900 font-bold rounded-xl px-5 text-xs h-10 gap-2 cursor-pointer shadow-md mt-2"
            >
              <GoogleLogo className="w-4 h-4" />
              <span>Google 계정으로 로그인</span>
            </Button>
          </div>
        ) : (
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

          {/* ── 저장 실패 에러 메시지 ── */}
          {saveError && (
            <div className="p-2.5 rounded-xl bg-[#ec48bd]/15 border border-[#ec48bd]/40 text-[#ec48bd] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          <DialogFooter className="pt-3 border-t border-white/10 gap-2 sm:justify-end">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isSaving}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  취소
                </Button>
              }
            />
            <Button
              type="submit"
              data-testid="btn-submit-link"
              disabled={isSaving}
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold rounded-xl px-5 shadow-[0_4px_16px_rgba(88,101,242,0.4)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <span>추가하기</span>
              )}
            </Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AddLinkDialog;
