"use client";

import React, { useState, useMemo } from "react";
import type { LinkItem } from "@/data/profile";
import CategoryFilter, { CategoryType } from "./CategoryFilter";
import LinkCard from "./LinkCard";

interface LinkSectionProps {
  links: LinkItem[];
}

export default function LinkSection({ links }: LinkSectionProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");

  const counts: Record<CategoryType, number> = useMemo(() => {
    return {
      all: links.length,
      projects: links.filter((l) => l.category === "projects").length,
      articles: links.filter((l) => l.category === "articles").length,
      contact: links.filter((l) => l.category === "contact").length,
    };
  }, [links]);

  const filteredLinks = useMemo(() => {
    if (activeCategory === "all") return links;
    return links.filter((l) => l.category === activeCategory);
  }, [links, activeCategory]);

  return (
    <section className="w-full mt-6 space-y-4">
      {/* Category Filter and Count Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            링크 및 활동 목록
          </span>
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            ({filteredLinks.length})
          </span>
        </div>
        <CategoryFilter
          currentCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          counts={counts}
        />
      </div>

      {/* Cards List */}
      <div className="space-y-3.5">
        {filteredLinks.map((link) => (
          <LinkCard key={link.id} link={link} />
        ))}

        {filteredLinks.length === 0 && (
          <div className="text-center py-12 px-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500">
            해당 카테고리에 등록된 링크가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
