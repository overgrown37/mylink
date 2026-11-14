import { NextResponse } from "next/server";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * 링크 클릭 카운트 원자적(Atomic) 증가 API 핸들러
 * Firestore increment(1)을 사용하여 동시 클릭 시에도 Race condition 없이 정확한 카운트를 보장합니다.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, linkId } = body;

    if (!userId || typeof userId !== "string" || !linkId || typeof linkId !== "string") {
      return NextResponse.json(
        { error: "올바른 userId와 linkId가 필요합니다." },
        { status: 400 }
      );
    }

    const cleanUserId = userId.trim();
    const cleanLinkId = linkId.trim();

    const linkRef = doc(db, "users", cleanUserId, "links", cleanLinkId);

    // Firestore 원자적 +1 증가 (Race condition 없이 DB 레벨에서 안전하게 +1)
    await updateDoc(linkRef, {
      clicks: increment(1),
    });

    return NextResponse.json(
      { success: true, userId: cleanUserId, linkId: cleanLinkId },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("클릭 카운트 증가 처리 실패:", errorMsg);

    // 권한 오류 발생 시 명확한 안내 로그 출력
    if (errorMsg.includes("permission-denied") || errorMsg.includes("PERMISSION_DENIED")) {
      console.warn(
        "⚠️ [Firestore 보안 규칙 확인 필요] Firebase Console의 Rules에 'affectedKeys().hasOnly([\"clicks\"])' 허용 규칙이 배포되어 있는지 확인해 주세요."
      );
    }

    return NextResponse.json(
      {
        error: "클릭 카운트 기록에 실패했습니다.",
        details: errorMsg,
      },
      { status: 500 }
    );
  }
}

