import { notFound } from "next/navigation";
import { fetchUserByDisplayName } from "@/lib/userProfile";
import { getLinksFromFirestore } from "@/lib/firestoreLinks";
import { PublicProfileView } from "@/components/profile/PublicProfileView";

interface PageProps {
  params: Promise<{ displayName: string }>;
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
