"use client";

import React from "react";
import Image from "next/image";
import type { ProfileData } from "@/data/profile";

interface DiscordHeroProps {
  profile: ProfileData;
}

export default function DiscordHero({ profile }: DiscordHeroProps) {
  return (
    <section id="hero" className="relative w-full overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Animated Blurple-to-Magenta Gradient Mesh in Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="animate-mesh-1 absolute -top-40 left-1/4 w-[600px] sm:w-[850px] h-[500px] bg-gradient-to-tr from-[#5865f2]/40 via-[#8b5cf6]/30 to-[#ec48bd]/30 rounded-full blur-[120px]" />
        <div className="animate-mesh-2 absolute top-1/3 -right-20 w-[450px] sm:w-[650px] h-[450px] bg-gradient-to-bl from-[#ec48bd]/35 via-[#5865f2]/25 to-[#00b0f4]/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[350px] bg-[#5865f2]/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e2353]/80 border border-[#5865f2]/40 text-xs sm:text-sm font-bold text-white mb-6 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-[#35ed7e] animate-ping" />
          <span className="text-[#35ed7e]">ONLINE</span>
          <span>•</span>
          <span className="text-white/90">{profile.tagline}</span>
        </div>

        {/* Heavy All-Caps Display Headline (ABC Ginto Nord 800 Voice) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white max-w-4xl leading-[1.05] drop-shadow-md">
          IMAGINE A PLACE WHERE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5865f2] via-[#ec48bd] to-[#00b0f4]">IDEAS</span> COME ALIVE
        </h1>

        {/* Lead Paragraph */}
        <p className="mt-6 text-lg sm:text-xl font-medium text-white/80 max-w-2xl leading-relaxed">
          {profile.bio}
        </p>

        {/* CTA Pair: Electric Green + Blurple/Ghost */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Electric Green High-Intent CTA */}
          <a
            href="mailto:contact@example.com"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#35ed7e] hover:bg-[#2fe075] text-black font-black text-base sm:text-lg px-8 py-4 rounded-full shadow-xl shadow-[#35ed7e]/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>☕ 커피챗 & 프로젝트 제안하기</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          {/* Secondary Ghost Button */}
          <a
            href="#projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1e2353]/90 hover:bg-[#2d3477] border border-[#5865f2]/50 text-white font-bold text-base sm:text-lg px-8 py-4 rounded-full backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span>프로젝트 둘러보기</span>
          </a>
        </div>

        {/* Hero Media Block with Swooping 88px Bottom Radius */}
        <div className="mt-14 w-full max-w-4xl relative">
          <div className="discord-float-shadow rounded-t-[32px] rounded-b-[64px] sm:rounded-b-[88px] overflow-hidden bg-[#1e2353] border border-[#5865f2]/40 relative">
            {/* Top Chrome Window Bar */}
            <div className="h-10 bg-[#0a0d3a]/80 px-4 flex items-center justify-between border-b border-[#5865f2]/20">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ec48bd]" />
                <span className="w-3 h-3 rounded-full bg-[#f68d1f]" />
                <span className="w-3 h-3 rounded-full bg-[#35ed7e]" />
              </div>
              <span className="text-[12px] font-mono font-bold text-white/60">
                # mooseong-general-channel
              </span>
              <div className="w-12" />
            </div>

            {/* Profile Showcase Card Inside Hero Frame */}
            <div className="p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-b from-[#1e2353] to-[#0a0d3a]">
              {/* Left Profile Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                {/* Big Round Avatar with Active Badge */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#5865f2] shadow-2xl relative">
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.name}
                      fill
                      priority
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>
                  {/* Discord Online Status Dot */}
                  <span className="absolute bottom-1 right-1 w-6 h-6 bg-[#35ed7e] border-4 border-[#1e2353] rounded-full flex items-center justify-center shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </span>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      {profile.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#5865f2] text-[10px] font-black uppercase text-white">
                      CREATOR
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[#00b0f4] mt-0.5">
                    {profile.handle}
                  </span>
                  <p className="text-sm text-white/70 mt-2 max-w-sm">
                    {profile.status.text}
                  </p>

                  {/* Quick Social Buttons Bar */}
                  <div className="flex items-center gap-2 mt-4 justify-center sm:justify-start flex-wrap">
                    {profile.socials.map((s) => (
                      <a
                        key={s.platform}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#0a0d3a] hover:bg-[#5865f2] text-xs font-bold text-white border border-[#5865f2]/30 transition-colors"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Hero Stats Pill */}
              <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
                {profile.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#0a0d3a]/60 border border-[#5865f2]/30"
                  >
                    <span className="text-xs font-bold text-white/70">
                      {stat.label}
                    </span>
                    <span className="text-base font-black text-[#35ed7e]">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
