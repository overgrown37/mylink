"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { LinkList } from "@/components/links/LinkList";
import { AddLinkDialog } from "@/components/links/AddLinkDialog";
import { LinkStatsSection } from "@/components/stats/LinkStatsSection";
import { ShareButton } from "@/components/profile/ShareButton";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { MyPageButton } from "@/components/navigation/MyPageButton";
import { LandingPage } from "@/components/landing/LandingPage";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

import { subscribeLinksFromFirestore } from "@/lib/firestoreLinks";

const emptySubscribe = () => () => {};

export default function HomePage() {
  const storeProfile = useProfileStore((state) => state.profile);
  const setLinks = useProfileStore((state) => state.setLinks);
  const resetToMockData = useProfileStore((state) => state.resetToMockData);

  const { user, userProfile: authProfile, isLoading: isAuthLoading } = useAuthStore();
  const { data: queryProfile } = useProfileQuery(user?.uid);
  const userProfile = queryProfile || authProfile;

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [loadedUserUid, setLoadedUserUid] = useState<string | null>(null);

  // Firestore 로딩 상태: 로그인한 유저의 링크 데이터가 아직 로드되지 않은 상태일 때만 true
  const isFirestoreLoading = Boolean(user && loadedUserUid !== user.uid);

  // 로그인 상태에 따른 Firestore users/{uid}/links 실시간 구독
  useEffect(() => {
    if (!user) return;

    let isCancelled = false;
    const startTime = Date.now();

    // 4초 안전 타임아웃
    const timeoutTimer = setTimeout(() => {
      if (!isCancelled) {
        setLoadedUserUid(user.uid);
      }
    }, 4000);

    // users/{user.uid}/links 구독
    const unsubscribe = subscribeLinksFromFirestore(
      (firestoreLinks) => {
        if (isCancelled) return;
        clearTimeout(timeoutTimer);

        if (firestoreLinks) {
          setLinks(firestoreLinks);
        }

        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, 400 - elapsed);
        setTimeout(() => {
          if (!isCancelled) {
            setLoadedUserUid(user.uid);
          }
        }, remainingDelay);
      },
      (error) => {
        if (isCancelled) return;
        clearTimeout(timeoutTimer);
        setLoadedUserUid(user.uid);
        console.warn("Firestore 사용자 링크 실시간 동기화 오류:", error);
      },
      user.uid
    );

    return () => {
      isCancelled = true;
      clearTimeout(timeoutTimer);
      unsubscribe();
    };
  }, [user, setLinks]);

  // 프로필 정보 동적 계산
  const currentProfile = React.useMemo(() => {
    if (user) {
      const emailPrefix = user.email ? user.email.split("@")[0] : user.uid.slice(0, 6);
      const defaultBio = `${emailPrefix}님의 마이링크에 오신 것을 환영합니다!`;
      let bio = userProfile?.bio || defaultBio;
      if (bio.includes("마이링크에 오신 것을 환영합니다")) {
        bio = defaultBio;
      }
      return {
        displayName: userProfile?.displayName || emailPrefix,
        handle: userProfile?.handle || `@${emailPrefix}`,
        bio,
        avatarUrl: userProfile?.photoURL || user.photoURL || "",
        isLoggedIn: true,
      };
    }

    // 비로그인 방문자 기본 화면
    return {
      displayName: "마이링크 (MyLink)",
      handle: "@guest",
      bio: "Google 계정으로 로그인하여 나만의 맞춤형 링크 페이지를 시작해보세요.",
      avatarUrl: "",
      isLoggedIn: false,
    };
  }, [user, userProfile]);

  const isGuestLanding = mounted && !isAuthLoading && !user;

  return (
    <div className="min-h-screen bg-[#0a0d3a] text-white flex flex-col justify-between items-center relative overflow-x-hidden selection:bg-[#5865f2] selection:text-white">
      {/* Ambient background glow according to design.md */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-gradient-to-b from-[#5865f2]/20 via-[#ec48bd]/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-[#5865f2]/10 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Main Container: 게스트 랜딩은 반응형 와이드(max-w-5xl), 로그인 관리 홈은 440px 집중형 */}
      <main
        className={`w-full px-4 py-6 sm:py-10 flex flex-col flex-1 transition-all duration-300 ${
          isGuestLanding ? "max-w-5xl sm:px-6 lg:px-8" : "max-w-[440px]"
        }`}
      >
        {/* Top Utility Bar with Google Auth and Share buttons */}
        <header className="flex items-center justify-between w-full pb-4 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest uppercase text-[#5865f2] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full shadow-sm">
              MyLink
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MyPageButton />
            <GoogleAuthButton />
            {user && <ShareButton />}
          </div>
        </header>

        {/* Profile Header (로그인 유저 관리 화면에서만 표시) */}
        {user && (
          <ProfileHeader
            displayName={currentProfile.displayName}
            handle={currentProfile.handle}
            bio={currentProfile.bio}
            avatarUrl={currentProfile.avatarUrl}
            isLoggedIn={currentProfile.isLoggedIn}
          />
        )}

        {/* 조건부 화면 렌더링: 비로그인 랜딩 페이지 vs 로그인 상태 개인화 링크 관리 */}
        {!mounted || isAuthLoading ? (
          <div
            data-testid="auth-loading-spinner"
            className="w-full flex flex-col items-center justify-center py-16 gap-4 animate-in fade-in duration-300"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border border-[#5865f2]/20 animate-ping opacity-25 pointer-events-none" />
              <div className="absolute w-10 h-10 rounded-full border-[3px] border-white/10 border-t-[#5865f2] border-r-[#ec48bd] animate-spin shadow-[0_0_15px_rgba(88,101,242,0.4)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#35ed7e] shadow-[0_0_8px_#35ed7e]" />
            </div>
            <span className="text-xs text-white/60">인증 정보를 확인하는 중...</span>
          </div>
        ) : !user ? (
          // ─── 1. 비로그인 게스트 반응형 랜딩 페이지 ───
          <LandingPage />
        ) : (
          // ─── 2. 로그인 유저 개인화 화면 ───
          <div className="space-y-3.5 animate-in fade-in duration-400">
            {/* Realtime Link Click Analytics Section */}
            <LinkStatsSection links={storeProfile.links} />

            {/* Action: Add Link Dialog Trigger */}
            <div className="pt-1 pb-1">
              <AddLinkDialog />
            </div>

            {/* Links & Section Headers */}
            {isFirestoreLoading ? (
              <div
                data-testid="loading-spinner-circle"
                className="w-full flex flex-col items-center justify-center py-12 gap-3 animate-in fade-in duration-300"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border border-[#5865f2]/20 animate-ping opacity-25 pointer-events-none" />
                  <div className="absolute w-9 h-9 rounded-full border-[3px] border-white/10 border-t-[#5865f2] border-r-[#ec48bd] animate-spin shadow-[0_0_15px_rgba(88,101,242,0.4)]" />
                  <div className="w-2 h-2 rounded-full bg-[#35ed7e] shadow-[0_0_8px_#35ed7e]" />
                </div>
                <div className="flex flex-col items-center gap-0.5 text-center">
                  <span className="text-xs font-semibold text-white/80 tracking-wide">
                    개인 링크를 불러오는 중...
                  </span>
                  <span className="text-[10px] text-white/40">
                    users/{user.uid.slice(0, 6)}.../links
                  </span>
                </div>
              </div>
            ) : (
              <LinkList links={storeProfile.links} />
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-8 pb-4 text-center">
          <Separator className="bg-white/10 mb-6" />
          <div className="space-y-3">
            {user && (
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
            )}
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
