"use client";

import React from "react";
import Image from "next/image";

export default function FeaturedSitesGrid() {
  const featuredSites = [
    {
      id: "pokemon",
      name: "Pokémon Gold & Silver",
      urlCaption: "www.pokemon.com",
      url: "https://www.pokemon.com",
      imageUrl: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "zelda",
      name: "Zelda: Majora's Mask",
      urlCaption: "www.zelda.com",
      url: "https://zelda.nintendo.com",
      imageUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "gba",
      name: "Game Boy Advance",
      urlCaption: "www.gameboy.com",
      url: "https://www.nintendo.com",
      imageUrl: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "smash",
      name: "Super Smash Bros. Melee",
      urlCaption: "www.smashbros.com",
      url: "https://www.smashbros.com",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="w-full flex flex-col plate-bevel bg-[#dedede] overflow-hidden select-none">
      {/* Section Label Bar: Periwinkle Canvas with ≡ Glyph */}
      <div className="bg-[#7a8aba] text-[#21242e] px-2.5 py-1 flex items-center justify-between border-b border-[#3d4f97] plate-bevel">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs text-[#21242e]">≡</span>
          <span className="chrome-label text-[11px] text-[#21242e]">
            FEATURED SITES & AFFILIATES
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#3d4f97]">
          OFFICIAL NETWORK
        </span>
      </div>

      {/* 2x2 Grid of Carbon-Framed Tiles */}
      <div className="p-2.5 grid grid-cols-2 gap-2 bg-[#dedede]">
        {featuredSites.map((site) => (
          <a
            key={site.id}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col bg-[#21242e] p-1 border-2 border-[#21242e] plate-bevel hover:border-[#f68d1f] transition-all cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative w-full h-16 sm:h-20 bg-black overflow-hidden inset-bevel">
              <Image
                src={site.imageUrl}
                alt={site.name}
                fill
                sizes="(max-width: 640px) 50vw, 160px"
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Captions */}
            <div className="pt-1 px-0.5 flex flex-col">
              <span className="text-[11px] font-bold text-white group-hover:text-[#ecab37] truncate leading-tight">
                {site.name}
              </span>
              <span className="text-[9px] font-mono text-[#9fbee7] truncate">
                {site.urlCaption}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
