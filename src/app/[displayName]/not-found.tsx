import Link from "next/link";
import { UserX, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserNotFound() {
  return (
    <div className="min-h-screen bg-[#0a0d3a] text-white flex flex-col justify-center items-center relative overflow-hidden px-4 selection:bg-[#5865f2] selection:text-white">
      {/* Background glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[#ec48bd]/20 via-[#5865f2]/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <main className="w-full max-w-md p-8 rounded-3xl bg-[#12163a]/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center space-y-6">
        {/* Icon with glow */}
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#ec48bd] to-[#5865f2] opacity-50 blur-lg" />
          <div className="relative w-20 h-20 rounded-full bg-[#1e2353] border-2 border-white/20 flex items-center justify-center text-[#ec48bd]">
            <UserX className="w-10 h-10" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <span className="text-xs font-black tracking-widest uppercase text-[#ec48bd] bg-[#ec48bd]/10 border border-[#ec48bd]/20 px-3 py-1 rounded-full">
            404 NOT FOUND
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight pt-2">
            사용자를 찾을 수 없습니다
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-xs">
            요청하신 닉네임의 마이링크가 존재하지 않거나, 닉네임이 변경되었을 수 있습니다.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5 pt-2">
          <Link
            href="/"
            className="flex items-center justify-center w-full h-11 bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold rounded-2xl gap-2 shadow-[0_4px_20px_rgba(88,101,242,0.4)] transition-all active:scale-[0.99] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#35ed7e]" />
            <span>나도 마이링크 만들기</span>
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center w-full h-10 text-white/60 hover:text-white hover:bg-white/5 rounded-xl gap-2 text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>홈으로 돌아가기</span>
          </Link>
        </div>
      </main>

      <footer className="mt-8 text-xs text-white/30 font-medium">
        Powered by 마이링크 (MyLink)
      </footer>
    </div>
  );
}

