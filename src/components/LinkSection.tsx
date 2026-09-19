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
    <section className="w-full mt-7 space-y-4">
      {/* Category Filter and Count Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-block bg-black text-white border-2 border-black font-black text-xs px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_#FFDE59]">
            EXPLORE LINKS ⚡
          </span>
          <span className="inline-block bg-[#FF66C4] text-black border-2 border-black font-black text-xs px-2 py-0.5 rounded-md shadow-[2px_2px_0px_0px_#000]">
            {filteredLinks.length}개
          </span>
        </div>

        <CategoryFilter
          currentCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          counts={counts}
        />
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filteredLinks.map((link) => (
          <LinkCard key={link.id} link={link} />
        ))}

        {filteredLinks.length === 0 && (
          <div className="text-center py-12 px-4 rounded-2xl bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] font-black text-black">
            해당 카테고리에 등록된 링크가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
