"use client";

import React from "react";
import type { ProfileData } from "@/data/profile";

interface StatCardsGridProps {
  profile: ProfileData;
}

export default function StatCardsGrid({ profile }: StatCardsGridProps) {
  const cards = [
    {
      value: profile.stats[0]?.value || "14+",
      label: "TOTAL RELEASES",
      sub: "Active side projects & web applications",
      bgColor: "bg-[#5865f2]",
    },
    {
      value: profile.stats[1]?.value || "38편",
      label: "WRITTEN ARTICLES",
      sub: "Tech insights and dev tutorials",
      bgColor: "bg-[#ec48bd]",
    },
    {
      value: profile.stats[2]?.value || "1.2k",
      label: "COMMUNITY STARS",
      sub: "Open source contributions",
      bgColor: "bg-[#1e2353]",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 select-none">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`rounded-[32px] sm:rounded-[40px] p-8 sm:p-10 flex flex-col justify-between ${card.bgColor} text-white discord-float-shadow relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}
          >
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-white/70 mb-2">
                {card.label}
              </span>
              <span className="text-5xl sm:text-6xl font-black tracking-tight leading-none text-white">
                {card.value}
              </span>
            </div>

            <p className="mt-6 text-sm sm:text-base font-medium text-white/80">
              {card.sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
