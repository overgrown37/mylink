"use client";

import React from "react";
import Image from "next/image";
import type { LinkItem } from "@/data/profile";

interface FeatureGradientCardProps {
  featuredItem: LinkItem;
}

export default function FeatureGradientCard({ featuredItem }: FeatureGradientCardProps) {
  return (
    <section id="feature" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* 40px Rounded Feature Card with Vibrant Magenta Gradient */}
      <div className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-[#ec48bd] via-[#8b5cf6] to-[#5865f2] p-8 sm:p-14 md:p-16 discord-float-shadow">
        {/* Decorative Floating Mesh Glow Inside */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
          {/* Left Text & Badges */}
          <div className="flex flex-col items-start text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/40 text-white text-xs font-black uppercase tracking-wider backdrop-blur-md mb-4 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#35ed7e]" />
              FEATURED PRODUCT SPOTLIGHT
            </span>

            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-[1.08]">
              {featuredItem.title}
            </h2>

            <p className="mt-4 text-base sm:text-lg font-medium text-white/90 leading-relaxed max-w-lg">
              {featuredItem.description}
            </p>

            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <a
                href={featuredItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-[#f1f1f1] text-black font-black text-base px-8 py-3.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Launch Project 🚀
              </a>

              {featuredItem.stats && (
                <span className="text-sm font-bold text-white bg-black/30 px-4 py-3 rounded-full border border-white/20 backdrop-blur-sm">
                  {featuredItem.stats}
                </span>
              )}
            </div>
          </div>

          {/* Right Product Mockup Frame with 40px or 24px Rounding */}
          <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden bg-[#0a0d3a] border-4 border-white/20 shadow-2xl">
            <Image
              src={featuredItem.imageUrl}
              alt={featuredItem.title}
              fill
              sizes="(max-width: 1024px) 100vw, 540px"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-bold text-white bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl">
              <span>{featuredItem.badge || "AI & Web Tech"}</span>
              <span className="text-[#35ed7e]">● ACTIVE PRODUCTION</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
