"use client";

import React, { useState } from "react";
import { LinkItem } from "@/types/profile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles, Pencil, Trash2, MousePointerClick } from "lucide-react";
import { InlineEditLinkCard } from "./InlineEditLinkCard";
import { DeleteLinkDialog } from "./DeleteLinkDialog";
import { useAuthStore } from "@/store/useAuthStore";
import { recordLinkClick } from "@/lib/linkAnalytics";

interface LinkCardProps {
  item: LinkItem;
}

export function LinkCard({ item }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const isFeatured = item.isFeatured;

  // 인라인 수정 모드일 때 인라인 편집 폼 렌더링
  if (isEditing) {
    return (
      <InlineEditLinkCard
        item={item}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)}
      />
    );
  }

  // 카드 본문 클릭 시 링크 새 창으로 이동 및 카운트 +1
  const handleCardClick = () => {
    if (item.url) {
      if (user?.uid) {
        recordLinkClick(user.uid, item.id);
      }
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <div
        data-testid={`link-card-${item.id}`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        className="group relative block w-full outline-none focus-visible:ring-2 focus-visible:ring-[#5865f2] rounded-2xl transition-all cursor-pointer active:scale-[0.99]"
      >
        <Card
          className={`relative overflow-hidden p-3.5 sm:p-4 rounded-2xl transition-all duration-300 border ${
            isFeatured
              ? "bg-[#1e2353]/80 border-[#5865f2] shadow-[0_8px_32px_rgba(88,101,242,0.25)] hover:shadow-[0_12px_40px_rgba(88,101,242,0.4)] hover:border-[#35ed7e]"
              : "bg-[#1e2353]/35 border-[#1e2353]/80 hover:bg-[#1e2353]/70 hover:border-[#5865f2]/50 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
          }`}
        >
          {/* Subtle decorative glow for featured card */}
          {isFeatured && (
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-[#5865f2]/20 rounded-full blur-xl pointer-events-none" />
          )}

          <div className="flex items-center justify-between gap-3 relative z-10">
            {/* Left: Icon or Emoji */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {item.icon && (
                <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-xl shadow-inner group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
              )}

              {/* Middle: Title & Subtitle */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-semibold text-white tracking-tight group-hover:text-[#35ed7e] transition-colors truncate">
                    {item.title}
                  </span>

                  {item.badge && (
                    <Badge
                      variant={isFeatured ? "default" : "secondary"}
                      className={`text-[10px] px-1.5 py-0 h-4 font-bold uppercase tracking-wider rounded-md border ${
                        item.badge === "HOT" || item.badge === "NEW"
                          ? "bg-[#ec48bd] text-white border-transparent"
                          : isFeatured
                          ? "bg-[#5865f2] text-white border-transparent"
                          : "bg-white/10 text-white/90 border-white/10"
                      }`}
                    >
                      {isFeatured && (
                        <Sparkles className="w-2.5 h-2.5 mr-0.5 inline" />
                      )}
                      {item.badge}
                    </Badge>
                  )}

                  {/* 누적 클릭 수 뱃지 */}
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#35ed7e]"
                    title={`누적 클릭 수: ${item.clicks || 0}회`}
                  >
                    <MousePointerClick className="w-2.5 h-2.5" />
                    <span>{item.clicks || 0}</span>
                  </span>
                </div>

                {item.subtitle && (
                  <p className="text-xs text-white/60 line-clamp-1 mt-0.5 group-hover:text-white/80 transition-colors">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Right: 항상 표시되는 수정/삭제 버튼 및 외부 링크 아이콘 */}
            <div
              className="flex items-center gap-1 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 수정 버튼 (항상 표시) */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                data-testid={`btn-edit-link-${item.id}`}
                title="링크 수정"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#5865f2]/30 text-white/70 hover:text-white border border-white/10 hover:border-[#5865f2]/50 transition-all cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span className="sr-only">수정</span>
              </Button>

              {/* 삭제 버튼 (항상 표시) */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                data-testid={`btn-delete-link-${item.id}`}
                title="링크 삭제"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#ec48bd]/30 text-white/70 hover:text-[#ec48bd] border border-white/10 hover:border-[#ec48bd]/50 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="sr-only">삭제</span>
              </Button>

              {/* 외부 링크 아이콘 */}
              <div className="w-6 h-8 flex items-center justify-center text-white/40 group-hover:text-[#35ed7e] group-hover:translate-x-0.5 transition-all">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 삭제 확인 모달 */}
      <DeleteLinkDialog
        item={item}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}

export default LinkCard;
