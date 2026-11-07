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
import { db, auth } from "./firebase";
import { LinkItem } from "@/types/profile";

/**
 * 활성 사용자 ID 확인 헬퍼
 */
export const resolveUserId = (uid?: string): string => {
  return uid || auth.currentUser?.uid || "anonymous";
};

/**
 * Firestore 컬렉션 경로: users/{userKey}/links
 */
export const getLinksCollection = (uid?: string) => {
  const userKey = resolveUserId(uid);
  return collection(db, "users", userKey, "links");
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
 * Firestore (users/{uid}/links)에 새로운 링크 추가
 */
export const addLinkToFirestore = async (
  newLinkData: Omit<LinkItem, "id">,
  uid?: string
): Promise<LinkItem> => {
  const linksCol = getLinksCollection(uid);
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
 * Firestore (users/{uid}/links) 실시간 구독 (onSnapshot)
 * createdAt 기준 최신순 정렬 (내림차순)
 */
export const subscribeLinksFromFirestore = (
  onNext: (links: LinkItem[]) => void,
  onError?: (error: Error) => void,
  uid?: string
): Unsubscribe => {
  const linksCol = getLinksCollection(uid);
  const q = query(linksCol, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const links: LinkItem[] = snapshot.docs.map((d) =>
        docToLinkItem(d.id, d.data())
      );
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
 * Firestore (users/{uid}/links) 1회성 링크 목록 조회 (getDocs)
 */
export const getLinksFromFirestore = async (uid?: string): Promise<LinkItem[]> => {
  const linksCol = getLinksCollection(uid);
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
export const deleteLinkFromFirestore = async (id: string, uid?: string): Promise<void> => {
  const userKey = resolveUserId(uid);
  const docRef = doc(db, "users", userKey, "links", id);
  await deleteDoc(docRef);
};

/**
 * Firestore 링크 수정
 */
export const updateLinkInFirestore = async (
  id: string,
  updated: Partial<LinkItem>,
  uid?: string
): Promise<void> => {
  const userKey = resolveUserId(uid);
  const docRef = doc(db, "users", userKey, "links", id);
  const cleanData = sanitizeForFirestore({
    ...updated,
    updatedAt: serverTimestamp(),
  });
  await updateDoc(docRef, cleanData);
};
