import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchUserByDisplayName } from "@/lib/userProfile";
import { getLinksFromFirestore } from "@/lib/firestoreLinks";
import { PublicProfileView } from "@/components/profile/PublicProfileView";

interface PageProps {
  params: Promise<{ displayName: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { displayName } = await params;
  const decodedName = decodeURIComponent(displayName);
  const userProfile = await fetchUserByDisplayName(decodedName);

  if (!userProfile) {
    return {
      title: "프로필을 찾을 수 없습니다 | 마이링크 (MyLink)",
    };
  }

  const title = `${userProfile.displayName} (${userProfile.handle}) | 마이링크`;
  const description =
    userProfile.bio || `${userProfile.displayName}님의 공식 멀티 링크 프로필입니다.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { displayName } = await params;
  const decodedName = decodeURIComponent(displayName);

  // Firestore에서 displayName으로 사용자 검색
  const userProfile = await fetchUserByDisplayName(decodedName);

  // 해당 사용자가 없으면 404 페이지로 전환
  if (!userProfile) {
    notFound();
  }

  // users/{uid}/links 컬렉션에서 링크 목록 로드
  const links = await getLinksFromFirestore(userProfile.uid);

  return <PublicProfileView profile={userProfile} links={links} />;
}
