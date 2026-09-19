"use client";

import React from "react";
import type { LinkItem } from "@/data/profile";

export type CategoryType = "all" | LinkItem["category"];

interface CategoryFilterProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  counts: Record<CategoryType, number>;
}

const categories: { id: CategoryType; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "projects", label: "프로젝트" },
  { id: "articles", label: "아티클" },
  { id: "contact", label: "문의/커피챗" },
];

export default function CategoryFilter({
  currentCategory,
  onSelectCategory,
  counts,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] overflow-x-auto no-scrollbar w-full sm:w-auto">
      {categories.map((cat) => {
        const isActive = currentCategory === cat.id;
        const count = counts[cat.id] ?? 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-150 whitespace-nowrap cursor-pointer ${
              isActive
                ? "bg-[#FFDE59] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                : "text-black hover:bg-zinc-100 border-2 border-transparent"
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md font-black border border-black ${
                isActive
                  ? "bg-black text-white"
                  : "bg-zinc-200 text-black"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
