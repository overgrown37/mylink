"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="bottom-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#141842] group-[.toaster]:text-white group-[.toaster]:border-[#5865f2]/40 group-[.toaster]:shadow-[0_10px_30px_rgba(0,0,0,0.6)] group-[.toaster]:rounded-2xl group-[.toaster]:backdrop-blur-md group-[.toaster]:px-4 group-[.toaster]:py-3 font-sans",
          description: "group-[.toast]:text-white/60 group-[.toast]:text-xs font-mono",
          actionButton:
            "group-[.toast]:bg-[#5865f2] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-white/60",
          success: "group-[.toast]:text-[#35ed7e]",
        },
      }}
      {...props}
    />
  );
}

export default Toaster;
