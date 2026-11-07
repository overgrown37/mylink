"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const currentUrl = window.location.href;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        // Fallback for environments without modern clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      toast.success("링크가 클립보드에 복사되었습니다!", {
        description: currentUrl,
        duration: 3000,
      });
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
      toast.error("링크 복사에 실패했습니다.", {
        description: "브라우저 권한 설정을 확인해 주세요.",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      data-testid="share-button"
      className="gap-1.5 text-xs text-white/80 bg-white/5 hover:bg-white/15 hover:text-white border border-white/10 rounded-full px-3 transition-all cursor-pointer active:scale-95"
      title="링크 복사하기"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#35ed7e]" />
          <span className="text-[#35ed7e] font-semibold">복사됨!</span>
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
