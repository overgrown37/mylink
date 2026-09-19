"use client";

import React from "react";
import Image from "next/image";

export default function SystemsGrid() {
  const systems = [
    {
      id: "gamecube",
      name: "NINTENDO GAMECUBE",
      status: "RELEASING NOV 2001",
      badge: "NEW CONSOLE",
      imageUrl: "https://images.unsplash.com/photo-1592840496073-e53bb8f17eb2?w=400&auto=format&fit=crop&q=80",
      description: "128-Bit Gekko Processor & Optical Disc Format.",
    },
    {
      id: "gba",
      name: "GAME BOY ADVANCE",
      status: "NOW AVAILABLE",
      badge: "PORTABLE",
      imageUrl: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=400&auto=format&fit=crop&q=80",
      description: "32-Bit ARM Processing in the Palm of Your Hand.",
    },
    {
      id: "n64",
      name: "NINTENDO 64",
      status: "LEGACY SYSTEM",
      badge: "64-BIT 3D",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80",
      description: "Pioneering 3D Analog Control and 4-Player Multiplayer.",
    },
    {
      id: "gbc",
      name: "GAME BOY COLOR",
      status: "WORLD FAVORITE",
      badge: "COLOR PALETTE",
      imageUrl: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=400&auto=format&fit=crop&q=80",
      description: "Over 32,000 Displayable Colors and Massive Game Library.",
    },
  ];

  return (
    <div className="w-full flex flex-col plate-bevel bg-[#dedede] overflow-hidden select-none">
      <div className="bg-[#7a8aba] text-[#21242e] px-2.5 py-1 flex items-center justify-between border-b border-[#3d4f97] plate-bevel">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs text-[#21242e]">≡</span>
          <span className="chrome-label text-[11px] text-[#21242e]">
            NINTENDO HARDWARE ARCHITECTURE
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#f68d1f]">
          ALL PLATFORMS
        </span>
      </div>

      <div className="p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#dedede]">
        {systems.map((sys) => (
          <div
            key={sys.id}
            className="flex flex-col bg-[#8ba1d4] p-2 plate-bevel border border-[#3d4f97]"
          >
            <div className="flex items-center justify-between pb-1">
              <span className="text-[9px] font-black bg-[#21242e] text-white px-1.5 py-0.2">
                {sys.badge}
              </span>
              <span className="text-[9px] font-bold text-[#21242e]">
                {sys.status}
              </span>
            </div>

            <div className="relative w-full h-24 bg-black overflow-hidden inset-bevel my-1">
              <Image
                src={sys.imageUrl}
                alt={sys.name}
                fill
                sizes="(max-width: 640px) 100vw, 240px"
                className="object-cover"
              />
            </div>

            <h4 className="boxart-wordmark text-base leading-tight mt-0.5">
              {sys.name}
            </h4>
            <p className="text-[11px] text-[#21242e] font-medium mt-0.5 leading-snug">
              {sys.description}
            </p>

            <button
              type="button"
              className="mt-2 chip-bevel bg-[#f68d1f] hover:bg-[#e48600] text-white text-[10px] font-black uppercase px-2 py-0.5 flex items-center justify-between cursor-pointer"
            >
              <span>TECH SPECS</span>
              <span>▶</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
