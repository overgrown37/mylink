"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, CheckCircle2, Pencil } from "lucide-react";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";

interface ProfileHeaderProps {
  displayName: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  isLoggedIn?: boolean;
}

export function ProfileHeader({
  displayName,
  handle,
  bio,
  avatarUrl,
  isLoggedIn,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-3 pt-2 pb-4">
      {/* Avatar with Discord styled glow */}
      <div className="relative group">
        <div
          className={`absolute -inset-1 rounded-full bg-gradient-to-r ${
            isLoggedIn
              ? "from-[#5865f2] via-[#35ed7e] to-[#ec48bd]"
              : "from-[#5865f2] to-[#ec48bd]"
          } opacity-75 blur-md group-hover:opacity-100 transition duration-300`}
        />
        <Avatar className="relative size-24 border-2 border-white/20 shadow-2xl">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
          ) : null}
          <AvatarFallback className="bg-[#1e2353] text-white/60 font-bold flex items-center justify-center">
            <User className="size-11 text-white/50" />
          </AvatarFallback>
        </Avatar>
        {isLoggedIn && (
          <div
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#35ed7e] border-2 border-[#0a0d3a] flex items-center justify-center text-[#0a0d3a]"
            title="인증된 Google 사용자"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0a0d3a] stroke-[3]" />
          </div>
        )}
      </div>

      {/* Name & Handle */}
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1.5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {displayName}
          </h1>
        </div>
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <Badge
            variant="secondary"
            className="bg-white/10 hover:bg-white/15 text-white/80 font-mono text-xs px-2.5 py-0.5 border border-white/10"
          >
            {handle}
          </Badge>
          {isLoggedIn ? (
            <Badge className="bg-[#35ed7e]/15 text-[#35ed7e] border border-[#35ed7e]/30 text-[10px] px-2 py-0 font-medium">
              내 프로필 (클라우드 연동)
            </Badge>
          ) : (
            <Badge className="bg-white/5 text-white/40 border border-white/10 text-[10px] px-2 py-0">
              게스트 모드
            </Badge>
          )}
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <p className="text-sm text-white/75 max-w-sm whitespace-pre-line leading-relaxed font-normal px-2">
          {bio}
        </p>
      )}

      {/* 프로필 수정 버튼 — 로그인 유저 전용 */}
      {isLoggedIn && (
        <EditProfileDialog
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="text-white/40 hover:text-white/80 hover:bg-white/8 rounded-xl gap-1.5 text-[11px] font-medium transition-all mt-1 cursor-pointer"
            >
              <Pencil className="w-3 h-3" />
              프로필 수정
            </Button>
          }
        />
      )}
    </div>
  );
}

export default ProfileHeader;

