import { ImageResponse } from "next/og";
import { fetchUserByDisplayName } from "@/lib/userProfile";
import { getLinksFromFirestore } from "@/lib/firestoreLinks";
import { getOgFonts, fetchSafeAvatarDataUri } from "@/lib/ogFont";
import { PRODUCTION_DOMAIN } from "@/lib/siteConfig";

export const alt = "마이링크 (MyLink) 공개 프로필";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface Props {
  params: Promise<{ displayName: string }>;
}

export default async function DynamicProfileOpenGraphImage({ params }: Props) {
  const { displayName } = await params;
  const decodedName = decodeURIComponent(displayName);

  const [fonts, userProfile] = await Promise.all([
    getOgFonts(),
    fetchUserByDisplayName(decodedName),
  ]);

  // 프로필이 없는 경우 깔끔한 폴백 OG 이미지 반환
  if (!userProfile) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0d3a",
            backgroundImage:
              "radial-gradient(circle at 50% 30%, rgba(88, 101, 242, 0.28), transparent 60%)",
            fontFamily: '"Pretendard", sans-serif',
            color: "#ffffff",
            gap: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(88, 101, 242, 0.22)",
              border: "1.5px solid rgba(88, 101, 242, 0.55)",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "2px",
            }}
          >
            <span>MYLINK</span>
          </div>
          <div style={{ fontSize: "44px", fontWeight: 700 }}>
            프로필을 찾을 수 없습니다
          </div>
          <div style={{ fontSize: "22px", color: "rgba(255,255,255,0.6)" }}>
            @{decodedName}
          </div>
        </div>
      ),
      {
        ...size,
        fonts: fonts.length > 0 ? fonts : undefined,
      }
    );
  }

  const [allLinks, avatarDataUri] = await Promise.all([
    getLinksFromFirestore(userProfile.uid),
    fetchSafeAvatarDataUri(userProfile.photoURL),
  ]);

  const validLinks = allLinks.filter((l) => l.type === "link");
  const totalClicks = validLinks.reduce((sum, l) => sum + (l.clicks || 0), 0);

  const safeDisplayName =
    userProfile.displayName.length > 22
      ? `${userProfile.displayName.slice(0, 22)}…`
      : userProfile.displayName;

  const safeBio =
    userProfile.bio && userProfile.bio.length > 90
      ? `${userProfile.bio.slice(0, 90)}…`
      : userProfile.bio || "나만의 링크를 한곳에서 만나보세요.";

  const initialChar = userProfile.displayName.trim().charAt(0).toUpperCase() || "M";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0d3a",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(88, 101, 242, 0.36), transparent 48%), radial-gradient(circle at 82% 80%, rgba(236, 72, 189, 0.3), transparent 48%), radial-gradient(circle at 50% 92%, rgba(53, 237, 126, 0.16), transparent 46%)",
          padding: "44px 56px",
          fontFamily: '"Pretendard", sans-serif',
          color: "#ffffff",
        }}
      >
        {/* Centered Glass Profile Card */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "rgba(18, 22, 58, 0.88)",
            border: "2px solid rgba(88, 101, 242, 0.48)",
            borderRadius: "36px",
            padding: "40px 52px",
            boxShadow: "0 24px 70px rgba(0, 0, 0, 0.55)",
          }}
        >
          {/* Top Bar: Brand & Profile URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(88, 101, 242, 0.22)",
                border: "1.5px solid rgba(88, 101, 242, 0.55)",
                borderRadius: "9999px",
                padding: "7px 18px",
                fontSize: "17px",
                fontWeight: 700,
                letterSpacing: "2px",
              }}
            >
              <div
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "9999px",
                  backgroundColor: "#35ed7e",
                }}
              />
              <span>MYLINK</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: "9999px",
                padding: "7px 18px",
                fontSize: "17px",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              <span>{PRODUCTION_DOMAIN}/</span>
              <span style={{ color: "#35ed7e", fontWeight: 700 }}>
                {userProfile.displayName}
              </span>
            </div>
          </div>

          {/* Center Hero: Avatar + Name + Handle + Bio */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "18px",
            }}
          >
            {/* Avatar with Gradient Ring */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "136px",
                height: "136px",
                borderRadius: "9999px",
                backgroundImage: "linear-gradient(135deg, #5865f2, #35ed7e, #ec48bd)",
                padding: "4px",
                position: "relative",
              }}
            >
              {avatarDataUri ? (
                <img
                  src={avatarDataUri}
                  alt={userProfile.displayName}
                  width={128}
                  height={128}
                  style={{
                    width: "128px",
                    height: "128px",
                    borderRadius: "9999px",
                    objectFit: "cover",
                    backgroundColor: "#161b4e",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "128px",
                    height: "128px",
                    borderRadius: "9999px",
                    backgroundColor: "#161b4e",
                    fontSize: "52px",
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  {initialChar}
                </div>
              )}

              {/* Verified Badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: "2px",
                  right: "2px",
                  width: "34px",
                  height: "34px",
                  borderRadius: "9999px",
                  backgroundColor: "#35ed7e",
                  border: "3px solid #12163a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0a0d3a",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                ✓
              </div>
            </div>

            {/* Name & Handle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "52px",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-1.2px",
                }}
              >
                {safeDisplayName}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(53, 237, 126, 0.14)",
                  border: "1px solid rgba(53, 237, 126, 0.38)",
                  borderRadius: "12px",
                  padding: "6px 16px",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#35ed7e",
                }}
              >
                {userProfile.handle}
              </div>
            </div>

            {/* Bio */}
            <div
              style={{
                display: "flex",
                fontSize: "24px",
                color: "rgba(255, 255, 255, 0.74)",
                lineHeight: 1.45,
                maxWidth: "820px",
                textAlign: "center",
              }}
            >
              {safeBio}
            </div>
          </div>

          {/* Bottom Bar: Stats & CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingTop: "18px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: "12px",
                  padding: "8px 16px",
                  fontSize: "17px",
                  color: "rgba(255, 255, 255, 0.88)",
                  fontWeight: 700,
                }}
              >
                <span style={{ color: "#5865f2" }}>●</span>
                <span>등록된 링크 {validLinks.length}개</span>
              </div>

              {totalClicks > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "rgba(53, 237, 126, 0.12)",
                    border: "1px solid rgba(53, 237, 126, 0.34)",
                    borderRadius: "12px",
                    padding: "8px 16px",
                    fontSize: "17px",
                    color: "#35ed7e",
                    fontWeight: 700,
                  }}
                >
                  <span>누적 클릭 {totalClicks.toLocaleString()}회</span>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#5865f2",
                borderRadius: "12px",
                padding: "9px 20px",
                fontSize: "17px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              <span>프로필 방문하기 ↗</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );
}
