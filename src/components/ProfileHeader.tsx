"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { ProfileData, SocialLink } from "@/data/profile";
import {
  GithubIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  ShareIcon,
  CheckIcon,
} from "./Icons";

interface ProfileHeaderProps {
  profile: ProfileData;
}

const renderSocialIcon = (platform: SocialLink["platform"]) => {
  const cls = "w-5 h-5";
  switch (platform) {
    case "github":
      return <GithubIcon className={cls} />;
    case "instagram":
      return <InstagramIcon className={cls} />;
    case "twitter":
      return <TwitterIcon className={cls} />;
    case "youtube":
      return <YoutubeIcon className={cls} />;
    case "linkedin":
      return <LinkedinIcon className={cls} />;
    case "email":
      return <MailIcon className={cls} />;
  }
};

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name} - 마이 링크`,
          text: profile.bio,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xl overflow-hidden transition-all duration-300">
      {/* Banner Image with Overlay */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden">
        <Image
          src={profile.bannerUrl}
          alt="Profile Banner"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Share Button (Top-Right) */}
        <button
          onClick={handleShare}
          type="button"
          aria-label="프로필 공유하기"
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
        >
          {copied ? (
            <>
              <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>복사 완료!</span>
            </>
          ) : (
            <>
              <ShareIcon className="w-3.5 h-3.5" />
              <span>공유하기</span>
            </>
          )}
        </button>
      </div>

      {/* Main Profile Info Section */}
      <div className="px-5 sm:px-8 pb-7 pt-0 flex flex-col items-center text-center">
        {/* Avatar with Negative Margin and Gradient Ring */}
        <div className="relative -mt-16 sm:-mt-20 mb-3 group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 shadow-2xl bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              fill
              priority
              sizes="128px"
              className="object-cover"
            />
          </div>
          {/* Active Status Indicator */}
          {profile.status.available && (
            <span
              title="활동 중"
              className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full shadow-md flex items-center justify-center"
            >
              <span className="w-2 h-2 bg-white rounded-full animate-ping opacity-75" />
            </span>
          )}
        </div>

        {/* Name and Handle */}
        <div className="flex items-center gap-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            {profile.name}
          </h1>
        </div>
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
          {profile.handle}
        </p>

        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <span>{profile.tagline}</span>
        </div>

        {/* Location & Status Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <MapPinIcon className="w-3.5 h-3.5 text-zinc-400" />
            {profile.location}
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {profile.status.text}
          </span>
        </div>

        {/* Bio */}
        <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-lg mt-4 leading-relaxed whitespace-pre-line font-normal">
          {profile.bio}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-sm mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800/80">
          {profile.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center p-2 rounded-xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/50"
            >
              <span className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {stat.value}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Social Icon Bar */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-6 flex-wrap">
          {profile.socials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-200 hover:text-white hover:bg-gradient-to-tr hover:from-indigo-600 hover:to-purple-600 dark:hover:from-indigo-500 dark:hover:to-purple-500 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all duration-200 border border-zinc-200/60 dark:border-zinc-700/60"
            >
              {renderSocialIcon(social.platform)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
