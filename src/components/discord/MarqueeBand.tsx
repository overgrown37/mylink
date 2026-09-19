"use client";

import React from "react";

export default function MarqueeBand() {
  const words = [
    "DEVELOP",
    "✦",
    "VIBE CODE",
    "✦",
    "CHAT & CONNECT",
    "✦",
    "BUILD TOGETHER",
    "✦",
    "SHIP IT",
    "✦",
    "PLAY & CREATE",
    "✦",
  ];

  return (
    <div className="w-full bg-[#5865f2] py-5 overflow-hidden select-none border-y border-[#1e2353] shadow-lg shadow-[#5865f2]/20">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-2xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
        {/* Render twice for continuous loop */}
        {[...words, ...words].map((word, i) => (
          <span
            key={i}
            className={word === "✦" ? "text-[#35ed7e] text-xl sm:text-2xl" : "hover:text-[#35ed7e] transition-colors"}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
