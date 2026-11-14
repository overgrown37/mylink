"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GoogleLogo } from "@/components/auth/GoogleAuthButton";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  MousePointerClick,
  BarChart3,
  Globe,
  Zap,
  CheckCircle2,
  ExternalLink,
  Pencil,
  User,
  TrendingUp,
  Share2,
} from "lucide-react";

interface DemoLink {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  badge?: string;
  featured?: boolean;
  clicks: number;
}

const INITIAL_DEMO_LINKS: DemoLink[] = [
  {
    id: "demo-1",
    icon: "🚀",
    title: "포트폴리오 & 대표 프로젝트",
    subtitle: "2026 최신 작업물 모아보기",
    badge: "HOT",
    featured: true,
    clicks: 128,
  },
  {
    id: "demo-2",
    icon: "💻",
    title: "GitHub 오픈소스",
    subtitle: "github.com/my-workspace",
    clicks: 64,
  },
  {
    id: "demo-3",
    icon: "📺",
    title: "유튜브 & 기술 블로그",
    subtitle: "주간 개발 아티클 연재 중",
    clicks: 42,
  },
];

export function LandingPage() {
  const { loginWithGoogle, isAuthenticating, error } = useAuthStore();
  const [handleInput, setHandleInput] = useState("");
  const [demoLinks, setDemoLinks] = useState<DemoLink[]>(INITIAL_DEMO_LINKS);
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);

  const previewHandle = handleInput.trim().replace(/\s+/g, "_") || "creator";
  const totalDemoClicks = demoLinks.reduce((sum, l) => sum + l.clicks, 0);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      // useAuthStore 내부에서 에러 및 취소 상태를 안전하게 처리
    }
  };

  const handleDemoClick = (id: string) => {
    setDemoLinks((prev) =>
      prev.map((link) =>
        link.id === id ? { ...link, clicks: link.clicks + 1 } : link
      )
    );
    setLastClickedId(id);
  };

  return (
    <div className="w-full space-y-16 sm:space-y-24 py-4 sm:py-8 animate-in fade-in duration-500">
      {/* ─── 1. Hero Section (2-Column Desktop / Stacked Mobile) ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left: Copy, Handle Claim Simulator & CTA */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5865f2]/15 border border-[#5865f2]/40 text-xs font-semibold text-white/90 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#ec48bd]" />
            <span>크리에이터 · 개발자를 위한 스마트 원링크</span>
            <Badge className="bg-[#35ed7e]/20 text-[#35ed7e] border-0 text-[10px] px-1.5 py-0 font-bold">
              FREE
            </Badge>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              흩어진 모든 링크를
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5865f2] via-[#ec48bd] to-[#35ed7e]">
                단 하나의 공간에.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-xl leading-relaxed">
              복잡한 설정 없이 Google 계정으로 3초 만에 나만의 고유 주소를 만들고,
              방문자들의 클릭 반응까지 실시간 차트로 확인해 보세요.
            </p>
          </div>

          {/* Interactive URL Handle Claim Box */}
          <div className="w-full max-w-md space-y-2.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-2xl bg-[#12163a]/90 border border-[#5865f2]/40 focus-within:border-[#35ed7e] shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-colors">
              <div className="flex items-center flex-1 px-3 py-2 sm:py-0 min-w-0">
                <span className="text-xs sm:text-sm font-mono text-white/45 shrink-0 select-none">
                  mylink /
                </span>
                <input
                  type="text"
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  placeholder="your_name"
                  maxLength={24}
                  aria-label="원하는 마이링크 닉네임 입력"
                  className="w-full bg-transparent text-xs sm:text-sm font-mono font-bold text-[#35ed7e] placeholder:text-white/25 focus:outline-none ml-1"
                />
              </div>

              <Button
                data-testid="btn-guest-login-cta"
                onClick={handleLogin}
                disabled={isAuthenticating}
                className="h-11 sm:h-10 px-5 rounded-xl bg-white hover:bg-white/95 text-slate-900 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#5865f2]" />
                    <span>연결 중...</span>
                  </>
                ) : (
                  <>
                    <GoogleLogo className="w-4 h-4" />
                    <span>시작하기</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="w-full p-2.5 rounded-xl bg-[#ec48bd]/15 border border-[#ec48bd]/40 text-[#ec48bd] text-xs flex items-center justify-center lg:justify-start gap-1.5 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1 text-[11px] text-white/50 px-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#35ed7e]" />
                별도 회원가입 없음
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#35ed7e]" />
                실시간 클릭 통계 제공
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#35ed7e]" />
                100% 무료
              </span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Live Phone Mockup */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="relative w-full max-w-[340px]">
            {/* Ambient Glow behind mockup */}
            <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-[#5865f2]/35 via-[#ec48bd]/25 to-[#35ed7e]/25 blur-2xl opacity-70 pointer-events-none" />

            {/* Phone Frame */}
            <div className="relative rounded-[2rem] bg-[#0d113f]/95 border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.65)] p-4 sm:p-5 space-y-4 backdrop-blur-xl">
              {/* Top Browser / Phone Pill */}
              <div className="flex items-center justify-between text-[10px] text-white/50 pb-1 border-b border-white/10">
                <span className="font-mono truncate max-w-[180px] text-white/70">
                  mylink.app/<span className="text-[#35ed7e] font-bold">{previewHandle}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[#35ed7e] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#35ed7e] animate-pulse" />
                  미리보기
                </span>
              </div>

              {/* Mock Profile Header */}
              <div className="flex flex-col items-center text-center space-y-2 pt-1">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5865f2] to-[#ec48bd] p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-full bg-[#161b4e] flex items-center justify-center">
                      <User className="w-7 h-7 text-white/80" />
                    </div>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#35ed7e] border-2 border-[#0d113f] flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-[#0d113f] stroke-[3]" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white tracking-tight truncate max-w-[220px]">
                    {previewHandle}
                  </p>
                  <p className="text-[11px] font-mono text-[#35ed7e]">
                    @{previewHandle.toLowerCase()}
                  </p>
                </div>
              </div>

              {/* Interactive Hint */}
              <div className="text-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60">
                  <MousePointerClick className="w-3 h-3 text-[#ec48bd]" />
                  아래 샘플 카드를 눌러 클릭 집계를 체험해 보세요!
                </span>
              </div>

              {/* Interactive Demo Link Cards */}
              <div className="space-y-2">
                {demoLinks.map((item) => {
                  const isJustClicked = lastClickedId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleDemoClick(item.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer active:scale-[0.98] group ${
                        item.featured
                          ? "bg-[#1e2353]/90 border-[#5865f2] hover:border-[#35ed7e] shadow-[0_4px_20px_rgba(88,101,242,0.25)]"
                          : "bg-[#1e2353]/45 border-white/10 hover:bg-[#1e2353]/80 hover:border-[#5865f2]/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-base shrink-0 group-hover:scale-110 transition-transform">
                            {item.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white truncate group-hover:text-[#35ed7e] transition-colors">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="px-1.5 py-0 rounded bg-[#5865f2] text-[9px] font-extrabold text-white shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-white/45 truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md transition-colors ${
                              isJustClicked
                                ? "bg-[#35ed7e]/25 text-[#35ed7e]"
                                : "bg-white/5 text-white/60"
                            }`}
                          >
                            {item.clicks}
                          </span>
                          <ExternalLink className="w-3 h-3 text-white/35 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Mini Stat Bar at Bottom of Mockup */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-white/50 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#35ed7e]" />
                  실시간 누적 클릭
                </span>
                <span className="font-mono font-black text-[#35ed7e]">
                  {totalDemoClicks.toLocaleString()}회
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Feature Bento Grid ─── */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5">
          <Badge className="bg-[#5865f2]/15 text-[#7289da] border border-[#5865f2]/30 text-[11px] px-2.5 py-0.5">
            왜 마이링크인가요?
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            필요한 기능만 깔끔하고 강력하게
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <Card className="p-5 rounded-2xl bg-[#12163a]/80 border border-white/10 hover:border-[#5865f2]/50 transition-all space-y-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#5865f2]/20 border border-[#5865f2]/40 flex items-center justify-center text-[#5865f2] group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">고유 주소 선점</h3>
            <p className="text-xs text-white/55 leading-relaxed">
              중복 없는 나만의 닉네임 URL(<span className="font-mono text-white/80">/닉네임</span>)을 즉시 발급받고 소셜 프로필에 연결하세요.
            </p>
          </Card>

          <Card className="p-5 rounded-2xl bg-[#12163a]/80 border border-white/10 hover:border-[#35ed7e]/50 transition-all space-y-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#35ed7e]/15 border border-[#35ed7e]/35 flex items-center justify-center text-[#35ed7e] group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">실시간 클릭 차트</h3>
            <p className="text-xs text-white/55 leading-relaxed">
              방문자가 클릭할 때마다 즉시 집계되며, 전용 <span className="font-mono text-white/80">/stat</span> 대시보드에서 막대·도넛 차트로 분석합니다.
            </p>
          </Card>

          <Card className="p-5 rounded-2xl bg-[#12163a]/80 border border-white/10 hover:border-[#ec48bd]/50 transition-all space-y-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#ec48bd]/15 border border-[#ec48bd]/35 flex items-center justify-center text-[#ec48bd] group-hover:scale-110 transition-transform">
              <Pencil className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">인라인 빠른 편집</h3>
            <p className="text-xs text-white/55 leading-relaxed">
              카드 위에서 바로 제목, 주소, 이모지 아이콘, Featured 강조 배지까지 직관적으로 수정할 수 있습니다.
            </p>
          </Card>

          <Card className="p-5 rounded-2xl bg-[#12163a]/80 border border-white/10 hover:border-[#06b6d4]/50 transition-all space-y-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/15 border border-[#06b6d4]/35 flex items-center justify-center text-[#06b6d4] group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">클라우드 실시간 동기화</h3>
            <p className="text-xs text-white/55 leading-relaxed">
              Google 계정 하나로 개인 전용 클라우드 저장소가 생성되어 PC와 모바일 어디서나 즉시 동기화됩니다.
            </p>
          </Card>
        </div>
      </section>

      {/* ─── 3. How It Works (3-Step Flow) ─── */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            딱 3단계면 충분합니다
          </h2>
          <p className="text-xs sm:text-sm text-white/55">
            설치나 복잡한 코딩 없이 바로 나만의 링크 허브를 운영해 보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Google 3초 로그인",
              desc: "복잡한 회원가입 폼 없이 기존 Google 계정으로 한 번에 시작합니다.",
              accent: "text-[#5865f2] border-[#5865f2]/40 bg-[#5865f2]/10",
            },
            {
              step: "02",
              title: "링크 & 프로필 등록",
              desc: "유튜브, GitHub, 블로그 등 알리고 싶은 링크를 이모지와 함께 추가하세요.",
              accent: "text-[#ec48bd] border-[#ec48bd]/40 bg-[#ec48bd]/10",
            },
            {
              step: "03",
              title: "공유 및 통계 확인",
              desc: "내 고유 링크를 공유하고 어떤 링크가 가장 인기 있는지 차트로 확인하세요.",
              accent: "text-[#35ed7e] border-[#35ed7e]/40 bg-[#35ed7e]/10",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-3"
            >
              <span
                className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border text-xs font-black font-mono ${item.accent}`}
              >
                {item.step}
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-white/55 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. Bottom CTA Banner ─── */}
      <section>
        <div className="relative overflow-hidden rounded-3xl p-7 sm:p-10 bg-gradient-to-r from-[#1a1f5c] via-[#171b4d] to-[#1e1545] border border-[#5865f2]/40 shadow-[0_12px_40px_rgba(0,0,0,0.45)] text-center space-y-5">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#5865f2]/25 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#35ed7e]/15 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#35ed7e]">
              <Share2 className="w-3.5 h-3.5" />
              <span>지금 바로 시작할 준비가 되셨나요?</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              당신만의 마이링크 페이지를 무료로 만들어 보세요
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              지금 로그인하고 원하는 닉네임을 가장 먼저 선점하세요.
            </p>
          </div>

          <div className="relative z-10 flex justify-center">
            <Button
              size="lg"
              onClick={handleLogin}
              disabled={isAuthenticating}
              className="h-12 px-7 rounded-2xl bg-white hover:bg-white/95 text-slate-900 font-bold text-sm shadow-[0_4px_25px_rgba(255,255,255,0.2)] hover:shadow-[0_4px_30px_rgba(88,101,242,0.45)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#5865f2]" />
                  <span>로그인 진행 중...</span>
                </>
              ) : (
                <>
                  <GoogleLogo className="w-4 h-4" />
                  <span>Google 계정으로 무료 시작하기</span>
                  <ArrowRight className="w-4 h-4 text-slate-700" />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
