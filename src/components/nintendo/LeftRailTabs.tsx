"use client";

import React from "react";

interface LeftRailTabsProps {
  onSelectRail?: (tabName: string) => void;
}

export default function LeftRailTabs({ onSelectRail }: LeftRailTabsProps) {
  const railTabs = [
    "TOP TEN",
    "TOP RENTALS",
    "PLAYER'S CHOICE",
    "ESRB RATINGS",
  ];

  return (
    <div className="hidden lg:flex flex-col gap-2 -mr-1 z-0 select-none py-4">
      {railTabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelectRail && onSelectRail(tab)}
          type="button"
          className="carbon-halftone plate-bevel border-r-0 rounded-l-md px-1 py-3 text-[#9fbee7] hover:text-white hover:bg-[#2d3240] transition-colors cursor-pointer shadow-sm group"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          <span className="chrome-label text-[9px] tracking-[1px] rotate-180 block whitespace-nowrap group-hover:scale-105 transition-transform">
            {tab}
          </span>
        </button>
      ))}
    </div>
  );
}
