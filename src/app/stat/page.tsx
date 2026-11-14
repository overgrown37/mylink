"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import { LinkItem } from "@/types/profile";
import { subscribeLinksFromFirestore } from "@/lib/firestoreLinks";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";
import {
  ArrowLeft,
  BarChart3,
  MousePointerClick,
  TrendingUp,
  Award,
  Percent,
  ExternalLink,
  Sparkles,
  Share2,
  Globe,
  Loader2,
  Lock,
} from "lucide-react";

// 다크 테마에 어울리는 팔레트
const PALETTE = [
  "#5865f2", // Discord Blurple
  "#35ed7e", // Emerald
  "#ec48bd", // Pink
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#8b5cf6", // Purple
  "#3b82f6", // Blue
  "#10b981", // Teal
];

export default function StatDashboardPage() {
  const { user, userProfile: authProfile, isLoading: isAuthLoading, loginWithGoogle } =
    useAuthStore();
  const { data: queryProfile } = useProfileQuery(user?.uid);
  const userProfile = queryProfile || authProfile;

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLinksLoading, setIsLinksLoading] = useState(true);

  // Firestore users/{uid}/links 실시간 구독
  useEffect(() => {
    if (!user) {
      setIsLinksLoading(false);
      return;
    }

    setIsLinksLoading(true);
    let isCancelled = false;

    const unsubscribe = subscribeLinksFromFirestore(
      (firestoreLinks) => {
        if (!isCancelled) {
          setLinks(firestoreLinks);
          setIsLinksLoading(false);
        }
      },
      (error) => {
        console.error("통계 링크 구독 실패:", error);
        if (!isCancelled) setIsLinksLoading(false);
      },
      user.uid
    );

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [user]);

  // 일반 링크 필터링 (헤더 아이템 제외)
  const validLinks = links.filter((l) => l.type === "link");
  const totalClicks = validLinks.reduce((sum, l) => sum + (l.clicks || 0), 0);
  const sortedLinks = [...validLinks].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  const topLink = sortedLinks.length > 0 && (sortedLinks[0].clicks || 0) > 0 ? sortedLinks[0] : null;
  const avgClicks = validLinks.length > 0 ? (totalClicks / validLinks.length).toFixed(1) : "0.0";

  // 1. shadcn BarChart용 데이터셋 구성
  const barChartData = sortedLinks.map((item, idx) => ({
    name: item.title.length > 10 ? `${item.title.slice(0, 10)}…` : item.title,
    fullTitle: item.title,
    clicks: item.clicks || 0,
    fill: PALETTE[idx % PALETTE.length],
  }));

  // BarChart Config
  const barChartConfig = {
    clicks: {
      label: "클릭 수",
      color: "#5865f2",
    },
  } satisfies ChartConfig;

  // 2. shadcn Donut/Pie Chart용 데이터셋 구성
  const pieChartData = sortedLinks
    .filter((l) => (l.clicks || 0) > 0)
    .map((item, idx) => ({
      name: item.title,
      clicks: item.clicks || 0,
      fill: PALETTE[idx % PALETTE.length],
    }));

  const pieChartConfig = sortedLinks.reduce<ChartConfig>((acc, item, idx) => {
    acc[`link_${item.id}`] = {
      label: item.title,
      color: PALETTE[idx % PALETTE.length],
    };
    return acc;
  }, {
    clicks: {
      label: "클릭 수",
    },
  });

  const publicPageHref = userProfile?.displayName
    ? `/${encodeURIComponent(userProfile.displayName)}`
    : "/";

  return (
    <div className="min-h-screen bg-[#0a0d3a] text-white flex flex-col items-center relative overflow-x-hidden selection:bg-[#5865f2] selection:text-white">
      {/* Background glow effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-gradient-to-b from-[#5865f2]/20 via-[#ec48bd]/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#5865f2]/10 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Main Container: 640px Max Width */}
      <main className="w-full max-w-2xl px-4 py-6 sm:py-10 flex flex-col flex-1 space-y-6">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between w-full gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#5865f2]/50 text-white/90 hover:text-white text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer group"
            title="내 링크 관리 홈으로 이동"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#5865f2] group-hover:-translate-x-0.5 transition-transform" />
            <span>관리 홈</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={publicPageHref}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[#5865f2]/15 hover:bg-[#5865f2]/25 border border-[#5865f2]/40 text-white text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
              title="내 공개 페이지 보기"
            >
              <Globe className="w-3.5 h-3.5 text-[#35ed7e]" />
              <span className="hidden sm:inline">내 페이지</span>
            </Link>
            <GoogleAuthButton />
          </div>
        </header>

        {/* Page Title & Status */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-gradient-to-br from-[#5865f2] to-[#ec48bd] text-white shadow-lg shadow-[#5865f2]/25">
                <BarChart3 className="w-5 h-5 text-white stroke-[2.5]" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>링크 통계 분석</span>
                  <Badge className="bg-[#35ed7e]/15 text-[#35ed7e] border border-[#35ed7e]/30 text-[10px] px-2 py-0.5">
                    Live
                  </Badge>
                </h1>
                <p className="text-xs text-white/50">
                  {userProfile?.displayName ? `${userProfile.displayName}님의 실시간 링크 클릭 트래픽 리포트` : "실시간 링크 클릭 트래픽 리포트"}
                </p>
              </div>
            </div>

            {user && (
              <div className="text-right text-[11px] text-white/40 font-mono hidden sm:block">
                <span>자동 실시간 동기화 중</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── 상태별 뷰: 로딩 / 비로그인 / 통계 대시보드 ─── */}
        {isAuthLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#5865f2]" />
            <span className="text-xs text-white/60">인증 정보를 확인하는 중...</span>
          </div>
        ) : !user ? (
          /* 비로그인 사용자 안내 카드 */
          <Card className="p-8 rounded-3xl bg-[#12163a]/80 border border-white/10 text-center space-y-4 backdrop-blur-md">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#5865f2]">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white">로그인이 필요한 페이지입니다</h2>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                마이링크에 로그인하시면 내 링크의 실시간 클릭 수와 시각화 차트를 확인할 수 있습니다.
              </p>
            </div>
            <Button
              onClick={loginWithGoogle}
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-xl text-xs font-semibold px-5 h-10 shadow-lg shadow-[#5865f2]/30 cursor-pointer"
            >
              Google 계정으로 로그인
            </Button>
          </Card>
        ) : isLinksLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#35ed7e]" />
            <span className="text-xs text-white/60">링크 클릭 데이터를 불러오는 중...</span>
          </div>
        ) : (
          /* ─── 정상 로그인 통계 대시보드 화면 ─── */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. 핵심 지표 요약 카드 (KPI 4종) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* 총 누적 클릭 수 */}
              <Card className="p-4 rounded-2xl bg-[#12163a]/80 border border-[#5865f2]/30 flex flex-col justify-between shadow-sm">
                <span className="text-[11px] font-semibold text-white/50 flex items-center gap-1.5">
                  <MousePointerClick className="w-3.5 h-3.5 text-[#35ed7e]" />
                  총 클릭 수
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#35ed7e] tracking-tight">
                    {totalClicks.toLocaleString()}
                  </span>
                  <span className="text-xs text-white/40">회</span>
                </div>
              </Card>

              {/* 활성 링크 수 */}
              <Card className="p-4 rounded-2xl bg-[#12163a]/80 border border-white/10 flex flex-col justify-between shadow-sm">
                <span className="text-[11px] font-semibold text-white/50 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#5865f2]" />
                  등록된 링크
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {validLinks.length}
                  </span>
                  <span className="text-xs text-white/40">개</span>
                </div>
              </Card>

              {/* 최고 인기 링크 */}
              <Card className="p-4 rounded-2xl bg-[#12163a]/80 border border-white/10 flex flex-col justify-between shadow-sm">
                <span className="text-[11px] font-semibold text-white/50 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#ec48bd]" />
                  최고 인기 링크
                </span>
                <div className="mt-2 truncate">
                  {topLink ? (
                    <div>
                      <p className="text-xs font-bold text-white truncate" title={topLink.title}>
                        {topLink.title}
                      </p>
                      <span className="text-[11px] font-mono text-[#ec48bd] font-bold">
                        {(topLink.clicks || 0).toLocaleString()}회
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-white/40 font-medium">클릭 없음</span>
                  )}
                </div>
              </Card>

              {/* 평균 클릭 수 */}
              <Card className="p-4 rounded-2xl bg-[#12163a]/80 border border-white/10 flex flex-col justify-between shadow-sm">
                <span className="text-[11px] font-semibold text-white/50 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-[#06b6d4]" />
                  평균 클릭
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#06b6d4] tracking-tight">
                    {avgClicks}
                  </span>
                  <span className="text-xs text-white/40">회/개</span>
                </div>
              </Card>
            </div>

            {/* 2. shadcn/ui 차트 영역 */}
            {validLinks.length === 0 ? (
              <Card className="p-12 rounded-3xl bg-[#12163a]/50 border border-white/10 text-center space-y-3">
                <p className="text-sm text-white/60">등록된 링크가 없습니다.</p>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] rounded-xl text-xs font-bold text-white transition-colors"
                >
                  홈에서 링크 추가하기
                </Link>
              </Card>
            ) : totalClicks === 0 ? (
              <Card className="p-10 rounded-3xl bg-[#12163a]/60 border border-white/10 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#5865f2]/10 border border-[#5865f2]/30 flex items-center justify-center text-[#5865f2]">
                  <Sparkles className="w-6 h-6 text-[#35ed7e]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">아직 기록된 클릭이 없습니다</h3>
                  <p className="text-xs text-white/50 max-w-sm mx-auto">
                    내 공개 프로필 페이지를 소셜 미디어나 친구에게 공유하여 첫 클릭을 유도해 보세요!
                  </p>
                </div>
                <Link
                  href={publicPageHref}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] rounded-xl text-xs font-bold text-white transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-[#35ed7e]" />
                  <span>내 공개 페이지 확인하기</span>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 2-A: shadcn BarChart (링크별 클릭 수) */}
                <Card className="p-5 rounded-3xl bg-[#12163a]/90 border border-white/10 shadow-lg backdrop-blur-md flex flex-col justify-between">
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>링크별 클릭 비교</span>
                        <Badge className="bg-[#5865f2]/20 text-[#5865f2] border-0 text-[10px] px-1.5 py-0">
                          막대 차트
                        </Badge>
                      </h3>
                    </div>
                    <p className="text-[11px] text-white/50">
                      각 링크가 획득한 누적 클릭 수 분포
                    </p>
                  </div>

                  <ChartContainer config={barChartConfig} className="h-64 w-full">
                    <BarChart
                      data={barChartData}
                      margin={{ top: 10, right: 10, left: -25, bottom: 25 }}
                    >
                      <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.07)" />
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        stroke="rgba(255, 255, 255, 0.5)"
                        fontSize={11}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        stroke="rgba(255, 255, 255, 0.5)"
                        fontSize={11}
                        allowDecimals={false}
                      />
                      <ChartTooltip
                        cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                        content={
                          <ChartTooltipContent
                            formatter={(value) => `${Number(value).toLocaleString()}회 클릭`}
                          />
                        }
                      />
                      <Bar
                        dataKey="clicks"
                        radius={[6, 6, 0, 0]}
                      >
                        {barChartData.map((entry, index) => (
                          <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </Card>

                {/* 2-B: shadcn DonutChart (클릭 점유율) */}
                <Card className="p-5 rounded-3xl bg-[#12163a]/90 border border-white/10 shadow-lg backdrop-blur-md flex flex-col justify-between">
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>클릭 점유율 분포</span>
                        <Badge className="bg-[#ec48bd]/20 text-[#ec48bd] border-0 text-[10px] px-1.5 py-0">
                          도넛 차트
                        </Badge>
                      </h3>
                    </div>
                    <p className="text-[11px] text-white/50">
                      전체 클릭 대비 링크별 상대 비중(%)
                    </p>
                  </div>

                  <ChartContainer
                    config={pieChartConfig}
                    className="mx-auto aspect-square h-64 w-full"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            formatter={(value) => {
                              const v = Number(value);
                              const pct = totalClicks > 0 ? Math.round((v / totalClicks) * 100) : 0;
                              return `${v.toLocaleString()}회 (${pct}%)`;
                            }}
                          />
                        }
                      />
                      <Pie
                        data={pieChartData}
                        dataKey="clicks"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={80}
                        strokeWidth={2}
                        stroke="#12163a"
                        paddingAngle={2}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`donut-cell-${index}`} fill={entry.fill} />
                        ))}
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-white text-xl sm:text-2xl font-black"
                                  >
                                    {totalClicks.toLocaleString()}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 18}
                                    className="fill-white/50 text-[10px] font-semibold tracking-wider uppercase"
                                  >
                                    Total Clicks
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </Card>
              </div>
            )}

            {/* 3. 순위별 상세 링크 테이블 / 리스트 */}
            <Card className="p-5 rounded-3xl bg-[#12163a]/90 border border-white/10 shadow-lg backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>링크별 상세 순위표</span>
                    <Badge className="bg-white/10 text-white/80 border-0 text-[10px] px-1.5 py-0 font-mono">
                      TOP {sortedLinks.length}
                    </Badge>
                  </h3>
                  <p className="text-[11px] text-white/50">
                    클릭 수 순서대로 정렬된 링크별 성과표
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {sortedLinks.map((link, idx) => {
                  const clicks = link.clicks || 0;
                  const percentage =
                    totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0;
                  const rankColor =
                    idx === 0 && clicks > 0
                      ? "bg-[#ec48bd] text-white shadow-md shadow-[#ec48bd]/30"
                      : idx === 1 && clicks > 0
                      ? "bg-[#5865f2] text-white"
                      : idx === 2 && clicks > 0
                      ? "bg-[#35ed7e] text-[#0a0d3a]"
                      : "bg-white/10 text-white/60";

                  return (
                    <div
                      key={link.id}
                      className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-2 group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Rank + Icon + Title + URL */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span
                            className={`w-5 h-5 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${rankColor}`}
                          >
                            {idx + 1}
                          </span>

                          {link.icon && (
                            <span className="text-base shrink-0 p-1 rounded-lg bg-white/5 border border-white/10">
                              {link.icon}
                            </span>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-white/95 truncate">
                                {link.title}
                              </span>
                              {idx === 0 && clicks > 0 && (
                                <Badge className="bg-[#ec48bd]/20 text-[#ec48bd] border-0 text-[9px] px-1 py-0 font-extrabold uppercase shrink-0">
                                  Top 1
                                </Badge>
                              )}
                            </div>
                            {link.url && (
                              <p className="text-[11px] text-white/40 truncate font-mono">
                                {link.url}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Clicks & External Link */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="text-sm font-black text-[#35ed7e] font-mono">
                              {clicks.toLocaleString()}
                              <span className="text-[10px] text-white/40 font-normal ml-0.5">
                                회
                              </span>
                            </span>
                            <span className="text-[10px] text-white/40 font-mono block">
                              {percentage}%
                            </span>
                          </div>

                          {link.url && (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-colors"
                              title="새 탭에서 링크 열기"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Percentage Bar */}
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(percentage, clicks > 0 ? 3 : 0)}%`,
                            backgroundColor: PALETTE[idx % PALETTE.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-6 pb-4 text-center">
          <Separator className="bg-white/10 mb-4" />
          <p className="text-[11px] text-white/40">
            마이링크 (MyLink) 통계 분석 센터 &bull; 실시간 Firestore 집계
          </p>
        </footer>
      </main>
    </div>
  );
}

