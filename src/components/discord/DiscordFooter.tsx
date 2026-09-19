"use client";

import React from "react";
import type { ProfileData } from "@/data/profile";

interface DiscordFooterProps {
  profile: ProfileData;
}

export default function DiscordFooter({ profile }: DiscordFooterProps) {
  return (
    <footer className="w-full bg-[#0a0d3a] border-t border-[#1e2353] pt-16 pb-12 text-white select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        {/* Multi-Column Links Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-16 border-b border-[#1e2353]">
          {/* Col 1 */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-black uppercase text-[#5865f2] tracking-wider">
              Profile
            </span>
            <a href="#hero" className="text-sm text-white/80 hover:text-white hover:underline">
              About Me
            </a>
            <a href="#feature" className="text-sm text-white/80 hover:text-white hover:underline">
              Featured Work
            </a>
            <a href="#projects" className="text-sm text-white/80 hover:text-white hover:underline">
              Projects
            </a>
            <span className="text-xs text-white/40">{profile.location}</span>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-black uppercase text-[#5865f2] tracking-wider">
              Socials
            </span>
            {profile.socials.slice(0, 4).map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/80 hover:text-white hover:underline"
              >
                {s.label}
              </a>
            ))}
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-black uppercase text-[#5865f2] tracking-wider">
              Community
            </span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-white hover:underline">
              GitHub Repos
            </a>
            <a href="https://velog.io" target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-white hover:underline">
              Tech Blog
            </a>
            <a href="mailto:contact@example.com" className="text-sm text-white/80 hover:text-white hover:underline">
              Coffee Chat
            </a>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-black uppercase text-[#5865f2] tracking-wider">
              System
            </span>
            <span className="text-sm text-white/80">Next.js 16 + React 19</span>
            <span className="text-sm text-white/80">Tailwind CSS</span>
            <span className="text-sm text-[#35ed7e]">● All Systems Normal</span>
          </div>
        </div>

        {/* Giant All-Caps Wordmark (Signature Discord Footer) */}
        <div className="pt-12 pb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white/15 select-none hover:text-white/25 transition-colors">
            MYLINK
          </div>

          <div className="flex items-center gap-3">
            <a
              href="mailto:contact@example.com"
              className="px-6 py-2.5 rounded-full bg-[#5865f2] hover:bg-[#4752c4] text-white font-extrabold text-sm shadow-md transition-all"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Bottom Legal / Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50 pt-4 border-t border-[#1e2353]/50">
          <span>© {new Date().getFullYear()} {profile.name}. Inspired by Discord Marketing Design System.</span>
          <span>Designed with Vibe Coding</span>
        </div>
      </div>
    </footer>
  );
}
