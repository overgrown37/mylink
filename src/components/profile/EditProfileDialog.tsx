"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
  Pencil,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  UserCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileQuery, useUpdateProfileMutation } from "@/hooks/useProfileQuery";
import { useCheckDisplayName } from "@/hooks/useCheckDisplayName";

// ─── Zod 유효성 스키마 ────────────────────────────────────────────────────────
const editProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, "닉네임은 최소 2자 이상이어야 합니다.")
    .max(30, "닉네임은 최대 30자까지 입력할 수 있습니다.")
    .regex(
      /^[가-힣a-zA-Z0-9_.\- ]+$/,
      "닉네임에는 한글, 영문, 숫자, 밑줄, 하이픈, 점, 공백만 사용할 수 있습니다."
    )
    .trim(),
  bio: z
    .string()
    .max(120, "소개글은 최대 120자까지 입력할 수 있습니다.")
    .optional(),
  handle: z
    .string()
    .min(2, "핸들은 최소 2자 이상이어야 합니다.")
    .max(30, "핸들은 최대 30자까지 입력할 수 있습니다.")
    .regex(
      /^@?[a-zA-Z0-9_.]+$/,
      "핸들에는 영문, 숫자, 밑줄, 점만 사용할 수 있습니다."
    )
    .transform((v) => (v.startsWith("@") ? v : `@${v}`)),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

// ─── 필드 에러 메시지 컴포넌트 ────────────────────────────────────────────────
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
interface EditProfileDialogProps {
  trigger?: React.ReactElement;
}

