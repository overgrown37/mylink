import { ImageResponse } from "next/og";
import { getOgFonts } from "@/lib/ogFont";
import { PRODUCTION_DOMAIN } from "@/lib/siteConfig";

export const alt = "마이링크 (MyLink) | 나만의 원링크 프로필";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const fonts = await getOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#0a0d3a",
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(88, 101, 242, 0.32), transparent 45%), radial-gradient(circle at 82% 80%, rgba(236, 72, 189, 0.25), transparent 45%), radial-gradient(circle at 55% 10%, rgba(53, 237, 126, 0.14), transparent 40%)",
          padding: "60px 68px",
          fontFamily: '"Pretendard", sans-serif',
          color: "#ffffff",
          position: "relative",
        }}
      >
        {/* Left Column: Brand & Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "630px",
            height: "100%",
          }}
        >
          {/* Top Brand Pill */}
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
                padding: "8px 18px",
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "2px",
                color: "#ffffff",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "9999px",
                  backgroundColor: "#35ed7e",
                }}
              />
              <span>MYLINK</span>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "18px",
                color: "rgba(255, 255, 255, 0.65)",
                fontWeight: 400,
              }}
            >
              나만의 스마트 원링크 프로필
            </div>
          </div>

          {/* Center Main Headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "58px",
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-1.5px",
              }}
            >
              <span>흩어진 모든 링크를</span>
              <span style={{ color: "#35ed7e" }}>단 하나의 공간에.</span>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "23px",
                color: "rgba(255, 255, 255, 0.72)",
                lineHeight: 1.5,
              }}
            >
              Google 3초 로그인 · 고유 주소 선점 · 실시간 클릭 통계 차트
            </div>
          </div>

          {/* Bottom Feature Pills */}
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
                gap: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: "14px",
                padding: "10px 18px",
                fontSize: "17px",
                color: "#35ed7e",
                fontWeight: 700,
              }}
            >
              <span>{PRODUCTION_DOMAIN}/닉네임</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: "14px",
                padding: "10px 18px",
                fontSize: "17px",
                color: "rgba(255, 255, 255, 0.85)",
              }}
            >
              <span>실시간 통계 /stat</span>
            </div>
          </div>
        </div>

        {/* Right Column: Stylish Mockup Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "390px",
            backgroundColor: "rgba(18, 22, 58, 0.92)",
            border: "2px solid rgba(88, 101, 242, 0.55)",
            borderRadius: "32px",
            padding: "28px",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.55)",
            gap: "16px",
          }}
        >
          {/* Mock Profile Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              paddingBottom: "14px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "58px",
                height: "58px",
                borderRadius: "9999px",
                backgroundImage: "linear-gradient(135deg, #5865f2, #ec48bd)",
                fontSize: "24px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              M
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span style={{ fontSize: "21px", fontWeight: 700 }}>Creator Studio</span>
              <span style={{ fontSize: "15px", color: "#35ed7e" }}>@mylink_official</span>
            </div>
          </div>

          {/* Mock Link Items */}
          {[
            { num: "01", accent: "#5865f2", title: "포트폴리오 & 프로젝트", featured: true, clicks: "128" },
            { num: "02", accent: "#35ed7e", title: "GitHub 오픈소스", featured: false, clicks: "64" },
            { num: "03", accent: "#ec48bd", title: "유튜브 & 기술 블로그", featured: false, clicks: "42" },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderRadius: "16px",
                backgroundColor: item.featured
                  ? "rgba(88, 101, 242, 0.25)"
                  : "rgba(30, 35, 83, 0.65)",
                border: item.featured
                  ? "1.5px solid #5865f2"
                  : "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "30px",
                    height: "30px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.07)",
                    border: `1.5px solid ${item.accent}`,
                    color: item.accent,
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {item.num}
                </div>
                <span style={{ fontSize: "16px", fontWeight: 700 }}>{item.title}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(53, 237, 126, 0.16)",
                  color: "#35ed7e",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                {item.clicks}
              </div>
            </div>
          ))}

          {/* Bottom Live Stat Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "10px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              fontSize: "15px",
            }}
          >
            <span style={{ color: "rgba(255, 255, 255, 0.55)" }}>실시간 누적 클릭</span>
            <span style={{ color: "#35ed7e", fontWeight: 700, fontSize: "18px" }}>
              234회
            </span>
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
