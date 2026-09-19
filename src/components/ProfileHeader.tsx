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
  BoltIcon,
} from "./Icons";

interface ProfileHeaderProps {
  profile: ProfileData;
}

const getSocialStyle = (platform: SocialLink["platform"]) => {
  switch (platform) {
    case "github":
      return "bg-[#18181B] text-white hover:bg-black";
    case "twitter":
      return "bg-[#000000] text-white";
    case "instagram":
      return "bg-[#FF66C4] text-black";
    case "youtube":
      return "bg-[#FF4D4D] text-black";
    case "linkedin":
      return "bg-[#00F0FF] text-black";
    case "email":
      return "bg-[#FFDE59] text-black";
  }
};

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
    <div className="w-full relative bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl overflow-hidden transition-all">
      {/* Neo-brutalist Moving Ticker Tape Ribbon */}
      <div className="bg-[#FFDE59] border-b-[3px] border-black py-1.5 overflow-hidden select-none font-black text-xs uppercase tracking-widest text-black flex items-center">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-6">
          <span>⚡ OFFICIAL MYLINK PROFILE</span>
          <span>✦</span>
          <span>AVAILABLE FOR WORK & PROJECTS</span>
          <span>✦</span>
          <span>{profile.name}</span>
          <span>✦</span>
          <span>VIBE CODING & WEB TECH</span>
          <span>✦</span>
          <span>⚡ OFFICIAL MYLINK PROFILE</span>
          <span>✦</span>
          <span>AVAILABLE FOR WORK & PROJECTS</span>
          <span>✦</span>
          <span>{profile.name}</span>
          <span>✦</span>
          <span>VIBE CODING & WEB TECH</span>
          <span>✦</span>
        </div>
      </div>

      {/* Banner Image with Black Frame */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden border-b-[3px] border-black bg-zinc-100">
        <Image
          src={profile.bannerUrl}
          alt="Cover Banner"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover object-center grayscale-[20%] contrast-110"
        />

        {/* Floating Brutalist Share Button */}
        <button
          onClick={handleShare}
          type="button"
          aria-label="프로필 공유하기"
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs bg-[#FFDE59] hover:bg-[#FFE600] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 cursor-pointer"
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 text-black" />
              <span>복사됨!</span>
            </>
          ) : (
            <>
              <ShareIcon className="w-4 h-4 text-black" />
              <span>공유하기</span>
            </>
          )}
        </button>
      </div>

      {/* Main Profile Info Section */}
      <div className="px-5 sm:px-8 pb-7 pt-0 flex flex-col items-center text-center">
        {/* Avatar with Offset Neo Drop Block */}
        <div className="relative -mt-16 sm:-mt-20 mb-3">
          {/* Offset colorful background shadow block */}
          <div className="absolute inset-0 bg-[#FF66C4] border-[3px] border-black rounded-2xl rotate-[-3deg] shadow-[4px_4px_0px_0px_#000] translate-x-1 translate-y-1" />

          {/* Actual Avatar Frame */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-[3px] border-black bg-white z-10">
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              fill
              priority
              sizes="128px"
              className="object-cover"
            />
          </div>

          {/* Neo Badge on Avatar */}
          <div className="absolute -bottom-2 -right-2 z-20 bg-[#70FFAF] text-black border-2 border-black rounded-lg p-1.5 shadow-[2px_2px_0px_0px_#000] rotate-[6deg]">
            <BoltIcon className="w-4 h-4 text-black" />
          </div>
        </div>

        {/* Name and Handle */}
        <div className="mt-1 flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            {profile.name}
          </h1>

          <div className="mt-1 flex items-center gap-2">
            <span className="inline-block bg-[#00F0FF] border-2 border-black text-black font-extrabold text-xs px-2.5 py-0.5 rounded-md shadow-[2px_2px_0px_0px_#000] rotate-[-1deg]">
              {profile.handle}
            </span>
            <span className="inline-block bg-[#70FFAF] border-2 border-black text-black font-extrabold text-[11px] px-2 py-0.5 rounded-md shadow-[2px_2px_0px_0px_#000] rotate-[1deg]">
              VERIFIED ✦
            </span>
          </div>
        </div>

        {/* Tagline Sticker */}
        <div className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFDE59] border-2 border-black font-black text-xs sm:text-sm text-black shadow-[3px_3px_0px_0px_#000] rotate-[-0.5deg]">
          <span>⚡ {profile.tagline}</span>
        </div>

        {/* Location & Status Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-3.5">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-black bg-zinc-100 border-2 border-black px-2.5 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000]">
            <MapPinIcon className="w-3.5 h-3.5 text-black" />
            {profile.location}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-black text-black bg-[#70FFAF] border-2 border-black px-2.5 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000]">
            <span className="w-2 h-2 rounded-full bg-black animate-ping" />
            {profile.status.text}
          </span>
        </div>

        {/* Bio in framed retro callout box */}
        <div className="w-full max-w-lg mt-4 p-3.5 bg-[#FFFDF0] border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] text-left">
          <p className="text-xs sm:text-sm font-semibold text-black leading-relaxed whitespace-pre-line">
            {profile.bio}
          </p>
        </div>

        {/* Chunky Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full max-w-md mt-5">
          {profile.stats.map((stat, idx) => {
            const bgColors = ["bg-[#FF66C4]", "bg-[#70FFAF]", "bg-[#00F0FF]"];
            const bg = bgColors[idx % bgColors.length];

            return (
              <div
                key={stat.label}
                className={`flex flex-col items-center p-2.5 rounded-xl ${bg} border-2 border-black shadow-[3px_3px_0px_0px_#000]`}
              >
                <span className="text-base sm:text-lg font-black text-black">
                  {stat.value}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-black mt-0.5 uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tactile Social Buttons Row */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-6 flex-wrap">
          {profile.socials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              className={`p-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 ${getSocialStyle(
                social.platform
              )}`}
            >
              {renderSocialIcon(social.platform)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
