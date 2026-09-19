"use client";

import React, { useState } from "react";

interface MastheadProps {
  onSearch?: (query: string) => void;
}

export default function Masthead({ onSearch }: MastheadProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <div className="w-full flex items-end justify-between px-2 pt-2 pb-1.5 select-none">
      {/* Mario Mascot & Speech Bubble */}
      <div className="flex items-center gap-2.5">
        {/* Pixel Mario Character Cutout */}
        <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center filter drop-shadow-[2px_2px_0px_#21242e]">
          <svg className="w-11 h-11" viewBox="0 0 16 16" fill="none">
            {/* 8-bit style Mario silhouette/icon */}
            <rect x="5" y="1" width="5" height="1" fill="#e60012" />
            <rect x="4" y="2" width="9" height="1" fill="#e60012" />
            <rect x="4" y="3" width="3" height="1" fill="#8d5524" />
            <rect x="7" y="3" width="2" height="1" fill="#ffdbac" />
            <rect x="9" y="3" width="1" height="1" fill="#21242e" />
            <rect x="10" y="3" width="1" height="1" fill="#ffdbac" />
            <rect x="3" y="4" width="1" height="1" fill="#8d5524" />
            <rect x="4" y="4" width="1" height="1" fill="#ffdbac" />
            <rect x="5" y="4" width="1" height="1" fill="#8d5524" />
            <rect x="6" y="4" width="3" height="1" fill="#ffdbac" />
            <rect x="9" y="4" width="1" height="1" fill="#21242e" />
            <rect x="10" y="4" width="3" height="1" fill="#ffdbac" />
            <rect x="3" y="5" width="1" height="1" fill="#8d5524" />
            <rect x="4" y="5" width="1" height="1" fill="#ffdbac" />
            <rect x="5" y="5" width="2" height="1" fill="#8d5524" />
            <rect x="7" y="5" width="3" height="1" fill="#ffdbac" />
            <rect x="10" y="5" width="1" height="1" fill="#21242e" />
            <rect x="11" y="5" width="3" height="1" fill="#ffdbac" />
            <rect x="4" y="6" width="1" height="1" fill="#8d5524" />
            <rect x="5" y="6" width="6" height="1" fill="#ffdbac" />
            <rect x="4" y="7" width="8" height="1" fill="#ffdbac" />
            <rect x="3" y="8" width="2" height="1" fill="#e60012" />
            <rect x="5" y="8" width="1" height="1" fill="#3d4f97" />
            <rect x="6" y="8" width="3" height="1" fill="#e60012" />
            <rect x="9" y="8" width="1" height="1" fill="#3d4f97" />
            <rect x="10" y="8" width="2" height="1" fill="#e60012" />
            <rect x="2" y="9" width="3" height="1" fill="#e60012" />
            <rect x="5" y="9" width="1" height="1" fill="#3d4f97" />
            <rect x="6" y="9" width="3" height="1" fill="#e60012" />
            <rect x="9" y="9" width="1" height="1" fill="#3d4f97" />
            <rect x="10" y="9" width="3" height="1" fill="#e60012" />
            <rect x="2" y="10" width="11" height="1" fill="#3d4f97" />
            <rect x="3" y="11" width="9" height="1" fill="#3d4f97" />
            <rect x="3" y="12" width="3" height="1" fill="#8d5524" />
            <rect x="9" y="12" width="3" height="1" fill="#8d5524" />
            <rect x="2" y="13" width="4" height="1" fill="#8d5524" />
            <rect x="9" y="13" width="4" height="1" fill="#8d5524" />
          </svg>
        </div>

        {/* Mascot Speech Bubble with Tail */}
        <div className="relative bg-white border border-[#3d4f97] rounded-xl px-3 py-1 shadow-[2px_2px_0px_#21242e] flex items-center">
          <span className="text-[11px] font-bold text-[#21242e] tracking-tight whitespace-nowrap">
            Welcome to Nintendo.com!
          </span>
          {/* Bubble Left Tail */}
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-6 border-r-white" />
        </div>
      </div>

      {/* Search Module */}
      <form onSubmit={handleSearch} className="flex items-center gap-1.5 text-[11px]">
        <label htmlFor="nintendo-search" className="chrome-label text-[#21242e] hidden sm:inline">
          SEARCH:
        </label>
        
        <div className="flex items-center inset-bevel bg-white">
          <input
            id="nintendo-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Games, Systems..."
            className="w-24 sm:w-36 px-1.5 py-0.5 text-[11px] text-[#21242e] outline-none bg-transparent"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="plate-bevel bg-white px-1 py-0.5 text-[10px] font-bold text-[#21242e] outline-none cursor-pointer"
        >
          <option value="All">All</option>
          <option value="Games">Games</option>
          <option value="Systems">Systems</option>
          <option value="News">News</option>
        </select>

        {/* Amber Go Button Chip */}
        <button
          type="submit"
          className="chip-bevel bg-[#ecab37] hover:bg-[#e48600] active:translate-y-[1px] px-2.5 py-0.5 text-[10px] font-bold text-[#21242e] uppercase tracking-wide cursor-pointer shadow-sm"
        >
          GO
        </button>
      </form>
    </div>
  );
}
