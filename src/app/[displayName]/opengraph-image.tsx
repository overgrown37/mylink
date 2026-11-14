import { ImageResponse } from "next/og";
import { fetchUserByDisplayName } from "@/lib/userProfile";
import { getLinksFromFirestore } from "@/lib/firestoreLinks";
import { getOgFonts, fetchSafeAvatarDataUri } from "@/lib/ogFont";

export const alt = "마이링크 (MyLink) 공개 프로필";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface Props {
  params: Promise<{ displayName: string }>;
}

const LINK_ACCENTS = ["#5865f2", "#35ed7e", "#ec48bd", "#06b6d4"];

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
            fontFamily: '"Noto Sans KR", sans-serif',
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
  const topLinks = validLinks.slice(0, 4);
  const totalClicks = validLinks.reduce((sum, l) => sum + (l.clicks || 0), 0);

  const safeDisplayName =
    userProfile.displayName.length > 18
      ? `${userProfile.displayName.slice(0, 18)}…`
      : userProfile.displayName;

  const safeBio =
    userProfile.bio && userProfile.bio.length > 74
      ? `${userProfile.bio.slice(0, 74)}…`
      : userProfile.bio || "나만의 링크를 한곳에서 만나보세요.";

  const initialChar = userProfile.displayName.trim().charAt(0).toUpperCase() || "M";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          backgroundColor: "#0a0d3a",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(88, 101, 242, 0.36), transparent 46%), radial-gradient(circle at 85% 82%, rgba(236, 72, 189, 0.28), transparent 46%), radial-gradient(circle at 50% 90%, rgba(53, 237, 126, 0.14), transparent 45%)",
          padding: "52px 60px",
          fontFamily: '"Noto Sans KR", sans-serif',
          color: "#ffffff",
          gap: "44px",
        }}
      >
        {/* Left Column: User Profile Identity */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "540px",
            height: "100%",
          }}
        >
          {/* Top Brand Tag */}
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
                backgroundColor: "rgba(88, 101, 242, 0.22)",
                border: "1.5px solid rgba(88, 101, 242, 0.55)",
                borderRadius: "9999px",
                padding: "7px 16px",
                fontSize: "16px",
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
            <span
              style={{
                fontSize: "17px",
                color: "rgba(255, 255, 255, 0.55)",
              }}
            >
              공식 프로필
            </span>
          </div>

          {/* Center Profile Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {/* Avatar with Gradient Ring */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "112px",
                  height: "112px",
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
                    width={104}
                    height={104}
                    style={{
                      width: "104px",
                      height: "104px",
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
                      width: "104px",
                      height: "104px",
                      borderRadius: "9999px",
                      backgroundColor: "#161b4e",
                      fontSize: "42px",
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    {initialChar}
                  </div>
                )}

                {/* Verified Dot */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "9999px",
                    backgroundColor: "#35ed7e",
                    border: "3px solid #0a0d3a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0a0d3a",
                    fontSize: "15px",
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
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "44px",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: "-1px",
                  }}
                >
                  {safeDisplayName}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    alignSelf: "flex-start",
                    backgroundColor: "rgba(53, 237, 126, 0.14)",
                    border: "1px solid rgba(53, 237, 126, 0.35)",
                    borderRadius: "10px",
                    padding: "4px 12px",
                    fontSize: "19px",
                    fontWeight: 700,
                    color: "#35ed7e",
                  }}
                >
                  {userProfile.handle}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div
              style={{
                display: "flex",
                fontSize: "22px",
                color: "rgba(255, 255, 255, 0.78)",
                lineHeight: 1.5,
                marginTop: "4px",
              }}
            >
              {safeBio}
            </div>
          </div>

          {/* Bottom Metadata Bar */}
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
                padding: "9px 16px",
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.85)",
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
                  border: "1px solid rgba(53, 237, 126, 0.32)",
                  borderRadius: "12px",
                  padding: "9px 16px",
                  fontSize: "16px",
                  color: "#35ed7e",
                  fontWeight: 700,
                }}
              >
                <span>누적 클릭 {totalClicks.toLocaleString()}회</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Link Stack Preview */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "496px",
            backgroundColor: "rgba(18, 22, 58, 0.9)",
            border: "2px solid rgba(88, 101, 242, 0.45)",
            borderRadius: "30px",
            padding: "28px",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.55)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "14px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.65)",
            }}
          >
            <span style={{ fontWeight: 700, color: "#ffffff" }}>주요 링크 바로가기</span>
            <span style={{ color: "#35ed7e", fontSize: "14px", fontWeight: 700 }}>
              LIVE LINKS
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "16px",
              marginBottom: "16px",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {topLinks.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 20px",
                  borderRadius: "18px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "18px",
                }}
              >
                <span>프로필 페이지를 방문해 보세요</span>
              </div>
            ) : (
              topLinks.map((item, idx) => {
                const accent = LINK_ACCENTS[idx % LINK_ACCENTS.length];
                const titleText =
                  item.title.length > 22 ? `${item.title.slice(0, 22)}…` : item.title;

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 18px",
                      borderRadius: "16px",
                      backgroundColor: item.isFeatured
                        ? "rgba(88, 101, 242, 0.25)"
                        : "rgba(30, 35, 83, 0.65)",
                      border: item.isFeatured
                        ? "1.5px solid #5865f2"
                        : "1px solid rgba(255, 255, 255, 0.12)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          backgroundColor: "rgba(255, 255, 255, 0.07)",
                          border: `1.5px solid ${accent}`,
                          fontSize: "15px",
                          fontWeight: 700,
                          color: accent,
                        }}
                      >
                        {idx + 1}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>
                            {titleText}
                          </span>
                          {item.isFeatured && (
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                backgroundColor: "rgba(236, 72, 189, 0.25)",
                                color: "#ec48bd",
                                padding: "2px 7px",
                                borderRadius: "6px",
                              }}
                            >
                              PICK
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "rgba(255, 255, 255, 0.45)",
                      }}
                    >
                      →
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom URL Watermark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              fontSize: "15px",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <span>mylink.app/{userProfile.displayName}</span>
            <span style={{ color: "#35ed7e", fontWeight: 700 }}>방문하기 ↗</span>
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
