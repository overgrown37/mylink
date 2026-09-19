"use client";

import React from "react";

export default function FooterBar() {
  return (
    <footer className="w-full carbon-halftone plate-bevel p-3.5 sm:p-4 text-[#9fbee7] select-none mt-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: ESRB Privacy-Certified Mark & Trust Stamp */}
        <div className="flex items-center gap-3">
          {/* ESRB Privacy Certified Badge */}
          <div className="chip-bevel bg-[#ecab37] border border-[#21242e] text-[#21242e] px-2 py-1 flex flex-col items-center leading-none text-center shadow-sm">
            <span className="text-[8px] font-black tracking-tighter">
              PRIVACY CERTIFIED
            </span>
            <span className="text-[11px] font-black tracking-widest mt-0.5">
              ESRB
            </span>
          </div>

          <div className="flex flex-col text-[10px] text-[#9fbee7]">
            <span className="font-bold text-white">
              OFFICIAL NINTENDO WEB MACHINE
            </span>
            <span>MODEL NO. N-2001 // REVISION 4.2</span>
          </div>
        </div>

        {/* Center/Right: Copyright and Legal Links */}
        <div className="flex flex-col sm:items-end text-center sm:text-right gap-1 text-[10px]">
          <div className="flex items-center gap-2 text-white font-bold">
            <a href="#privacy" className="hover:text-[#ecab37] hover:underline">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#terms" className="hover:text-[#ecab37] hover:underline">
              Terms of Use
            </a>
            <span>•</span>
            <a href="#contact" className="hover:text-[#ecab37] hover:underline">
              Contact Us
            </a>
          </div>

          <p className="text-[9px] text-[#9fbee7]/80">
            © 1997–2001 Nintendo of America Inc. All Rights Reserved. Characters and marks are trademarks of Nintendo.
          </p>
        </div>
      </div>
    </footer>
  );
}
