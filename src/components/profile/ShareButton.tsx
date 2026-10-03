"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "마이링크 (MyLink) 프로필",
      text: "김무성의 마이링크 프로필을 확인해보세요!",
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("공유 실패:", err);
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      data-testid="share-button"
      className="gap-1.5 text-xs text-white/80 bg-white/5 hover:bg-white/15 hover:text-white border border-white/10 rounded-full px-3 transition-all"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#35ed7e]" />
          <span className="text-[#35ed7e] font-medium">복사됨!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 text-white/70" />
          <span>공유하기</span>
        </>
      )}
    </Button>
  );
}

export default ShareButton;
