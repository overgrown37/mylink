"use client";

import React, { useState, useEffect } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import mockProfileData from "@/data/mockProfile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SocialBar } from "@/components/profile/SocialBar";
import { LinkList } from "@/components/links/LinkList";
import { AddLinkDialog } from "@/components/links/AddLinkDialog";
import { ShareButton } from "@/components/profile/ShareButton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

import { subscribeLinksFromFirestore } from "@/lib/firestoreLinks";

export default function HomePage() {
  const storeProfile = useProfileStore((state) => state.profile);
  const setLinks = useProfileStore((state) => state.setLinks);
  const resetToMockData = useProfileStore((state) => state.resetToMockData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Firestore users/anonymous/links 실시간 구독
    const unsubscribe = subscribeLinksFromFirestore(
      (firestoreLinks) => {
        if (firestoreLinks && firestoreLinks.length > 0) {
          setLinks(firestoreLinks);
        }
      },
      (error) => {
        console.warn("Firestore 실시간 동기화 오류 (오프라인/권한):", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [setLinks]);

  // Use hydrated store after mount, or default mock data during SSR
  const profile = mounted ? storeProfile : mockProfileData;

  return (
    <div className="min-h-screen bg-[#0a0d3a] text-white flex flex-col justify-between items-center relative overflow-x-hidden selection:bg-[#5865f2] selection:text-white">
      {/* Ambient background glow according to design.md */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-gradient-to-b from-[#5865f2]/20 via-[#ec48bd]/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-[#5865f2]/10 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Main Container: Mobile-first 440px max width */}
      <main className="w-full max-w-[440px] px-4 py-6 sm:py-10 flex flex-col flex-1">
        {/* Top Utility Bar */}
        <header className="flex items-center justify-between w-full pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest uppercase text-[#5865f2] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
              MyLink
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShareButton />
          </div>
        </header>

        {/* Profile Header (Avatar, Name, Handle, Bio) */}
        <ProfileHeader
          displayName={profile.displayName}
          handle={profile.handle}
          bio={profile.bio}
          avatarUrl={profile.avatarUrl}
        />

        {/* Social Icons Bar */}
        <SocialBar socials={profile.socials} />

        {/* Action: Add Link Dialog Trigger */}
        <div className="pt-2 pb-1">
          <AddLinkDialog />
        </div>

        {/* Links & Section Headers */}
        <LinkList links={profile.links} />

        {/* Footer */}
        <footer className="mt-auto pt-8 pb-4 text-center">
          <Separator className="bg-white/10 mb-6" />
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => resetToMockData()}
                title="더미 데이터로 복원"
                className="text-[11px] text-white/40 hover:text-white hover:bg-white/5 gap-1 rounded-md"
              >
                <RotateCcw className="w-3 h-3" />
                <span>데이터 초기화</span>
              </Button>
            </div>
            <div>
              <p className="text-xs text-white/50 font-medium">
                Powered by{" "}
                <span className="text-white/80 font-bold hover:text-[#35ed7e] transition-colors cursor-pointer">
                  마이링크 (MyLink)
                </span>
              </p>
              <p className="text-[11px] text-white/35 mt-0.5">
                나만의 링크 페이지를 무료로 만들어보세요
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
