"use client";

import React from "react";
import { LinkItem } from "@/types/profile";
import { LinkCard } from "./LinkCard";
import { SectionHeader } from "./SectionHeader";

interface LinkListProps {
  links: LinkItem[];
}

export function LinkList({ links }: LinkListProps) {
  // createdAt 기준 최신순(내림차순) 정렬, createdAt이 없는 항목은 order 기준 정렬
  const sortedLinks = [...links].sort((a, b) => {
    if (a.createdAt !== undefined && b.createdAt !== undefined) {
      return Number(b.createdAt) - Number(a.createdAt);
    }
    if (a.createdAt !== undefined) return -1;
    if (b.createdAt !== undefined) return 1;
    return a.order - b.order;
  });

  if (sortedLinks.length === 0) {
    return (
      <div className="w-full my-6 py-8 px-4 rounded-2xl bg-white/[0.03] border border-dashed border-white/10 text-center">
        <p className="text-sm font-medium text-white/70">
          아직 등록된 링크가 없습니다.
        </p>
        <p className="text-xs text-white/40 mt-1">
          위 &apos;새 링크 추가하기&apos; 버튼으로 링크를 추가해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 my-4">
      {sortedLinks.map((item) => {
        if (item.type === "header") {
          return <SectionHeader key={item.id} title={item.title} />;
        }
        return <LinkCard key={item.id} item={item} />;
      })}
    </div>
  );
}

export default LinkList;
