import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nintendo.com (Circa 2001) | Console Hardware Web Interface",
  description: "Official Nintendo.com circa 2001 recreated as a brushed-periwinkle console hardware machine faceplate with MyLink profile integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
