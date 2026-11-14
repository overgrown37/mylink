"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LinkItem } from "@/types/profile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MousePointerClick,
  TrendingUp,
  Award,
  ChevronDown,
  BarChart3,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface LinkStatsSectionProps {
  links: LinkItem[];
}

export function LinkStatsSection({ links }: LinkStatsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  // 일반 링크만 필터링 (헤더 제외)
  const validLinks = links.filter((l) => l.type === "link");

  // 총 전체 링크 클릭 수
  const totalClicks = validLinks.reduce((sum, l) => sum + (l.clicks || 0), 0);

  // 클릭 수 기준 내림차순 정렬
  const sortedLinks = [...validLinks].sort(
    (a, b) => (b.clicks || 0) - (a.clicks || 0)
  );

  // 가장 인기 있는 링크
  const topLink = sortedLinks.length > 0 && (sortedLinks[0].clicks || 0) > 0 ? sortedLinks[0] : null;

  return (
    <Card className="rounded-2xl bg-[#12163a]/90 border border-[#5865f2]/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 cursor-pointer select-none hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-[#5865f2]/20 border border-[#5865f2]/40 text-[#5865f2]">
            <BarChart3 className="w-4 h-4 text-[#35ed7e]" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                링크 클릭 통계
              </h3>
              <Badge className="bg-[#35ed7e]/15 text-[#35ed7e] border border-[#35ed7e]/30 text-[10px] px-1.5 py-0">
                실시간 동기화
              </Badge>
            </div>
            <p className="text-[11px] text-white/50">
              방문자들의 링크 클릭 반응을 실시간으로 분석합니다
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon-xs"
          className="text-white/50 hover:text-white rounded-lg"
          title={isOpen ? "통계 접기" : "통계 펼치기"}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-3.5 border-t border-white/5 animate-in fade-in duration-200">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* 1. 총 전체 클릭 수 */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-white/50 flex items-center gap-1">
                <MousePointerClick className="w-3 h-3 text-[#35ed7e]" />
                총 클릭 수
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-[#35ed7e] tracking-tight">
                  {totalClicks.toLocaleString()}
                </span>
                <span className="text-[11px] text-white/40">회</span>
              </div>
            </div>

            {/* 2. 등록된 링크 수 */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-white/50 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#5865f2]" />
                활성 링크 수
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {validLinks.length}
                </span>
                <span className="text-[11px] text-white/40">개</span>
              </div>
            </div>

            {/* 3. 최고 인기 링크 */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 col-span-2 sm:col-span-1 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-white/50 flex items-center gap-1">
                <Award className="w-3 h-3 text-[#ec48bd]" />
                최고 인기 링크
              </span>
              <div className="mt-1">
                {topLink ? (
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate" title={topLink.title}>
                      {topLink.title}
                    </p>
                    <span className="text-[10px] text-[#ec48bd] font-semibold">
                      {(topLink.clicks || 0).toLocaleString()}회 클릭
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-white/40 font-medium">아직 클릭 없음</span>
                )}
              </div>
            </div>
          </div>

          {/* 링크별 클릭 수 상세 랭킹 리스트 */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-white/60 px-1 font-semibold">
              <span>링크별 클릭 상세</span>
              <span className="text-[11px] text-white/40">점유율</span>
            </div>

            {validLinks.length === 0 ? (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-white/40">
                등록된 링크가 없습니다.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 selection:bg-[#5865f2]">
                {sortedLinks.map((link, idx) => {
                  const clicks = link.clicks || 0;
                  const percentage =
                    totalClicks > 0
                      ? Math.round((clicks / totalClicks) * 100)
                      : 0;

                  return (
                    <div
                      key={link.id}
                      className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        {/* Rank + Icon + Title */}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              idx === 0 && clicks > 0
                                ? "bg-[#ec48bd] text-white"
                                : idx === 1 && clicks > 0
                                ? "bg-[#5865f2] text-white"
                                : "bg-white/10 text-white/60"
                            }`}
                          >
                            {idx + 1}
                          </span>
                          {link.icon && (
                            <span className="text-xs shrink-0">{link.icon}</span>
                          )}
                          <span
                            className="text-xs font-semibold text-white/90 truncate"
                            title={link.title}
                          >
                            {link.title}
                          </span>
                        </div>

                        {/* Clicks Badge & Percentage */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold text-[#35ed7e] font-mono">
                            {clicks.toLocaleString()}
                            <span className="text-[10px] text-white/40 font-normal ml-0.5">
                              회
                            </span>
                          </span>
                          <span className="text-[10px] font-mono text-white/40 w-8 text-right">
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      {/* Percentage Progress Bar */}
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#5865f2] via-[#35ed7e] to-[#ec48bd] transition-all duration-500"
                          style={{ width: `${Math.max(percentage, clicks > 0 ? 3 : 0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detailed /stat Chart Navigation CTA */}
          <div className="pt-1">
            <Link
              href="/stat"
              className="flex items-center justify-between w-full p-2.5 rounded-xl bg-[#5865f2]/10 hover:bg-[#5865f2]/20 border border-[#5865f2]/30 hover:border-[#5865f2] text-white text-xs font-semibold transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-[#35ed7e]" />
                <span>상세 통계 대시보드 & 차트 보기</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#5865f2] group-hover:text-[#35ed7e] transition-colors">
                <span>/stat 바로가기</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}

export default LinkStatsSection;

