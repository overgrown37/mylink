"use client";

import React, { useState } from "react";
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
import { Plus, Sparkles, Link2 } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";

const EMOJI_PRESETS = ["🔗", "🚀", "✨", "💡", "🎨", "📝", "☕", "💖", "🔥", "⭐"];

export function AddLinkDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [icon, setIcon] = useState("🔗");
  const [badge, setBadge] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const addLink = useProfileStore((state) => state.addLink);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) return;

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith("mailto:")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    addLink({
      type: "link",
      title: title.trim(),
      url: formattedUrl,
      subtitle: subtitle.trim() || undefined,
      icon: icon.trim() || "🔗",
      badge: badge.trim() || undefined,
      isFeatured,
      category: "custom",
    });

    // Reset Form
    setTitle("");
    setUrl("");
    setSubtitle("");
    setIcon("🔗");
    setBadge("");
    setIsFeatured(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <form onSubmit={handleSubmit} className="space-y-4 my-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="link-title" className="text-xs font-semibold text-white/90">
              링크 제목 <span className="text-[#ec48bd]">*</span>
            </Label>
            <Input
              id="link-title"
              data-testid="input-link-title"
              placeholder="예: 내 노션 포트폴리오, 주간 뉴스레터"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-[#1e2353]/60 border-white/10 text-white placeholder:text-white/30 focus-visible:border-[#5865f2] focus-visible:ring-[#5865f2]/50 h-10 rounded-xl text-sm"
            />
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <Label htmlFor="link-url" className="text-xs font-semibold text-white/90">
              이동할 웹 URL <span className="text-[#ec48bd]">*</span>
            </Label>
            <Input
              id="link-url"
              data-testid="input-link-url"
              placeholder="https://example.com"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="bg-[#1e2353]/60 border-white/10 text-white placeholder:text-white/30 focus-visible:border-[#5865f2] focus-visible:ring-[#5865f2]/50 h-10 rounded-xl text-sm"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-1.5">
            <Label htmlFor="link-subtitle" className="text-xs font-semibold text-white/90">
              한 줄 설명 <span className="text-white/40 text-[11px]">(선택)</span>
            </Label>
            <Input
              id="link-subtitle"
              data-testid="input-link-subtitle"
              placeholder="예: 최신 작업물과 이력서가 정리되어 있습니다"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="bg-[#1e2353]/60 border-white/10 text-white placeholder:text-white/30 focus-visible:border-[#5865f2] focus-visible:ring-[#5865f2]/50 h-10 rounded-xl text-sm"
            />
          </div>

          {/* Emoji / Icon Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white/90">아이콘 이모지</Label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {EMOJI_PRESETS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border transition-all ${
                    icon === emoji
                      ? "bg-[#5865f2] border-white/40 scale-110 shadow-sm"
                      : "bg-[#1e2353]/40 border-white/10 hover:bg-[#1e2353]"
                  }`}
                >
                  {emoji}
                </button>
              ))}
              <Input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                maxLength={4}
                className="w-14 h-8 text-center bg-[#1e2353]/60 border-white/10 text-white text-sm rounded-lg"
                title="직접 입력"
              />
            </div>
          </div>

          {/* Badge & Featured Option */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="link-badge" className="text-xs font-semibold text-white/90">
                뱃지 텍스트 <span className="text-white/40 text-[11px]">(선택)</span>
              </Label>
              <Input
                id="link-badge"
                data-testid="input-link-badge"
                placeholder="예: NEW, HOT"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="bg-[#1e2353]/60 border-white/10 text-white placeholder:text-white/30 focus-visible:border-[#5865f2] focus-visible:ring-[#5865f2]/50 h-9 rounded-xl text-xs"
              />
            </div>

            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  data-testid="checkbox-link-featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-white/20 bg-[#1e2353] text-[#5865f2] focus:ring-[#5865f2] w-4 h-4 cursor-pointer accent-[#5865f2]"
                />
                <span className="text-xs font-medium text-white/80 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#ec48bd]" />
                  시그니처 강조 카드
                </span>
              </label>
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
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold rounded-xl px-5 shadow-[0_4px_16px_rgba(88,101,242,0.4)]"
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
