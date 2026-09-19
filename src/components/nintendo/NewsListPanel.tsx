"use client";

import React from "react";
import type { LinkItem } from "@/data/profile";

interface NewsListPanelProps {
  userLinks: LinkItem[];
}

export default function NewsListPanel({ userLinks }: NewsListPanelProps) {
  // Merge user links with classic Nintendo 2001 headlines
  const newsItems = [
    {
      id: "official-1",
      category: "PRESS",
      title: "Nintendo GameCube Release Date and Launch Lineup Confirmed",
      date: "09.06.01",
      isOfficial: true,
      url: "https://www.nintendo.com",
    },
    {
      id: "official-2",
      category: "SPECIAL",
      title: "Game Boy Advance Sells Over 5 Million Units in First 90 Days",
      date: "08.28.01",
      isOfficial: true,
      url: "https://www.nintendo.com",
    },
    ...userLinks.map((link) => ({
      id: link.id,
      category: link.category.toUpperCase(),
      title: link.title,
      date: "FEATURED",
      isOfficial: false,
      url: link.url,
      description: link.description,
    })),
  ];

  return (
    <div className="w-full flex flex-col plate-bevel bg-[#dedede] overflow-hidden select-none">
      {/* Section Label Bar: Periwinkle Canvas with ≡ Glyph */}
      <div className="bg-[#7a8aba] text-[#21242e] px-2.5 py-1 flex items-center justify-between border-b border-[#3d4f97] plate-bevel">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs text-[#21242e]">≡</span>
          <span className="chrome-label text-[11px] text-[#21242e]">
            OFFICIAL NEWS & FEATURED PROJECTS
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#3d4f97]">
          ARCHIVE // 2001
        </span>
      </div>

      {/* News Rows List */}
      <div className="p-2 space-y-1.5 bg-[#dedede]">
        {newsItems.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-2 p-1.5 bg-white hover:bg-[#fffcee] inset-bevel transition-colors duration-150 cursor-pointer"
          >
            {/* Category Stamp & Title */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span
                className={`text-[9px] font-black uppercase px-1.5 py-0.2 border ${
                  item.isOfficial
                    ? "bg-[#21242e] text-white border-[#21242e]"
                    : "bg-[#ecab37] text-[#21242e] border-[#3d4f97]"
                }`}
              >
                {item.category}
              </span>

              <span className="text-[12px] font-bold text-[#3d4f97] group-hover:text-[#e60012] group-hover:underline truncate leading-none">
                {item.title}
              </span>
            </div>

            {/* Date and Forward Chevron Chip */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="hidden sm:inline text-[10px] font-bold text-[#60619c]">
                {item.date}
              </span>
              {/* 18px Signal Orange Chevron Chip */}
              <span className="w-4 h-4 rounded-[2px] bg-[#f68d1f] group-hover:bg-[#e48600] text-white flex items-center justify-center text-[9px] font-black group-hover:translate-x-0.5 transition-transform chip-bevel">
                ▶
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
