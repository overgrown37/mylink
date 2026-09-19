"use client";

import React, { useState } from "react";
import Masthead from "@/components/nintendo/Masthead";
import DualNavBar, { NavTab } from "@/components/nintendo/DualNavBar";
import LeftRailTabs from "@/components/nintendo/LeftRailTabs";
import HeroPanel from "@/components/nintendo/HeroPanel";
import NewsListPanel from "@/components/nintendo/NewsListPanel";
import FeaturedSitesGrid from "@/components/nintendo/FeaturedSitesGrid";
import PlayersPollPanel from "@/components/nintendo/PlayersPollPanel";
import RightActionRail from "@/components/nintendo/RightActionRail";
import FooterBar from "@/components/nintendo/FooterBar";
import SystemsGrid from "@/components/nintendo/SystemsGrid";
import { profileData } from "@/data/profile";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<NavTab>("home");
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const handleRailTabSelect = (tabName: string) => {
    setActiveMessage(`Selected Rail Module: ${tabName} (Circa 2001 Archive)`);
    setTimeout(() => setActiveMessage(null), 3000);
  };

  return (
    <main className="min-h-screen py-4 sm:py-8 px-2 sm:px-4 flex flex-col items-center justify-start selection:bg-[#f68d1f] selection:text-white">
      {/* Outer Shell Wrapper with Left Rail & Main Console Chassis */}
      <div className="w-full max-w-[830px] flex items-start justify-center relative">
        {/* Left Rail Vertically Rotated Carbon Tabs (Desktop) */}
        <LeftRailTabs onSelectRail={handleRailTabSelect} />

        {/* Main Machine Faceplate Chassis (Brushed Periwinkle #7a8aba with Chamfered Corners) */}
        <div className="w-full bg-[#7a8aba] plate-bevel shadow-[0_12px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative z-10 border-2 border-[#3d4f97]">
          {/* Top Edge Highlight Accent */}
          <div className="w-full h-1 bg-gradient-to-r from-white/70 via-white/30 to-transparent" />

          {/* Active Notification Banner if any */}
          {activeMessage && (
            <div className="bg-[#f68d1f] text-white px-3 py-1 text-xs font-black text-center border-b border-[#3d4f97] animate-pulse">
              ⚡ {activeMessage}
            </div>
          )}

          {/* 1. Masthead: Mario Mascot Speech Bubble + Search Bar */}
          <Masthead />

          {/* 2. Dual Nav Bars: Carbon Primary Bar + Pale Sky Secondary Strip */}
          <DualNavBar currentTab={currentTab} onSelectTab={setCurrentTab} />

          {/* 3. Main Body Container */}
          <div className="p-2 sm:p-3 flex flex-col gap-3">
            {/* Hero Panel (Page-Specific Accent Tint) */}
            <HeroPanel currentTab={currentTab} />

            {/* Dense 2-Column Grid: 2/3 Content Column + 1/3 Right Rail */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
              {/* Left 2/3 Content Area */}
              <div className="lg:col-span-2 flex flex-col gap-3">
                {currentTab === "systems" ? (
                  <SystemsGrid />
                ) : (
                  <>
                    {/* Official News & User Project Links */}
                    <NewsListPanel userLinks={profileData.links} />

                    {/* 2x2 Featured Sites Grid */}
                    <FeaturedSitesGrid />

                    {/* Interactive Player's Poll */}
                    <PlayersPollPanel />
                  </>
                )}
              </div>

              {/* Right 1/3 Action Rail */}
              <div className="lg:col-span-1">
                <RightActionRail profile={profileData} />
              </div>
            </div>

            {/* 4. Footer Bar: Carbon Halftone Slab + ESRB Mark */}
            <FooterBar />
          </div>
        </div>
      </div>
    </main>
  );
}
