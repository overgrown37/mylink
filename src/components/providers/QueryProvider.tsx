"use client";

import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initAuthListener } from "@/store/useAuthStore";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 1, // 1분 캐시
            retry: 1,
            refetchOnWindowFocus: false, // Firestore 비용 절약 및 깜빡임 방지
          },
        },
      })
  );

  // 전역 Firebase Auth 상태 리스너 등록 (모든 페이지에서 인증 상태 동기화)
  useEffect(() => {
    const unsubscribeAuth = initAuthListener();
    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export default QueryProvider;

