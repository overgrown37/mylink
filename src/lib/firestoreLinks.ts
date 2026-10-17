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
  };
};

/**
 * Firestore (users/anonymous/links) 실시간 구독 (onSnapshot)
 * 컬렉션에 새 링크가 추가되거나 변경되면 실시간으로 콜백 호출
 */
export const subscribeLinksFromFirestore = (
  onNext: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  const linksCol = getLinksCollection();
  const q = query(linksCol, orderBy("order", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const links: LinkItem[] = snapshot.docs.map((d) =>
        docToLinkItem(d.id, d.data())
      );
      onNext(links);
    },
    (error) => {
      console.warn("Firestore onSnapshot error:", error);
      if (onError) onError(error);
    }
  );
};

/**
 * Firestore (users/anonymous/links) 1회성 링크 목록 조회 (getDocs)
 */
export const getLinksFromFirestore = async (): Promise<LinkItem[]> => {
  const linksCol = getLinksCollection();
  const q = query(linksCol, orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => docToLinkItem(d.id, d.data()));
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
