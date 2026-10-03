"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  displayName: string;
  handle: string;
  bio: string;
  avatarUrl: string;
}

export function ProfileHeader({
  displayName,
  handle,
  bio,
  avatarUrl,
}: ProfileHeaderProps) {
  // Extract initials for fallback
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col items-center text-center space-y-3 pt-2 pb-4">
      {/* Avatar with Discord styled glow */}
      <div className="relative group">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#5865f2] to-[#ec48bd] opacity-75 blur-md group-hover:opacity-100 transition duration-300" />
        <Avatar className="relative size-24 border-2 border-white/20 shadow-2xl">
          <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
          <AvatarFallback className="bg-[#1e2353] text-white font-bold text-xl">
            {initials || "MY"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name & Handle */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          {displayName}
        </h1>
        <div>
          <Badge
            variant="secondary"
            className="bg-white/10 hover:bg-white/15 text-white/80 font-mono text-xs px-2.5 py-0.5 border border-white/10"
          >
            {handle}
          </Badge>
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <p className="text-sm text-white/75 max-w-sm whitespace-pre-line leading-relaxed font-normal px-2">
          {bio}
        </p>
      )}
    </div>
  );
}

export default ProfileHeader;
