"use client";

import React, { useState } from "react";

export default function PlayersPollPanel() {
  const [selectedOption, setSelectedOption] = useState("gamecube");
  const [hasVoted, setHasVoted] = useState(false);

  const options = [
    { id: "gamecube", label: "Nintendo GameCube Optical System" },
    { id: "gba", label: "Game Boy Advance (Indigo / Glacier)" },
    { id: "pokemon", label: "Pokémon Crystal Edition" },
    { id: "vibe", label: "Vibe Coding & Web Applications" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasVoted(true);
  };

  return (
    <div className="w-full flex flex-col plate-bevel bg-[#8ba1d4] overflow-hidden select-none">
      {/* Header Bar */}
      <div className="bg-[#7a8aba] text-[#21242e] px-2.5 py-1 flex items-center justify-between border-b border-[#3d4f97] plate-bevel">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs text-[#21242e]">≡</span>
          <span className="chrome-label text-[11px] text-[#21242e]">
            PLAYER&apos;S POLL
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#ecab37]">
          POLL #48
        </span>
      </div>

      {/* Poll Question & Radio Options */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#8ba1d4] flex flex-col gap-2.5">
        <p className="text-[12px] font-bold text-[#21242e] leading-snug">
          Which upcoming Nintendo launch are you most excited to experience this autumn?
        </p>

        <div className="flex flex-col gap-1.5 bg-white/50 p-2 inset-bevel">
          {options.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 text-[11px] font-medium text-[#21242e] cursor-pointer hover:text-[#3d4f97]"
            >
              <input
                type="radio"
                name="nintendo-poll"
                value={opt.id}
                checked={selectedOption === opt.id}
                onChange={() => setSelectedOption(opt.id)}
                className="w-3 h-3 text-[#f68d1f] focus:ring-0 cursor-pointer accent-[#f68d1f]"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>

        {/* Action Button & Result Feedback */}
        <div className="flex items-center justify-between pt-1">
          {hasVoted ? (
            <span className="text-[11px] font-bold text-[#3d4f97] bg-white px-2 py-0.5 border border-[#3d4f97]">
              ✓ Vote Recorded! Thank you.
            </span>
          ) : (
            <button
              type="submit"
              className="chip-bevel bg-[#f68d1f] hover:bg-[#e48600] active:translate-y-[1px] text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>SUBMIT VOTE</span>
              <span className="text-[10px]">▶</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setHasVoted(true)}
            className="text-[10px] font-bold text-[#3d4f97] hover:underline"
          >
            View Past Results
          </button>
        </div>
      </form>
    </div>
  );
}
