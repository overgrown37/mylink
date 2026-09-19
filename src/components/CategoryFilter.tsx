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
    <div className="flex items-center gap-1.5 p-1 bg-zinc-200/60 dark:bg-zinc-800/60 backdrop-blur-md rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60 overflow-x-auto no-scrollbar w-full sm:w-auto">
      {categories.map((cat) => {
        const isActive = currentCategory === cat.id;
        const count = counts[cat.id] ?? 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            type="button"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
              isActive
                ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  : "bg-zinc-200/80 dark:bg-zinc-700/80 text-zinc-500 dark:text-zinc-400"
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
