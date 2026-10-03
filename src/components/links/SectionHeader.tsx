"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="pt-5 pb-2 flex items-center gap-3">
      <div className="flex-1">
        <Separator className="bg-white/10" />
      </div>
      <h2 className="text-xs font-bold uppercase tracking-wider text-[#ec48bd] px-1 text-center shrink-0">
        {title}
      </h2>
      <div className="flex-1">
        <Separator className="bg-white/10" />
      </div>
    </div>
  );
}

export default SectionHeader;
