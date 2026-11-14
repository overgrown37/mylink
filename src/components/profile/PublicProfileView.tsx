"use client";

import React from "react";
import Link from "next/link";
import { LinkItem } from "@/types/profile";
import { FirestoreUserProfile } from "@/lib/userProfile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Share2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { MyPageButton } from "@/components/navigation/MyPageButton";
import { useAuthStore } from "@/store/useAuthStore";
import { recordLinkClick } from "@/lib/linkAnalytics";

interface PublicProfileViewProps {
  profile: FirestoreUserProfile;
  links: LinkItem[];
  isOwner?: boolean;
}

export function PublicProfileView({
  profile,
  links,
  isOwner: propIsOwner,
}: PublicProfileViewProps) {
  const [copied, setCopied] = React.useState(false);
  const currentAuthUser = useAuthStore((state) => state.user);
  const isOwner = propIsOwner ?? Boolean(currentAuthUser && currentAuthUser.uid === profile.uid);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.displayName}님의 마이링크`,
          text: profile.bio || `${profile.displayName}님의 공식 링크 모음`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("링크가 클립보드에 복사되었습니다!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // 취소 또는 클립보드 폴백
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("링크가 클립보드에 복사되었습니다!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // 무시
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d3a] text-white flex flex-col justify-between items-center relative overflow-x-hidden selection:bg-[#5865f2] selection:text-white">
      {/* Background glow effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-gradient-to-b from-[#5865f2]/20 via-[#ec48bd]/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-[#5865f2]/10 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Main Container: Mobile-first 440px max width */}
      <main className="w-full max-w-[440px] px-4 py-6 sm:py-10 flex flex-col flex-1">
        {/* Top Utility Bar */}
        <header className="flex items-center justify-between w-full pb-4 gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="마이링크 홈으로 이동"
          >
            <span className="text-xs font-black tracking-widest uppercase text-[#5865f2] group-hover:text-[#35ed7e] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full shadow-sm transition-colors">
              MyLink
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <MyPageButton />
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-8 px-2.5 rounded-full bg-white/5 hover:bg-white/10 border-white/10 hover:border-[#5865f2]/40 text-white text-xs gap-1.5 transition-all cursor-pointer"
              title="이 프로필 공유하기"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#35ed7e]" />
                  <span className="text-[#35ed7e] text-[11px] font-semibold">복사됨</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-[11px] hidden sm:inline">공유</span>
                </>
              )}
            </Button>
            <GoogleAuthButton />
          </div>
        </header>

        {/* 본인인 경우: 미리보기 안내 배너 */}
        {isOwner && (
          <div className="mb-4 p-3 rounded-2xl bg-[#5865f2]/15 border border-[#5865f2]/40 backdrop-blur-md flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 text-xs text-white/90">
              <span className="text-base">👀</span>
              <span className="font-medium">방문자용 공개 페이지를 미리보는 중입니다.</span>
            </div>
            <Link
              href="/"
              className="inline-flex items-center bg-[#5865f2] hover:bg-[#4752c4] text-white text-[11px] font-bold rounded-xl h-7 px-2.5 gap-1 shrink-0 transition-colors"
            >
              <span>관리 홈</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2 pb-6">
          {/* Avatar with glow */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#5865f2] via-[#35ed7e] to-[#ec48bd] opacity-75 blur-md" />
            <Avatar className="relative size-24 border-2 border-white/20 shadow-2xl">
              {profile.photoURL ? (
                <AvatarImage src={profile.photoURL} alt={profile.displayName} className="object-cover" />
              ) : null}
              <AvatarFallback className="bg-[#1e2353] text-white/60 font-bold flex items-center justify-center">
                <User className="size-11 text-white/50" />
              </AvatarFallback>
            </Avatar>
            <div
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#35ed7e] border-2 border-[#0a0d3a] flex items-center justify-center text-[#0a0d3a]"
              title="인증된 마이링크 사용자"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0a0d3a] stroke-[3]" />
            </div>
          </div>

          {/* Name & Handle */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {profile.displayName}
            </h1>
            <div className="flex items-center justify-center gap-1.5">
              <Badge
                variant="secondary"
                className="bg-white/10 text-white/80 font-mono text-xs px-2.5 py-0.5 border border-white/10"
              >
                {profile.handle}
              </Badge>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-white/75 max-w-sm whitespace-pre-line leading-relaxed font-normal px-2">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links List (Read-only) */}
        <div className="space-y-3 animate-in fade-in duration-300">
          {links.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-2">
              <p className="text-sm text-white/60">아직 등록된 공개 링크가 없습니다.</p>
              {isOwner && (
                <Link
                  href="/"
                  className="inline-flex items-center px-3 py-1.5 bg-[#5865f2] hover:bg-[#4752c4] rounded-xl text-xs font-semibold text-white mt-2 transition-colors"
                >
                  첫 링크 추가하기
                </Link>
              )}
            </div>
          ) : (
            links.map((item) => {
              const isFeatured = item.isFeatured;

              return (
                <a
                  key={item.id}
                  href={item.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordLinkClick(profile.uid, item.id)}
                  className="group relative block w-full outline-none focus-visible:ring-2 focus-visible:ring-[#5865f2] rounded-2xl transition-all cursor-pointer active:scale-[0.99]"
                >
                  <Card
                    className={`relative overflow-hidden p-3.5 sm:p-4 rounded-2xl transition-all duration-300 border ${
                      isFeatured
                        ? "bg-[#1e2353]/80 border-[#5865f2] shadow-[0_8px_32px_rgba(88,101,242,0.25)] hover:shadow-[0_12px_40px_rgba(88,101,242,0.4)] hover:border-[#35ed7e]"
                        : "bg-[#1e2353]/35 border-[#1e2353]/80 hover:bg-[#1e2353]/70 hover:border-[#5865f2]/50 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-[#5865f2]/20 rounded-full blur-xl pointer-events-none" />
                    )}

                    <div className="flex items-center justify-between gap-3 relative z-10">
                      {/* Left: Icon / Emoji */}
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
                              <Badge className="bg-[#5865f2] text-white text-[10px] font-extrabold uppercase px-1.5 py-0 tracking-wide border-0">
                                {item.badge}
                              </Badge>
                            )}
                            {isFeatured && (
                              <Badge className="bg-[#ec48bd]/20 text-[#ec48bd] border border-[#ec48bd]/40 text-[10px] px-1.5 py-0 flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Featured</span>
                              </Badge>
                            )}
                          </div>
                          {item.subtitle && (
                            <p className="text-xs text-white/50 truncate mt-0.5 group-hover:text-white/70 transition-colors">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: External Link Icon */}
                      <div className="flex-shrink-0 text-white/40 group-hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </a>
              );
            })
          )}
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-10 pb-4 text-center">
          <Separator className="bg-white/10 mb-6" />
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white rounded-full text-xs font-semibold gap-1.5 h-8 px-4 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#35ed7e]" />
              <span>나도 마이링크 만들기 (무료)</span>
            </Link>
            <p className="text-[11px] text-white/40">
              Powered by <span className="text-white/70 font-semibold">마이링크 (MyLink)</span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default PublicProfileView;
