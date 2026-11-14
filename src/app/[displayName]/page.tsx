import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchUserByDisplayName } from "@/lib/userProfile";
import { getLinksFromFirestore } from "@/lib/firestoreLinks";
import { PublicProfileView } from "@/components/profile/PublicProfileView";
import { SITE_NAME } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ displayName: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { displayName } = await params;
  const decodedName = decodeURIComponent(displayName);
  const userProfile = await fetchUserByDisplayName(decodedName);

  if (!userProfile) {
    return {
      title: "프로필을 찾을 수 없습니다",
      description: "요청하신 마이링크 프로필 페이지가 존재하지 않거나 이동되었습니다.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const profilePath = `/${encodeURIComponent(userProfile.displayName)}`;
  const fullTitle = `${userProfile.displayName} (${userProfile.handle}) | ${SITE_NAME}`;
  const description =
    userProfile.bio || `${userProfile.displayName}님의 공식 멀티 링크 프로필입니다.`;

  return {
    title: {
      absolute: fullTitle,
    },
    description,
    keywords: [
      userProfile.displayName,
      userProfile.handle,
      "마이링크",
      "MyLink",
      "원링크",
      "프로필",
    ],
    alternates: {
      canonical: profilePath,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: profilePath,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
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
