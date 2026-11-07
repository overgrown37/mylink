import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { addLinkToFirestore, getLinksFromFirestore } from "./src/lib/firestoreLinks";

async function seed() {
  console.log("Checking existing links in Firestore...");
  const existingLinks = await getLinksFromFirestore();
  console.log(`Current existing links in Firestore: ${existingLinks.length}`);

  const sampleLinks = [
    {
      type: "link" as const,
      title: "GitHub 프로필",
      url: "https://github.com",
      subtitle: "오픈소스 프로젝트와 다양한 코드 저장소",
      icon: "🚀",
      badge: "HOT",
      isFeatured: true,
      order: 1,
      category: "custom",
    },
    {
      type: "link" as const,
      title: "개발 블로그 (Velog)",
      url: "https://velog.io",
      subtitle: "배운 것을 기록하고 나누는 개발 일지",
      icon: "📝",
      badge: "NEW",
      order: 2,
      category: "custom",
    },
    {
      type: "link" as const,
      title: "노션 포트폴리오",
      url: "https://notion.so",
      subtitle: "진행했던 주요 프로젝트와 이력서",
      icon: "✨",
      order: 3,
      category: "custom",
    },
    {
      type: "link" as const,
      title: "1:1 커피챗 & 문의",
      url: "mailto:hello@example.com",
      subtitle: "궁금한 점이나 협업 제안은 언제든 환영합니다",
      icon: "☕",
      order: 4,
      category: "custom",
    },
  ];

  console.log("Adding default links to Firestore (users/anonymous/links)...");
  for (const link of sampleLinks) {
    const res = await addLinkToFirestore(link);
    console.log(`✓ Added: ${res.title} (ID: ${res.id})`);
  }

  console.log("Seeding completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
