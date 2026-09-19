import React from "react";
import Image from "next/image";
import type { LinkItem } from "@/data/profile";
import { ExternalLinkIcon, SparklesIcon } from "./Icons";

interface LinkCardProps {
  link: LinkItem;
}

export default function LinkCard({ link }: LinkCardProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 sm:p-4 rounded-2xl border-[3px] border-black transition-all duration-150 cursor-pointer ${
        link.isFeatured
          ? "bg-[#FFF9DB] shadow-[5px_5px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          : "bg-white shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
      }`}
    >
      {/* Thumbnail with solid black border & shadow */}
      <div className="relative w-full sm:w-24 h-36 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 border-black bg-zinc-100 shadow-[2px_2px_0px_0px_#000]">
        <Image
          src={link.imageUrl}
          alt={link.title}
          fill
          sizes="(max-width: 640px) 100vw, 96px"
          className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          {link.badge && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-md border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] ${
                link.isFeatured
                  ? "bg-[#FF66C4] text-black"
                  : "bg-[#70FFAF] text-black"
              }`}
            >
              {link.isFeatured && <SparklesIcon className="w-3 h-3 text-black" />}
              {link.badge}
            </span>
          )}

          {link.stats && (
            <span className="text-[11px] font-black text-black bg-[#00F0FF] px-2 py-0.5 rounded-md border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              {link.stats}
            </span>
          )}
        </div>

        <h3 className="text-base font-black text-black group-hover:text-black group-hover:underline decoration-2 underline-offset-4 leading-snug">
          {link.title}
        </h3>

        <p className="text-xs sm:text-sm font-semibold text-zinc-700 mt-1 leading-relaxed line-clamp-2">
          {link.description}
        </p>
      </div>

      {/* Tactile Arrow Action Button */}
      <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-[#FFDE59] border-2 border-black shadow-[2px_2px_0px_0px_#000] group-hover:translate-x-0.5 group-hover:bg-[#FFE600] transition-all flex-shrink-0">
        <ExternalLinkIcon className="w-4 h-4 text-black" />
      </div>
    </a>
  );
}
