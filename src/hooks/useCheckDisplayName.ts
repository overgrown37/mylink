import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkDisplayNameAvailable } from "@/lib/userProfile";

export type AvailabilityStatus = "idle" | "checking" | "available" | "taken" | "error";

interface UseCheckDisplayNameParams {
  name: string;
  currentUid?: string;
  currentDisplayName?: string;
  debounceMs?: number;
}

export function useCheckDisplayName({
  name,
  currentUid,
  currentDisplayName,
  debounceMs = 500,
}: UseCheckDisplayNameParams) {
  const [debouncedName, setDebouncedName] = useState(name);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedName(name);
      setIsDebouncing(false);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [name, debounceMs]);

  const trimmed = debouncedName.trim();
  const isSameAsCurrent = trimmed === currentDisplayName?.trim();
  const isValidLength = trimmed.length >= 2;

  const shouldQuery = Boolean(
    currentUid && isValidLength && !isSameAsCurrent && !isDebouncing
  );

  const query = useQuery({
    queryKey: ["checkDisplayName", trimmed],
    queryFn: () => checkDisplayNameAvailable(trimmed, currentUid!),
    enabled: shouldQuery,
    staleTime: 1000 * 60 * 5, // 5분 캐싱: 같은 닉네임을 다시 입력 시 즉시 캐시값 반환
  });

  // 상태 통합 계산
  let status: AvailabilityStatus = "idle";

  if (!isValidLength || isSameAsCurrent) {
    status = "idle";
  } else if (isDebouncing || query.isFetching) {
    status = "checking";
  } else if (query.isError) {
    status = "error";
  } else if (query.data === true) {
    status = "available";
  } else if (query.data === false) {
    status = "taken";
  }

  return {
    status,
    isAvailable: query.data,
    isLoading: isDebouncing || query.isFetching,
    error: query.error,
  };
}

