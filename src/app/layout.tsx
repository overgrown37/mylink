import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyLink | Imagine a Place for Creators",
  description: "Official creator profile & project portal redesigned in Discord's vibrant marketing aesthetic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased bg-[#0a0d3a]">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
