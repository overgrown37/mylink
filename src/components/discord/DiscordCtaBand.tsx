"use client";

import React from "react";

export default function DiscordCtaBand() {
  return (
    <section id="community" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* 40px Rounded Full-Bleed Blurple CTA Band */}
      <div className="rounded-[40px] bg-[#5865f2] p-10 sm:p-16 text-center flex flex-col items-center justify-center discord-float-shadow relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#ec48bd]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#35ed7e]/20 rounded-full blur-3xl pointer-events-none" />

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white max-w-3xl leading-[1.05] relative z-10">
          YOU CAN&apos;T SCROLL ANY FURTHER. BETTER GET IN TOUCH.
        </h2>

        <p className="mt-5 text-base sm:text-xl font-medium text-white/90 max-w-xl leading-relaxed relative z-10">
          새로운 프로젝트 협업, 기술 멘토링, 커피챗 제안은 언제든지 환영합니다.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 relative z-10">
          <a
            href="mailto:contact@example.com"
            className="bg-[#35ed7e] hover:bg-[#28df6f] text-black font-black text-lg px-9 py-4 rounded-full shadow-xl shadow-[#35ed7e]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Send An Email ✉️
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-zinc-100 text-black font-extrabold text-lg px-8 py-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Visit GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
