"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { LinkItem } from "@/types/profile";
import { deleteLinkFromFirestore } from "@/lib/firestoreLinks";
import { useProfileStore } from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { trackEvent } from "@/lib/firebase";

interface DeleteLinkDialogProps {
  item: LinkItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteLinkDialog({
  item,
  open,
  onOpenChange,
}: DeleteLinkDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const deleteLink = useProfileStore((state) => state.deleteLink);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    const startTime = Date.now();

    try {
      // 1. 파이어베이스 Firestore에서 링크 삭제 (users/{user.uid}/links)
      await deleteLinkFromFirestore(item.id, user?.uid);

      // 2. 애널리틱스 이벤트 트래킹
      trackEvent("link_deleted", {
        linkId: item.id,
        linkTitle: item.title,
      });

      // 3. Zustand 로컬 스토어 동기화 (즉각 반영)
      deleteLink(item.id);

      // 사용자가 삭제 중임을 시각적으로 충분히 인지할 수 있도록 최소 500ms 스피너 노출 보장
      const elapsed = Date.now() - startTime;
      if (elapsed < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - elapsed));
      }

      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Firestore 링크 삭제 실패:", err);
      const message =
        err instanceof Error
          ? err.message
          : "삭제 중 오류가 발생했습니다. 다시 시도해주세요.";
      setErrorMessage(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#12163a] border border-[#ec48bd]/40 text-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 sm:max-w-sm">
        <DialogHeader className="gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ec48bd]/20 border border-[#ec48bd]/40 flex items-center justify-center text-[#ec48bd] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-white tracking-tight">
                정말 삭제하시겠습니까?
              </DialogTitle>
              <DialogDescription className="text-xs text-white/60 mt-0.5">
                이 작업은 되돌릴 수 없습니다.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* 삭제 대상 링크 이름 표시 박스 */}
        <div className="my-2 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          {item.icon && (
            <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm shrink-0">
              {item.icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white/50">삭제 대상</p>
            <p className="text-sm font-semibold text-white truncate">
              {item.title}
            </p>
          </div>
        </div>

        {/* 오류 메시지 */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-[#ec48bd]/15 border border-[#ec48bd]/40 text-[#ec48bd] text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <DialogFooter className="pt-2 border-t border-white/10 gap-2 sm:justify-end">
          <DialogClose
            render={
              <Button
                type="button"
                variant="ghost"
                disabled={isDeleting}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
              >
                취소
              </Button>
            }
          />
          <Button
            type="button"
            data-testid={`confirm-delete-link-${item.id}`}
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-[#ec48bd] hover:bg-[#d633a6] text-white font-bold rounded-xl px-4 shadow-[0_4px_16px_rgba(236,72,189,0.4)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>삭제 중...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>삭제하기</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteLinkDialog;
