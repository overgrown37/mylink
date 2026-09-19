"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { ProfileData } from "@/data/profile";

interface RightActionRailProps {
  profile: ProfileData;
}

export default function RightActionRail({ profile }: RightActionRailProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name} - Nintendo.com 2001`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const railButtons = [
    { label: "MEMBER LOGIN", icon: "🔑", id: "login" },
    { label: "SUBSCRIBE (NINTENDO POWER)", icon: "📖", id: "subscribe" },
    { label: "NSIDER NEWSLETTER", icon: "✉️", id: "newsletter" },
    { label: "TECH SUPPORT & HELP", icon: "❓", id: "help" },
  ];

  return (
    <aside className="w-full flex flex-col gap-3 select-none">
      {/* 4 Carbon Command Action Buttons */}
      <div className="flex flex-col gap-1.5">
        {railButtons.map((btn) => (
          <button
            key={btn.id}
            type="button"
            className="carbon-halftone plate-bevel hover:bg-[#2e3344] active:translate-y-[1px] text-white px-3 py-2 flex items-center justify-between transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs group-hover:scale-110 transition-transform">
                {btn.icon}
              </span>
              <span className="chrome-label text-[11px] text-white tracking-[0.5px]">
                {btn.label}
              </span>
            </div>
            {/* Forward Chevron */}
            <span className="text-[#f68d1f] font-black text-xs group-hover:translate-x-0.5 transition-transform">
              ▶
            </span>
          </button>
        ))}

        {/* Share Profile Button */}
        <button
          onClick={handleShare}
          type="button"
          className="chip-bevel bg-[#ecab37] hover:bg-[#e48600] active:translate-y-[1px] text-[#21242e] px-3 py-2 flex items-center justify-between font-black text-[11px] transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-1.5">
            <span>📡</span>
            <span className="chrome-label tracking-[0.5px]">
              {copied ? "URL COPIED TO CLIPBOARD!" : "SHARE THIS PROFILE"}
            </span>
          </div>
          <span className="text-xs">✦</span>
        </button>
      </div>

      {/* Info-Box: "What Is — MyLink Profile" */}
      <div className="w-full bg-white plate-bevel overflow-hidden">
        {/* Amber Tab Header */}
        <div className="bg-[#ecab37] px-2.5 py-1 border-b border-[#3d4f97] flex items-center justify-between">
          <span className="chrome-label text-[10px] text-[#21242e] font-black tracking-wider">
            WHAT IS — MYLINK
          </span>
          <span className="text-[9px] font-bold text-[#21242e]">ID: 2001</span>
        </div>

        {/* Info Content with User Profile Details */}
        <div className="p-2.5 flex flex-col gap-2 bg-white">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#dedede]">
            {/* User Avatar */}
            <div className="relative w-12 h-12 flex-shrink-0 border-2 border-[#3d4f97] overflow-hidden inset-bevel">
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-bold text-[#21242e] truncate">
                {profile.name}
              </span>
              <span className="text-[10px] font-bold text-[#3d4f97]">
                {profile.handle}
              </span>
              <span className="text-[9px] text-[#21242e] font-semibold bg-[#70FFAF]/40 border border-[#3d4f97] px-1 mt-0.5 inline-block w-fit">
                {profile.status.text}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#21242e] font-normal leading-relaxed">
            {profile.bio}
          </p>

          {/* Social Links Row */}
          <div className="pt-1 flex items-center gap-1.5 flex-wrap">
            {profile.socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="chip-bevel bg-[#dedede] hover:bg-[#9fbee7] text-[#21242e] text-[9px] font-bold uppercase px-1.5 py-0.5 border border-[#3d4f97]"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Side Promo Card: Game Boy Advance */}
      <div className="w-full bg-[#acace7] plate-bevel p-3 relative overflow-hidden flex flex-col items-start">
        <span className="chip-bevel bg-[#f68d1f] text-white text-[9px] font-black uppercase px-1.5 py-0.2 mb-1">
          HOT HARDWARE
        </span>
        <h4 className="boxart-wordmark text-lg leading-tight mb-1">
          GAME BOY ADVANCE
        </h4>
        <p className="text-[10px] font-bold text-[#21242e] leading-snug mb-2">
          32-Bit Handheld Power with 2.9&quot; Reflective TFT Color Screen.
        </p>
        <div className="relative w-full h-24 bg-white/40 border border-[#3d4f97] inset-bevel overflow-hidden mb-2">
          <Image
            src="https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=400&auto=format&fit=crop&q=80"
            alt="Game Boy Advance"
            fill
            sizes="240px"
            className="object-cover"
          />
        </div>
        <a
          href="#gba-specs"
          className="chip-bevel bg-[#21242e] hover:bg-black text-white text-[10px] font-bold uppercase px-2 py-1 flex items-center gap-1.5"
        >
          <span>HARDWARE DETAILS</span>
          <span className="text-[#f68d1f]">▶</span>
        </a>
      </div>
    </aside>
  );
}
