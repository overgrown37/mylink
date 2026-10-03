"use client";

import React from "react";
import { SocialLinks } from "@/types/profile";
import { Button } from "@/components/ui/button";
import {
  GithubIcon,
  InstagramIcon,
  YoutubeIcon,
  TwitterIcon,
  LinkedinIcon,
  MailIcon,
} from "@/components/Icons";

interface SocialBarProps {
  socials: SocialLinks;
}

export function SocialBar({ socials }: SocialBarProps) {
  const socialItems = [
    { key: "github", url: socials.github, icon: GithubIcon, label: "GitHub" },
    { key: "instagram", url: socials.instagram, icon: InstagramIcon, label: "Instagram" },
    { key: "youtube", url: socials.youtube, icon: YoutubeIcon, label: "YouTube" },
    { key: "twitter", url: socials.twitter, icon: TwitterIcon, label: "X (Twitter)" },
    { key: "linkedin", url: socials.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
    { key: "email", url: socials.email, icon: MailIcon, label: "Email" },
  ].filter((item) => Boolean(item.url));

  if (socialItems.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-2 flex-wrap">
      {socialItems.map(({ key, url, icon: Icon, label }) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="outline-none focus-visible:ring-2 focus-visible:ring-[#5865f2] rounded-full"
        >
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-10 bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 hover:border-[#5865f2] hover:scale-110 transition-all cursor-pointer"
          >
            <Icon className="w-4 h-4" />
          </Button>
        </a>
      ))}
    </div>
  );
}

export default SocialBar;
