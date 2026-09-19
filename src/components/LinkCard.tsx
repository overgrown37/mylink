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
      className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 sm:p-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
        link.isFeatured
          ? "bg-gradient-to-br from-indigo-500/[0.07] via-purple-500/[0.05] to-pink-500/[0.05] dark:from-indigo-500/[0.12] dark:via-purple-500/[0.08] dark:to-pink-500/[0.06] border-2 border-indigo-400/40 dark:border-indigo-500/40 shadow-lg shadow-indigo-500/5 hover:border-indigo-500/70"
          : "bg-white/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700"
      } backdrop-blur-md`}
    >
      {/* Thumbnail Image */}
      <div className="relative w-full sm:w-20 h-36 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-inner">
        <Image
          src={link.imageUrl}
          alt={link.title}
          fill
          sizes="(max-width: 640px) 100vw, 80px"
          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          {link.badge && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                link.isFeatured
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
              }`}
            >
              {link.isFeatured && <SparklesIcon className="w-3 h-3" />}
              {link.badge}
            </span>
          )}

          {link.stats && (
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md border border-amber-200/40 dark:border-amber-800/40">
              {link.stats}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
          {link.title}
        </h3>

        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed line-clamp-2">
          {link.description}
        </p>
      </div>

      {/* External Action Button Icon */}
      <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
        <ExternalLinkIcon className="w-4 h-4" />
      </div>
    </a>
  );
}
