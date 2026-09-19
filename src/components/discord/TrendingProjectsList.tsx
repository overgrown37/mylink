"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { LinkItem } from "@/data/profile";

interface TrendingProjectsListProps {
  links: LinkItem[];
}

export default function TrendingProjectsList({ links }: TrendingProjectsListProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredLinks = filter === "all" ? links : links.filter((l) => l.category === filter);

  return (
    <section id="projects" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-sm font-bold uppercase tracking-wider text-[#ec48bd]">
            CURATED DIRECTORY
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight mt-1">
            TRENDING RELEASES & ARTICLES
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#1e2353] border border-[#5865f2]/40 overflow-x-auto no-scrollbar">
          {["all", "projects", "articles", "contact"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              type="button"
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold capitalize transition-all duration-200 whitespace-nowrap cursor-pointer ${
                filter === cat
                  ? "bg-[#5865f2] text-white shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ranked Project List (Discord Trending Games Style) */}
      <div className="space-y-3.5">
        {filteredLinks.map((item, idx) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#1e2353] hover:bg-[#252c6a] border border-[#5865f2]/30 hover:border-[#5865f2] transition-all duration-200 discord-float-shadow"
          >
            {/* Rank Number + Thumbnail + Info */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
              {/* Big Rank Number Badge */}
              <span className="text-2xl sm:text-3xl font-black text-white/30 group-hover:text-[#ec48bd] transition-colors w-8 text-center flex-shrink-0">
                #{idx + 1}
              </span>

              {/* Thumbnail Image (Soft 16px Rounded) */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#0a0d3a] flex-shrink-0 border border-white/10">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="80px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Title, Badge & Description */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-[#00b0f4] transition-colors truncate">
                    {item.title}
                  </h3>
                  {item.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ec48bd] text-[10px] font-black uppercase text-white shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-white/70 mt-1 line-clamp-1">
                  {item.description}
                </p>

                {item.stats && (
                  <span className="text-xs font-semibold text-[#35ed7e] mt-1">
                    {item.stats}
                  </span>
                )}
              </div>
            </div>

            {/* Right Action: Pill Button */}
            <div className="flex items-center gap-3 sm:flex-shrink-0 self-end sm:self-center">
              <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#5865f2] group-hover:bg-[#4752c4] text-white text-xs sm:text-sm font-extrabold shadow-md transition-all">
                <span>View Link</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
