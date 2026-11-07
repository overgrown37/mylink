"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import { Globe, ExternalLink, Home } from "lucide-react";

export function MyPageButton() {
  const { user, userProfile: authProfile } = useAuthStore();
  const { data: queryProfile } = useProfileQuery(user?.uid);
  const currentProfile = queryProfile || authProfile;
  const pathname = usePathname();

  // 비로그인 상태일 때는 표시하지 않음
  if (!user) return null;

  const emailPrefix = user.email ? user.email.split("@")[0] : "user";
  const displayName = currentProfile?.displayName || emailPrefix;
  const publicPageHref = `/${encodeURIComponent(displayName)}`;

  // 현재 본인의 공개 페이지에 머물고 있는 경우: "관리 홈"으로 이동 버튼 제공
  const isCurrentlyOnMyPublicPage =
    pathname === publicPageHref || decodeURIComponent(pathname) === `/${displayName}`;

  if (isCurrentlyOnMyPublicPage) {
    return (
      <Link
        href="/"
        data-testid="btn-header-home"
        className="flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#5865f2]/50 text-white/90 hover:text-white text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer group"
        title="마이링크 관리 홈으로 이동"
      >
        <Home className="w-3.5 h-3.5 text-[#5865f2] group-hover:scale-110 transition-transform" />
        <span className="hidden xs:inline sm:inline">관리 홈</span>
      </Link>
    );
  }

  // 기본 상태: "내 페이지" 바로가기 버튼
  return (
    <Link
      href={publicPageHref}
      data-testid="btn-header-mypage"
      className="flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-full bg-[#5865f2]/15 hover:bg-[#5865f2]/25 border border-[#5865f2]/40 hover:border-[#35ed7e] text-white text-xs font-semibold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(88,101,242,0.3)] active:scale-95 cursor-pointer group"
      title={`${displayName}님의 공개 페이지로 이동`}
    >
      <Globe className="w-3.5 h-3.5 text-[#35ed7e] group-hover:scale-110 transition-transform" />
      <span className="hidden xs:inline sm:inline">내 페이지</span>
      <ExternalLink className="w-3 h-3 text-white/50 group-hover:text-white transition-colors" />
    </Link>
  );
}

export default MyPageButton;

