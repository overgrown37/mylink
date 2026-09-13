"use client";

import { useState } from "react";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const email = "contact@example.com"; // 실제 이메일로 변경 가능

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const links = [
    {
      title: "GitHub",
      description: "프로젝트 코드 및 기여 내역",
      url: "https://github.com",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      ),
    },
    {
      title: "기술 블로그",
      description: "배운 점과 기술적인 고민 기록",
      url: "https://velog.io",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
          <path d="M6 14h6" />
        </svg>
      ),
    },
    {
      title: "프로젝트 모음",
      description: "바이브 코딩으로 제작한 웹 애플리케이션",
      url: "#",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 16 4-4-4-4" />
          <path d="m6 8-4 4 4 4" />
          <path d="m14.5 4-5 16" />
        </svg>
      ),
    },
  ];

  const tags = ["바이브 코딩", "Next.js", "React", "AI 프로토타이핑", "웹 프론트엔드"];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 transition-colors">
      {/* 은은한 배경 앰비언트 글로우 */}
      <div
        className="pointer-events-none fixed inset-0 flex items-center justify-center -z-10"
        aria-hidden="true"
      >
        <div className="w-[500px] h-[500px] bg-gradient-to-tr from-blue-100/40 via-indigo-100/30 to-purple-100/40 dark:from-blue-950/20 dark:via-indigo-950/15 dark:to-purple-950/20 rounded-full blur-3xl" />
      </div>

      {/* 메인 프로필 카드 */}
      <main className="w-full max-w-md mx-auto flex flex-col items-center text-center">
        {/* 프로필 아바타 */}
        <div className="relative mb-5 group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 p-[3px] shadow-lg shadow-neutral-200 dark:shadow-neutral-900/50 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center">
              <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-500 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-400 bg-clip-text text-transparent select-none">
                김
              </span>
            </div>
          </div>
          {/* 상태 뱃지 */}
          <div
            className="absolute bottom-1 right-1 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm"
            title="학습 및 탐구 중"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400 select-none">
              학습 중
            </span>
          </div>
        </div>

        {/* 이름 */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2">
          김무성
        </h1>

        {/* 역할 뱃지 */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
            🎓 대학생
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
            ✨ Vibe Coder
          </span>
        </div>

        {/* 소개글 */}
        <p className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed max-w-sm mb-6 font-normal">
          바이브 코딩을 배우고 있는 대학생입니다.
        </p>

        {/* 한 줄 소개 카드 */}
        <div className="w-full bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md rounded-2xl p-4 mb-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-normal">
            &ldquo;AI 도구와 직관적인 감각으로 아이디어를 빠르게 코드로 구현하는 개발 여정을 즐기고 있습니다.&rdquo;
          </p>
        </div>

        {/* 링크 목록 */}
        <div className="w-full space-y-3 mb-6">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full p-3.5 sm:p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm hover:border-neutral-400 dark:hover:border-neutral-700 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-900 transition-colors">
                  {link.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {link.title}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {link.description}
                  </div>
                </div>
              </div>
              <svg
                className="w-4 h-4 text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          ))}

          {/* 이메일 문의 / 복사 버튼 */}
          <button
            onClick={handleCopyEmail}
            type="button"
            className="group flex items-center justify-between w-full p-3.5 sm:p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm hover:border-neutral-400 dark:hover:border-neutral-700 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-900 transition-colors">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  이메일 문의
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {copied ? "클립보드에 복사되었습니다! 🎉" : "클릭하여 이메일 복사하기"}
                </div>
              </div>
            </div>
            <div className="text-xs font-medium text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors">
              {copied ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  ✓ 복사됨
                </span>
              ) : (
                <span>복사</span>
              )}
            </div>
          </button>
        </div>

        {/* 관심사 / 태그 */}
        <div className="w-full flex flex-wrap justify-center gap-1.5 pt-2 mb-8">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-800/60"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 하단 푸터 */}
        <footer className="text-xs text-neutral-400 dark:text-neutral-600">
          © {new Date().getFullYear()} 김무성. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
