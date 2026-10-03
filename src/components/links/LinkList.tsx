"use client";

import React from "react";
import { LinkItem } from "@/types/profile";
import { LinkCard } from "./LinkCard";
import { SectionHeader } from "./SectionHeader";

interface LinkListProps {
  links: LinkItem[];
}

export function LinkList({ links }: LinkListProps) {
  // Sort links by order
  const sortedLinks = [...links].sort((a, b) => a.order - b.order);

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
