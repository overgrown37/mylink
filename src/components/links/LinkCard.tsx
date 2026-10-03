"use client";

import React from "react";
import { LinkItem } from "@/types/profile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Sparkles } from "lucide-react";

interface LinkCardProps {
  item: LinkItem;
}

export function LinkCard({ item }: LinkCardProps) {
  const isFeatured = item.isFeatured;

  return (
    <a
      href={item.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={`link-card-${item.id}`}
      className="group block w-full outline-none focus-visible:ring-2 focus-visible:ring-[#5865f2] rounded-2xl transition-transform active:scale-[0.98]"
    >
      <Card
        className={`relative overflow-hidden p-4 rounded-2xl transition-all duration-300 border ${
          isFeatured
            ? "bg-[#1e2353]/80 border-[#5865f2] shadow-[0_8px_32px_rgba(88,101,242,0.25)] hover:shadow-[0_12px_40px_rgba(88,101,242,0.4)] hover:border-[#35ed7e]"
            : "bg-[#1e2353]/35 border-[#1e2353]/80 hover:bg-[#1e2353]/70 hover:border-[#5865f2]/50 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
        }`}
      >
        {/* Subtle decorative glow for featured card */}
        {isFeatured && (
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-[#5865f2]/20 rounded-full blur-xl pointer-events-none" />
        )}

        <div className="flex items-center justify-between gap-3.5 relative z-10">
          {/* Left: Icon or Emoji */}
          <div className="flex items-center gap-3 min-w-0">
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
                  <Badge
                    variant={isFeatured ? "default" : "secondary"}
                    className={`text-[10px] px-1.5 py-0 h-4 font-bold uppercase tracking-wider rounded-md border ${
                      item.badge === "HOT" || item.badge === "NEW"
                        ? "bg-[#ec48bd] text-white border-transparent"
                        : isFeatured
                        ? "bg-[#5865f2] text-white border-transparent"
                        : "bg-white/10 text-white/90 border-white/10"
                    }`}
                  >
                    {isFeatured && <Sparkles className="w-2.5 h-2.5 mr-0.5 inline" />}
                    {item.badge}
                  </Badge>
                )}
              </div>

              {item.subtitle && (
                <p className="text-xs text-white/60 line-clamp-1 mt-0.5 group-hover:text-white/80 transition-colors">
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right: External Link Arrow */}
          <div className="flex-shrink-0 text-white/40 group-hover:text-[#35ed7e] group-hover:translate-x-0.5 transition-all">
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </Card>
    </a>
  );
}

export default LinkCard;
