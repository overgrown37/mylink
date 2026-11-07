import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  limit,
  type Unsubscribe,
  type DocumentData,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";

export interface FirestoreUserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  handle: string;
  bio: string;
  createdAt?: number | string;
  updatedAt?: number | string;
}

/**
 * Firestore 문서 데이터를 FirestoreUserProfile 객체로 변환
 */
const docToUserProfile = (uid: string, data: DocumentData): FirestoreUserProfile => {
  return {
    uid,
    displayName: data.displayName || "마이링크 사용자",
    email: data.email || null,
    photoURL: data.photoURL || null,
    handle: data.handle || `@user_${uid.slice(0, 5)}`,
    bio: data.bio || "나만의 링크를 등록하고 관리해보세요.",
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt,
    updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : data.updatedAt,
  };
};

/**
 * Firestore users/{user.uid} 프로필을 조회하거나 없으면 자동 생성(Upsert)
 */
export const getOrCreateUserProfile = async (user: User): Promise<FirestoreUserProfile> => {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  const emailPrefix = user.email ? user.email.split("@")[0] : (user.displayName || user.uid.slice(0, 6));
  const defaultDisplayName = emailPrefix;
  const defaultHandle = `@${emailPrefix}`;
  const defaultBio = `${defaultDisplayName}님의 마이링크에 오신 것을 환영합니다!`;

  if (snap.exists()) {
    const existingData = snap.data();
    const updates: Record<string, unknown> = {};

    // photoURL은 Google 계정 변경 시 항상 최신값으로 동기화
    if (user.photoURL && existingData.photoURL !== user.photoURL) {
      updates.photoURL = user.photoURL;
    }

    // displayName: 사용자가 직접 수정한 적 없는 경우(= 초기값 또는 비어있는 경우)에만 이메일 prefix로 초기화
    // "profileUpdatedByUser" 플래그로 직접 수정 여부를 구분
    const isUserEditedProfile = existingData.profileUpdatedByUser === true;
    if (!isUserEditedProfile && !existingData.displayName) {
      updates.displayName = defaultDisplayName;
    }

    // bio: 아직 사용자가 수정하지 않았고, 현재 값이 기본 환영 메시지인 경우에만 이메일 prefix 반영
    if (
      !isUserEditedProfile &&
      (!existingData.bio || existingData.bio.includes("마이링크에 오신 것을 환영합니다"))
    ) {
      if (existingData.bio !== defaultBio) {
        updates.bio = defaultBio;
      }
    }

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = serverTimestamp();
      await updateDoc(userRef, updates).catch(() => {});
    }
    return docToUserProfile(user.uid, { ...existingData, ...updates });
  }

  const newProfile = {
    uid: user.uid,
    displayName: defaultDisplayName,
    email: user.email,
    photoURL: user.photoURL || null,
    handle: defaultHandle,
    bio: defaultBio,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, newProfile);

  return {
    ...newProfile,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

/**
 * users/{uid} 문서 실시간 구독
 */
export const subscribeUserProfile = (
  uid: string,
  onNext: (profile: FirestoreUserProfile | null) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  const userRef = doc(db, "users", uid);
  return onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onNext(docToUserProfile(uid, snapshot.data()));
      } else {
        onNext(null);
      }
    },
    (error) => {
      console.warn("Firestore subscribeUserProfile error:", error);
      if (onError) onError(error);
    }
  );
};

/**
 * 프로필 정보 업데이트
 * profileUpdatedByUser 플래그를 함께 저장하여 자동 덮어쓰기를 방지합니다.
 */
export const updateUserProfileInFirestore = async (
  uid: string,
  updates: Partial<Pick<FirestoreUserProfile, "displayName" | "bio" | "handle">>
): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...updates,
    profileUpdatedByUser: true,
    updatedAt: serverTimestamp(),
  });
};

/**
 * displayName 중복 여부 확인
 * @returns true = 사용 가능, false = 이미 사용 중
 */
export const checkDisplayNameAvailable = async (
  displayName: string,
  currentUid: string
): Promise<boolean> => {
  if (!displayName.trim()) return false;
  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("displayName", "==", displayName.trim()),
    limit(2)
  );
  const snapshot = await getDocs(q);
  // 결과가 없으면 사용 가능
  if (snapshot.empty) return true;
  // 결과가 오직 현재 본인의 문서 하나뿐이면 사용 가능
  if (snapshot.docs.length === 1 && snapshot.docs[0].id === currentUid) return true;
  return false;
};
