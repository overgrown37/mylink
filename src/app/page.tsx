"use client";

import React from "react";
import DiscordNav from "@/components/discord/DiscordNav";
import DiscordHero from "@/components/discord/DiscordHero";
import MarqueeBand from "@/components/discord/MarqueeBand";
import FeatureGradientCard from "@/components/discord/FeatureGradientCard";
import TrendingProjectsList from "@/components/discord/TrendingProjectsList";
import StatCardsGrid from "@/components/discord/StatCardsGrid";
import DiscordCtaBand from "@/components/discord/DiscordCtaBand";
import DiscordFooter from "@/components/discord/DiscordFooter";
import { profileData } from "@/data/profile";

export default function Home() {
  const featuredItem = profileData.links.find((l) => l.isFeatured) || profileData.links[0];

  const handleCoffeeChat = () => {
    window.location.href = "mailto:contact@example.com?subject=Coffee%20Chat%20Inquiry";
  };

  return (
    <main className="min-h-screen bg-[#0a0d3a] text-white flex flex-col items-center selection:bg-[#5865f2] selection:text-white relative">
      {/* 1. Discord Nav Bar */}
      <DiscordNav onCoffeeChat={handleCoffeeChat} />

      {/* 2. Dark-Indigo Hero with Animated Gradient Mesh & Profile Showcase */}
      <DiscordHero profile={profileData} />

      {/* 3. Full-Bleed Blurple Marquee Band */}
      <MarqueeBand />

      {/* 4. 40px Rounded Vibrant Magenta Feature Panel */}
      <FeatureGradientCard featuredItem={featuredItem} />

      {/* 5. Trending Projects & Articles Ranked List */}
      <TrendingProjectsList links={profileData.links} />

      {/* 6. Big-Number Blurple & Magenta Stat Cards */}
      <StatCardsGrid profile={profileData} />

      {/* 7. Full-Bleed Blurple CTA Band */}
      <DiscordCtaBand />

      {/* 8. Giant Wordmark Footer */}
      <DiscordFooter profile={profileData} />
    </main>
  );
}