export function EditProfileDialog({ trigger }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const { user, userProfile: authProfile } = useAuthStore();

  // TanStack Query: 프로필 단발 조회 및 캐싱
  const { data: queryProfile } = useProfileQuery(user?.uid);
  const currentProfile = queryProfile || authProfile;

  // TanStack Query: 프로필 낙관적 업데이트 뮤테이션
  const updateProfileMutation = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      displayName: currentProfile?.displayName || "",
      bio: currentProfile?.bio || "",
      handle: currentProfile?.handle || "",
    },
  });

  const watchedDisplayName = watch("displayName");
  const watchedBio = watch("bio") ?? "";
  const watchedHandle = watch("handle") ?? "";

  // TanStack Query: 닉네임 중복 확인 (5분 캐싱 + 디바운스 지원)
  const { status: availabilityStatus, isLoading: isCheckingName } = useCheckDisplayName({
    name: watchedDisplayName || "",
    currentUid: user?.uid,
    currentDisplayName: currentProfile?.displayName,
    debounceMs: 500,
  });

  // 다이얼로그 열릴 때 현재 프로필 값으로 폼 초기화
  useEffect(() => {
    if (open && currentProfile) {
      reset({
        displayName: currentProfile.displayName || "",
        bio: currentProfile.bio || "",
        handle: currentProfile.handle || "",
      });
    }
  }, [open, currentProfile, reset]);

  const onSubmit = (data: EditProfileFormValues) => {
    if (!user) return;
    if (availabilityStatus === "taken") return;

    // 낙관적 업데이트 실행 (onMutate에서 즉시 캐시 갱신되어 UI에 0ms 반영)
    updateProfileMutation.mutate(
      {
        uid: user.uid,
        updates: {
          displayName: data.displayName,
          bio: data.bio?.trim() || "",
          handle: data.handle,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (updateProfileMutation.isPending) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      updateProfileMutation.reset();
    }
  };

  // displayName 중복 확인 상태 인디케이터
  const renderAvailabilityIndicator = () => {
    const isSameName = watchedDisplayName?.trim() === currentProfile?.displayName;
    if (isSameName || availabilityStatus === "idle") return null;

    if (isCheckingName || availabilityStatus === "checking") {
      return (
        <span className="flex items-center gap-1 text-[11px] text-white/50 mt-1">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          중복 확인 중...
        </span>
      );
    }
    if (availabilityStatus === "available") {
      return (
        <span className="flex items-center gap-1 text-[11px] text-[#35ed7e] mt-1 animate-in fade-in-50">
          <CheckCircle2 className="w-3.5 h-3.5" />
          사용할 수 있는 닉네임입니다.
        </span>
      );
    }
    if (availabilityStatus === "taken") {
      return (
        <span className="flex items-center gap-1 text-[11px] text-[#ec48bd] mt-1 animate-in fade-in-50">
          <XCircle className="w-3.5 h-3.5" />
          이미 사용 중인 닉네임입니다.
        </span>
      );
    }
    if (availabilityStatus === "error") {
      return (
        <span className="flex items-center gap-1 text-[11px] text-white/40 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          중복 확인에 실패했습니다. 저장 시 재확인합니다.
        </span>
      );
    }
    return null;
  };

  const isSaving = updateProfileMutation.isPending;
  const isSubmitDisabled =
    isSaving ||
    availabilityStatus === "taken" ||
    availabilityStatus === "checking" ||
    isCheckingName;

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className="text-white/50 hover:text-white hover:bg-white/10 rounded-xl gap-1.5 text-xs font-medium transition-all"
    >
      <Pencil className="w-3.5 h-3.5" />
      프로필 수정
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          (trigger as React.ReactElement) ?? defaultTrigger
        }
      />

      <DialogContent className="bg-[#12163a] border border-[#5865f2]/40 text-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-6 sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#5865f2]/20 border border-[#5865f2]/40 text-[#5865f2]">
              <UserCircle className="w-5 h-5" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold text-white tracking-tight">
                프로필 수정
              </DialogTitle>
              <DialogDescription className="text-xs text-white/60 mt-0.5">
                닉네임, 소개글, 핸들을 변경할 수 있습니다.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 my-2">
          {/* ── 닉네임 (displayName) ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-displayName" className="text-xs font-semibold text-white/90">
                닉네임 (Display Name) <span className="text-[#ec48bd]">*</span>
              </Label>
              <span className="text-[10px] text-white/40">
                {(watchedDisplayName || "").length}/30
              </span>
            </div>
            <Input
              id="edit-displayName"
              placeholder="표시될 닉네임을 입력하세요"
              {...register("displayName")}
              className={`bg-[#1e2353]/60 border-white/10 text-white placeholder:text-white/30 h-10 rounded-xl text-sm transition-all ${
                errors.displayName || availabilityStatus === "taken"
                  ? "border-[#ec48bd] ring-1 ring-[#ec48bd]/50 focus-visible:border-[#ec48bd] focus-visible:ring-[#ec48bd]/50"
                  : availabilityStatus === "available"
                  ? "border-[#35ed7e]/50 ring-1 ring-[#35ed7e]/30 focus-visible:border-[#35ed7e] focus-visible:ring-[#35ed7e]/30"
                  : "focus-visible:border-[#5865f2] focus-visible:ring-[#5865f2]/50"
              }`}
            />
            {/* 중복 확인 상태 인디케이터 */}
            {renderAvailabilityIndicator()}
            <FieldError message={errors.displayName?.message} />
          </div>

          {/* ── 소개글 (bio) ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-bio" className="text-xs font-semibold text-white/90">
                소개글 <span className="text-white/40 text-[11px]">(선택)</span>
              </Label>
              <span className="text-[10px] text-white/40">{watchedBio.length}/120</span>
            </div>
            <textarea
              id="edit-bio"
              rows={3}
              placeholder="나를 소개하는 한 줄 또는 짧은 글을 입력하세요"
              {...register("bio")}
              className={`w-full bg-[#1e2353]/60 border border-white/10 text-white placeholder:text-white/30 rounded-xl text-sm px-3 py-2.5 resize-none focus:outline-none transition-all ${
                errors.bio
                  ? "border-[#ec48bd] ring-1 ring-[#ec48bd]/50 focus:border-[#ec48bd] focus:ring-1"
                  : "focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2]/50"
              }`}
            />
            <FieldError message={errors.bio?.message} />
          </div>

          {/* ── 핸들 (handle) ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-handle" className="text-xs font-semibold text-white/90">
                핸들 (Handle) <span className="text-white/40 text-[11px]">(선택)</span>
              </Label>
              <span className="text-[10px] text-white/40">{watchedHandle.replace("@", "").length}/30</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm select-none pointer-events-none">
                @
              </span>
              <Input
                id="edit-handle"
                placeholder="handle_name"
                {...register("handle")}
                className={`bg-[#1e2353]/60 border-white/10 text-white placeholder:text-white/30 h-10 rounded-xl text-sm pl-7 transition-all ${
                  errors.handle
                    ? "border-[#ec48bd] ring-1 ring-[#ec48bd]/50 focus-visible:border-[#ec48bd] focus-visible:ring-[#ec48bd]/50"
                    : "focus-visible:border-[#5865f2] focus-visible:ring-[#5865f2]/50"
                }`}
              />
            </div>
            <FieldError message={errors.handle?.message} />
          </div>

          {/* ── 저장 실패 에러 ── */}
          {updateProfileMutation.isError && (
            <div className="p-2.5 rounded-xl bg-[#ec48bd]/15 border border-[#ec48bd]/40 text-[#ec48bd] text-xs flex items-center gap-2 animate-in fade-in-50">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {updateProfileMutation.error instanceof Error
                  ? updateProfileMutation.error.message
                  : "프로필 저장 중 오류가 발생했습니다."}
              </span>
            </div>
          )}

          <DialogFooter className="pt-3 border-t border-white/10 gap-2 sm:justify-end">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isSaving}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
                >
                  취소
                </Button>
              }
            />
            <Button
              type="submit"
              disabled={isSubmitDisabled || !isDirty}
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold rounded-xl px-5 shadow-[0_4px_16px_rgba(88,101,242,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <span>저장하기</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfileDialog;
