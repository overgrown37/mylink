"use client";

import React from "react";
import Image from "next/image";
import type { NavTab } from "./DualNavBar";

interface HeroPanelProps {
  currentTab: NavTab;
}

interface HeroConfig {
  bgColor: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
  ctaText: string;
}

const heroConfigs: Record<NavTab, HeroConfig> = {
  home: {
    bgColor: "bg-[#acace7]",
    badge: "NOW AVAILABLE • WORLDWIDE",
    title: "SUPER MARIO ADVANCE",
    tagline: "The King of Platformers Returns on Game Boy Advance!",
    description: "Experience the vibrant colors, enhanced sound, and portable action of the classic adventure reimagined.",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    ctaText: "EXPLORE THE ADVENTURE",
  },
  games: {
    bgColor: "bg-[#a7282b]",
    badge: "HOTTEST RELEASES • 2001",
    title: "SUPER SMASH BROS. MELEE",
    tagline: "The Ultimate All-Star Brawl Hits Nintendo GameCube!",
    description: "Fast-paced combat, legendary Nintendo characters, and endless multiplayer excitement.",
    imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80",
    ctaText: "VIEW ALL TITLES",
  },
  systems: {
    bgColor: "bg-[#206479]",
    badge: "NEXT GENERATION HARDWARE",
    title: "NINTENDO GAMECUBE",
    tagline: "Power, Elegance, and Pure Gaming Innovation.",
    description: "128-bit architecture packed into a compact optical-disc console built strictly for games.",
    imageUrl: "https://images.unsplash.com/photo-1592840496073-e53bb8f17eb2?w=800&auto=format&fit=crop&q=80",
    ctaText: "SEE THE SPECS",
  },
  news: {
    bgColor: "bg-[#c0d5e6]",
    badge: "OFFICIAL PRESS DESK",
    title: "E3 2001 HEADLINES",
    tagline: "Shigeru Miyamoto Unveils the Future of Interactive Play.",
    description: "Exclusive announcements, hardware release dates, and developer interviews direct from Los Angeles.",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
    ctaText: "READ PRESS RELEASES",
  },
  nsider: {
    bgColor: "bg-[#acace7]",
    badge: "COMMUNITY CLUB",
    title: "N-SIDER VIP LOUNGE",
    tagline: "Connect with Players Across the Globe.",
    description: "Player profiles, message boards, insider game tips, and monthly sweepstakes.",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    ctaText: "JOIN THE CLUB",
  },
  downloads: {
    bgColor: "bg-[#c0d5e6]",
    badge: "EXCLUSIVE MEDIA",
    title: "WALLPAPERS & SCREENSAVERS",
    tagline: "Customize Your Desktop with Official Game Art.",
    description: "High-resolution desktop backgrounds, original MP3 audio tracks, and printable calendar sheets.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    ctaText: "DOWNLOAD ASSETS",
  },
};

export default function HeroPanel({ currentTab }: HeroPanelProps) {
  const config = heroConfigs[currentTab] || heroConfigs.home;

  return (
    <div className={`w-full relative ${config.bgColor} plate-bevel overflow-hidden p-3 sm:p-5 select-none transition-colors duration-300`}>
      {/* Background Photography Blend */}
      <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none">
        <Image
          src={config.imageUrl}
          alt={config.title}
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 flex flex-col items-start max-w-lg">
        {/* Signal Orange / Amber Platform Chip */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="chip-bevel bg-[#f68d1f] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 shadow-sm">
            {config.badge}
          </span>
          <span className="text-[10px] font-bold text-[#21242e] uppercase tracking-wider bg-white/70 px-1.5 py-0.5 border border-[#3d4f97]">
            RATING: E
          </span>
        </div>

        {/* Box-Art Display Wordmark */}
        <h2 className="boxart-wordmark text-2xl sm:text-4xl tracking-tight leading-none mb-1.5">
          {config.title}
        </h2>

        {/* Hero Tagline */}
        <p className="text-sm sm:text-base font-bold text-[#21242e] leading-snug drop-shadow-[0_1px_0_rgba(255,255,255,0.7)] mb-1">
          {config.tagline}
        </p>

        {/* Descriptive Body */}
        <p className="text-[11px] sm:text-[12px] text-[#21242e] font-medium leading-relaxed max-w-md bg-white/60 p-2 border border-[#3d4f97] mb-3">
          {config.description}
        </p>

        {/* Action Button: Signal Orange Forward with Circle Arrow */}
        <button
          type="button"
          className="group chip-bevel bg-[#f68d1f] hover:bg-[#e48600] active:translate-y-[1px] text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 flex items-center gap-2.5 shadow-md cursor-pointer"
        >
          <span>{config.ctaText}</span>
          {/* 22px Round Forward Arrow Disc */}
          <span className="w-5 h-5 rounded-full bg-white text-[#f68d1f] flex items-center justify-center font-bold text-xs group-hover:translate-x-0.5 transition-transform">
            ▶
          </span>
        </button>
      </div>

      {/* Subtle Corner Cutout / Machined Bevel Accents */}
      <div className="absolute top-1 right-2 text-[9px] font-mono font-bold text-[#21242e]/60">
        MOD-GBA-001 // SPEC.2001
      </div>
    </div>
  );
}
