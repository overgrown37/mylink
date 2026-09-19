import React from "react";
import ProfileHeader from "@/components/ProfileHeader";
import LinkSection from "@/components/LinkSection";
import { profileData } from "@/data/profile";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col items-center px-4 py-8 sm:py-12 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Decorative ambient glowing gradient orbs in background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] sm:w-[700px] h-[450px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/15 dark:from-indigo-600/15 dark:via-purple-600/15 dark:to-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-[350px] h-[350px] bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-32 w-[350px] h-[350px] bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        {/* Top Mini Brand Bar */}
        <div className="w-full flex items-center justify-between pb-5 px-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              MyLink
            </span>
          </div>

          <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-full border border-zinc-200/60 dark:border-zinc-700/60">
            반응형 프로필 링크
          </span>
        </div>

        {/* Profile Card with Banner & Avatar */}
        <ProfileHeader profile={profileData} />

        {/* Filterable Links with Thumbnails */}
        <LinkSection links={profileData.links} />

        {/* Footer */}
        <footer className="mt-14 pb-8 text-center text-xs text-zinc-400 dark:text-zinc-500 flex flex-col items-center gap-1.5">
          <p className="flex items-center gap-1.5 font-medium">
            <span>Powered by</span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              Next.js
            </span>
            <span>&</span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              Tailwind CSS
            </span>
          </p>
          <p className="text-[11px] opacity-80">
            © {new Date().getFullYear()} {profileData.name}. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
