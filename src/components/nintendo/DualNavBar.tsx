"use client";

import React from "react";

export type NavTab = "home" | "games" | "systems" | "news" | "nsider" | "downloads";

interface DualNavBarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export default function DualNavBar({ currentTab, onSelectTab }: DualNavBarProps) {
  const primaryTabs: { id: NavTab; label: string }[] = [
    { id: "games", label: "GAMES" },
    { id: "systems", label: "SYSTEMS" },
    { id: "news", label: "NEWS" },
    { id: "nsider", label: "NSIDER" },
    { id: "downloads", label: "DOWNLOADS" },
  ];

  const secondaryLinks = [
    "Parents",
    "Customer Service",
    "Corporate",
    "Global",
    "Privacy",
    "Store",
    "Contact",
  ];

  return (
    <div className="w-full flex flex-col select-none">
      {/* Primary Top Nav Bar: Carbon Slab with Halftone Texture */}
      <div className="carbon-halftone w-full h-9 px-3 flex items-center justify-between border-b-2 border-[#3d4f97] plate-bevel">
        {/* Left: Nintendo Racetrack Logo Pill */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelectTab("home")}
            type="button"
            className="flex items-center bg-white rounded-full px-3 py-0.5 border-2 border-white shadow-[1px_1px_0px_#000] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Nintendo Home"
          >
            <span className="text-[#e60012] font-black text-xs tracking-tighter uppercase font-sans">
              Nintendo
            </span>
            <span className="text-[#e60012] font-bold text-[8px] ml-0.5 relative -top-1">
              ®
            </span>
          </button>

          {/* 5 Primary Navigation Words in Nav Gold */}
          <nav className="hidden sm:flex items-center gap-5">
            {primaryTabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  type="button"
                  className={`chrome-label text-[12px] tracking-[0.5px] transition-colors cursor-pointer relative py-1 ${
                    isActive
                      ? "text-white font-black underline underline-offset-4 decoration-[#f68d1f] decoration-2"
                      : "text-[#e48600] hover:text-[#ffba42]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Amber Utility Chips */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="chip-bevel bg-[#ecab37] hover:bg-[#e48600] active:translate-y-[1px] px-2 py-0.5 text-[10px] font-bold text-[#21242e] uppercase tracking-wide cursor-pointer"
          >
            CODE BANK
          </button>
          <button
            type="button"
            className="chip-bevel bg-[#ecab37] hover:bg-[#e48600] active:translate-y-[1px] px-2 py-0.5 text-[10px] font-bold text-[#21242e] uppercase tracking-wide cursor-pointer"
          >
            GAME FINDER
          </button>
        </div>
      </div>

      {/* Mobile nav row if screen is narrow */}
      <div className="sm:hidden carbon-halftone flex items-center justify-around py-1 border-b border-[#3d4f97]">
        {primaryTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            type="button"
            className={`chrome-label text-[10px] px-1.5 py-0.5 ${
              currentTab === tab.id
                ? "text-white font-black underline decoration-[#f68d1f]"
                : "text-[#e48600]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Secondary Pale-Sky Subnav Strip */}
      <div className="w-full bg-[#9fbee7] border-b border-[#3d4f97] px-3 py-1 flex items-center justify-between text-[10px] overflow-x-auto no-scrollbar plate-bevel">
        <div className="flex items-center gap-2 whitespace-nowrap">
          {secondaryLinks.map((link, idx) => (
            <React.Fragment key={link}>
              <a
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="chrome-label text-[#21242e] hover:text-[#3d4f97] hover:underline font-bold"
              >
                {link}
              </a>
              {idx < secondaryLinks.length - 1 && (
                <span className="text-[#60619c] font-normal select-none">|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <span className="hidden md:inline-block text-[9px] font-bold text-[#3d4f97] uppercase tracking-wider">
          ★ OFFICIAL NINTENDO NETWORK ★
        </span>
      </div>
    </div>
  );
}
