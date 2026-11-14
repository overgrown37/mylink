"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  LogOut,
  Loader2,
  User as UserIcon,
  ChevronDown,
  Globe,
  Home,
  Pencil,
  BarChart2,
} from "lucide-react";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";

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
  const { user, userProfile: authProfile, isLoading, isAuthenticating, loginWithGoogle, logout } =
    useAuthStore();
  const { data: queryProfile } = useProfileQuery(user?.uid);
  const currentProfile = queryProfile || authProfile;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      // 조용히 처리
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      setMenuOpen(false);
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

  // 로그인 상태인 경우: 아바타 + 이름 + 드롭다운 토글
  if (user) {
    const avatar = currentProfile?.photoURL || user.photoURL;
    const emailPrefix = user.email ? user.email.split("@")[0] : "user";
    const displayName = currentProfile?.displayName || emailPrefix;
    const handle = currentProfile?.handle || `@${emailPrefix}`;
    const publicPageHref = `/${encodeURIComponent(displayName)}`;

    return (
      <div className="relative inline-block text-left" ref={menuRef}>
        {/* Profile Chip Button (Dropdown Trigger) */}
        <button
          type="button"
          data-testid="profile-dropdown-trigger"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full border transition-all cursor-pointer select-none max-w-[170px] sm:max-w-[200px] ${
            menuOpen
              ? "bg-[#5865f2]/20 border-[#5865f2] shadow-[0_0_15px_rgba(88,101,242,0.4)]"
              : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
          }`}
          title={`${displayName} (${user.email || ""})`}
        >
          <Avatar className="w-5 h-5 border border-[#35ed7e]/50">
            {avatar ? (
              <AvatarImage src={avatar} alt={displayName} />
            ) : null}
            <AvatarFallback className="bg-[#1e2353] text-[9px] text-white">
              <UserIcon className="w-3 h-3 text-white/70" />
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-white/90 truncate">
            {displayName}
          </span>
          <ChevronDown
            className={`w-3 h-3 text-white/50 transition-transform duration-200 ${
              menuOpen ? "rotate-180 text-white" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div
            data-testid="profile-dropdown-menu"
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#12163a] border border-[#5865f2]/40 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Header info */}
            <div className="px-3 py-2.5 space-y-1">
              <div className="flex items-center gap-2">
                <Avatar className="w-7 h-7 border border-[#35ed7e]/50">
                  {avatar ? <AvatarImage src={avatar} alt={displayName} /> : null}
                  <AvatarFallback className="bg-[#1e2353] text-xs text-white">
                    <UserIcon className="w-3.5 h-3.5 text-white/70" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate leading-tight">
                    {displayName}
                  </p>
                  <p className="text-[11px] font-mono text-[#35ed7e] truncate">
                    {handle}
                  </p>
                </div>
              </div>
              {user.email && (
                <p className="text-[10px] text-white/40 truncate pt-0.5">
                  {user.email}
                </p>
              )}
            </div>

            <Separator className="bg-white/10 my-1" />

            {/* Menu Items */}
            <div className="py-1 space-y-0.5">
              {/* 내 공개 페이지 이동 */}
              <Link
                href={publicPageHref}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-left hover:bg-[#5865f2]/20 text-white/90 hover:text-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-lg bg-[#35ed7e]/15 text-[#35ed7e]">
                    <Globe className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-xs font-semibold block">내 공개 페이지 보기</span>
                    <span className="text-[10px] text-white/40 block truncate max-w-[130px]">
                      /{displayName}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] uppercase font-bold text-[#35ed7e] bg-[#35ed7e]/10 border border-[#35ed7e]/30 px-1.5 py-0.5 rounded-md">
                  Live
                </span>
              </Link>

              {/* 통계 페이지 이동 */}
              <Link
                href="/stat"
                data-testid="menu-item-stat"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-left hover:bg-[#5865f2]/20 text-white/90 hover:text-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-lg bg-[#5865f2]/20 text-[#5865f2] group-hover:text-[#35ed7e] transition-colors">
                    <BarChart2 className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-xs font-semibold block">통계 대시보드</span>
                    <span className="text-[10px] text-white/40 block">
                      클릭 수 & 트래픽 차트
                    </span>
                  </div>
                </div>
                <span className="text-[9px] uppercase font-bold text-[#5865f2] bg-[#5865f2]/15 border border-[#5865f2]/30 px-1.5 py-0.5 rounded-md">
                  Chart
                </span>
              </Link>

              {/* 프로필 수정 모달 트리거 */}
              <EditProfileDialog
                trigger={
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-left hover:bg-white/5 text-white/80 hover:text-white transition-all cursor-pointer"
                  >
                    <span className="p-1 rounded-lg bg-white/5 text-white/60">
                      <Pencil className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-medium">프로필 정보 수정</span>
                  </button>
                }
              />

              {/* 관리 홈 이동 */}
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-left hover:bg-white/5 text-white/80 hover:text-white transition-all cursor-pointer"
              >
                <span className="p-1 rounded-lg bg-white/5 text-white/60">
                  <Home className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-medium">내 링크 관리 홈</span>
              </Link>
            </div>

            <Separator className="bg-white/10 my-1" />

            {/* Logout Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-left text-white/60 hover:text-[#ec48bd] hover:bg-[#ec48bd]/15 transition-all text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                  <span>로그아웃</span>
                </div>
                {isLoggingOut && <Loader2 className="w-3 h-3 animate-spin" />}
              </button>
            </div>
          </div>
        )}
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
