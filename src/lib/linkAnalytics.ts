import { trackEvent } from "./firebase";

/**
 * 링크 클릭 발생 시 서버에 비동기 +1 카운트 요청을 전송하는 헬퍼 함수
 * - sendBeacon 및 fetch keepalive를 사용하여 외부 링크 이동 시에도 브라우저가 요청을 취소하지 않음
 * - 동시성 충돌 없이 Firestore atomic increment(1)로 카운트 누적
 */
export const recordLinkClick = (userId?: string, linkId?: string) => {
  if (!userId || !linkId) return;

  const payload = JSON.stringify({
    userId: userId.trim(),
    linkId: linkId.trim(),
  });

  try {
    // 1. fetch with keepalive: true (모든 최신 브라우저 지원, 이탈 시에도 요청 완주)
    if (typeof window !== "undefined" && typeof fetch === "function") {
      fetch("/api/links/click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
        keepalive: true,
      }).catch((err) => {
        console.warn("서버 클릭 카운트 전송 실패:", err);
      });
    } else if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      // 2. Fallback: sendBeacon
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/links/click", blob);
    }

    trackEvent("link_clicked", { linkId, userId });
  } catch (err) {
    console.warn("recordLinkClick 실행 중 예외:", err);
  }
};

