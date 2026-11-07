"use client";

import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { GoogleLogo } from "./GoogleAuthButton";
import { Sparkles, ShieldCheck, Zap, Globe, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export function GuestWelcomeHero() {
  const { loginWithGoogle, isAuthenticating, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      // useAuthStore 내부에서 에러 및 취소 상태를 안전하게 처리
    }
  };

  return (
    <div className="w-full my-4 rounded-3xl p-6 sm:p-7 relative overflow-hidden bg-gradient-to-b from-[#141946]/90 to-[#0e1236]/90 border border-[#5865f2]/40 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-in fade-in duration-500">
      {/* Decorative gradient flare */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-[#5865f2]/30 via-[#ec48bd]/20 to-transparent blur-2xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#35ed7e]/15 blur-2xl rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5865f2]/20 border border-[#5865f2]/50 text-[#7289da] text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#ec48bd]" />
          <span>로그인 후 링크 관리가 가능합니다</span>
        </div>

        {/* Headline */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            나만의 멀티 링크를 <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5865f2] via-[#ec48bd] to-[#35ed7e]">
              단 3초 만에
            </span>{" "}
            시작하세요
          </h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto leading-relaxed">
            Google 계정으로 로그인하면 개인 전용 저장소(<span className="font-mono text-white/90 bg-white/10 px-1 py-0.5 rounded text-[11px]">users/{`{uid}`}/links</span>)가 생성되어 나만의 링크를 실시간으로 등록하고 관리할 수 있습니다.
          </p>
        </div>

        {/* Feature Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full pt-1 text-left">
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-[#35ed7e] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">실시간 동기화</div>
              <div className="text-[10px] text-white/50">Firestore 클라우드 즉시 반영</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#5865f2] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">개인 계정 격리</div>
              <div className="text-[10px] text-white/50">내 계정 전용 독립 저장소</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-2.5">
            <Globe className="w-4 h-4 text-[#ec48bd] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">원클릭 공유</div>
              <div className="text-[10px] text-white/50">소셜, 포트폴리오 한곳에 집결</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2 w-full max-w-xs">
          <Button
            data-testid="btn-guest-login-cta"
            size="lg"
            onClick={handleLogin}
            disabled={isAuthenticating}
            className="w-full h-12 rounded-2xl bg-white hover:bg-white/95 text-slate-900 font-bold text-sm shadow-[0_4px_25px_rgba(255,255,255,0.25)] hover:shadow-[0_4px_30px_rgba(88,101,242,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#5865f2]" />
                <span>로그인 진행 중...</span>
              </>
            ) : (
              <>
                <GoogleLogo className="w-4 h-4" />
                <span>Google 계정으로 시작하기</span>
                <ArrowRight className="w-4 h-4 ml-0.5 text-slate-700" />
              </>
            )}
          </Button>
          {error && (
            <div className="w-full mt-2.5 p-2.5 rounded-xl bg-[#ec48bd]/15 border border-[#ec48bd]/40 text-[#ec48bd] text-xs flex items-center justify-center gap-1.5 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <p className="text-[10px] text-white/40 mt-2">
            별도의 회원가입 없이 Google 계정으로 간편하게 시작할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GuestWelcomeHero;
