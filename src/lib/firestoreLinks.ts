import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import { LinkItem } from "@/types/profile";

/**
 * Firestore 컬렉션 경로: users/anonymous/links
 */
export const LINKS_COLLECTION_PATH = "users/anonymous/links";

export const getLinksCollection = () => {
  return collection(db, "users", "anonymous", "links");
};

/**
 * Firestore는 객체 내 `undefined` 값을 허용하지 않으므로 제거해 주는 헬퍼 함수
 */
const sanitizeForFirestore = <T extends Record<string, unknown>>(data: T): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
};

/**
 * Firestore 문서 데이터를 LinkItem 인터페이스로 변환
 */
const docToLinkItem = (id: string, data: DocumentData): LinkItem => {
  let createdAt: number | undefined;
  if (data.createdAt?.toMillis) {
    createdAt = data.createdAt.toMillis();
  } else if (data.createdAt?.seconds) {
    createdAt = data.createdAt.seconds * 1000;
  } else if (typeof data.createdAt === "number") {
    createdAt = data.createdAt;
  } else if (typeof data.createdAt === "string") {
    createdAt = new Date(data.createdAt).getTime();
  } else if (data.createdAt instanceof Date) {
    createdAt = data.createdAt.getTime();
  }

  return {
    id,
    type: data.type || "link",
    title: data.title || "",
    url: data.url,
    order: typeof data.order === "number" ? data.order : 0,
    subtitle: data.subtitle,
    icon: data.icon,
    badge: data.badge,
    isFeatured: data.isFeatured,
    category: data.category,
    createdAt,
  };
};

/**
 * Firestore (users/anonymous/links)에 새로운 링크 추가
 */
export const addLinkToFirestore = async (
  newLinkData: Omit<LinkItem, "id">
): Promise<LinkItem> => {
  const linksCol = getLinksCollection();
  const cleanData = sanitizeForFirestore({
    ...newLinkData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const docRef = await addDoc(linksCol, cleanData);
  return {
    ...newLinkData,
    id: docRef.id,
    createdAt: Date.now(),
  };
};

/**
 * Firestore (users/anonymous/links) 실시간 구독 (onSnapshot)
 * createdAt 기준 최신순 정렬 (내림차순)
 * 컬렉션에 새 링크가 추가되거나 변경되면 실시간으로 콜백 호출
 */
export const subscribeLinksFromFirestore = (
  onNext: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  const linksCol = getLinksCollection();
  // createdAt 기준 최신순 (내림차순 desc) 정렬
  const q = query(linksCol, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const links: LinkItem[] = snapshot.docs.map((d) =>
        docToLinkItem(d.id, d.data())
      );
      // 로컬 쓰기 직후(pending writes) createdAt이 비어있는 경우를 대비한 최신순 보정
      const sortedLinks = [...links].sort((a, b) => {
        if (a.createdAt !== undefined && b.createdAt !== undefined) {
          return Number(b.createdAt) - Number(a.createdAt);
        }
        if (a.createdAt !== undefined) return -1;
        if (b.createdAt !== undefined) return 1;
        return 0;
      });
      onNext(sortedLinks);
    },
    (error) => {
      console.warn("Firestore onSnapshot error:", error);
      if (onError) onError(error);
    }
  );
};

/**
 * Firestore (users/anonymous/links) 1회성 링크 목록 조회 (getDocs)
 * createdAt 기준 최신순 정렬
 */
export const getLinksFromFirestore = async (): Promise<LinkItem[]> => {
  const linksCol = getLinksCollection();
  const q = query(linksCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const links = snapshot.docs.map((d) => docToLinkItem(d.id, d.data()));
  return links.sort((a, b) => {
    if (a.createdAt !== undefined && b.createdAt !== undefined) {
      return Number(b.createdAt) - Number(a.createdAt);
    }
    if (a.createdAt !== undefined) return -1;
    if (b.createdAt !== undefined) return 1;
    return 0;
  });
};

/**
 * Firestore 링크 삭제
 */
export const deleteLinkFromFirestore = async (id: string): Promise<void> => {
  const docRef = doc(db, "users", "anonymous", "links", id);
  await deleteDoc(docRef);
};

/**
 * Firestore 링크 수정
 */
export const updateLinkInFirestore = async (
  id: string,
  updated: Partial<LinkItem>
): Promise<void> => {
  const docRef = doc(db, "users", "anonymous", "links", id);
  const cleanData = sanitizeForFirestore({
    ...updated,
    updatedAt: serverTimestamp(),
  });
  await updateDoc(docRef, cleanData);
};
