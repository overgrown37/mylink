"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Loader2, User as UserIcon } from "lucide-react";

export function GoogleLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GoogleAuthButton() {
  const { user, userProfile, isLoading, isAuthenticating, loginWithGoogle, logout } =
    useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      // 에러는 useAuthStore 내부에서 관리되거나 팝업 취소 시 조용히 처리
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 초기 인증 상태 확인 중일 때
  if (isLoading && !user) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs animate-pulse">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5865f2]" />
        <span>확인 중...</span>
      </div>
    );
  }

  // 로그인 상태인 경우: 아바타 + 이름 + 로그아웃 버튼
  if (user) {
    const avatar = userProfile?.photoURL || user.photoURL;
    const name = user.email ? user.email.split("@")[0] : (userProfile?.displayName || user.displayName || "사용자");

    return (
      <div className="flex items-center gap-2 animate-in fade-in duration-300">
        <div
          className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all max-w-[150px] sm:max-w-[180px]"
          title={`${name} (${user.email || ""})`}
        >
          <Avatar className="w-5 h-5 border border-[#35ed7e]/50">
            {avatar ? (
              <AvatarImage src={avatar} alt={name} />
            ) : null}
            <AvatarFallback className="bg-[#1e2353] text-[9px] text-white">
              <UserIcon className="w-3 h-3 text-white/70" />
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-white/90 truncate">
            {name}
          </span>
        </div>

        <Button
          data-testid="btn-google-logout"
          variant="ghost"
          size="xs"
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="로그아웃"
          className="h-7 px-2 text-white/60 hover:text-[#ec48bd] hover:bg-[#ec48bd]/10 rounded-full transition-all text-xs gap-1 border border-transparent hover:border-[#ec48bd]/30 cursor-pointer"
        >
          {isLoggingOut ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <LogOut className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline text-[11px]">로그아웃</span>
        </Button>
      </div>
    );
  }

  // 비로그인 상태인 경우: Google 로그인 버튼
  return (
    <Button
      data-testid="btn-google-login"
      variant="outline"
      size="sm"
      onClick={handleLogin}
      disabled={isAuthenticating}
      className="h-8 px-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 hover:border-[#5865f2]/60 text-white font-medium text-xs gap-1.5 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(88,101,242,0.3)] active:scale-95 cursor-pointer"
    >
      {isAuthenticating ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5865f2]" />
          <span>로그인 중...</span>
        </>
      ) : (
        <>
          <GoogleLogo className="w-3.5 h-3.5" />
          <span className="font-semibold">Google 로그인</span>
        </>
      )}
    </Button>
  );
}

export default GoogleAuthButton;
