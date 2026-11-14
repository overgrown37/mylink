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
  runTransaction,
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
 * 닉네임 정규화 함수: 대소문자 무시 및 공백 제거
 * 예: "Alice_Dev" -> "alice_dev"
 */
export const normalizeDisplayName = (name: string): string => {
  return name.trim().toLowerCase();
};

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
 * 신규 생성 시 displayNames 컬렉션에도 고유 닉네임 자동 선점
 */
export const getOrCreateUserProfile = async (user: User): Promise<FirestoreUserProfile> => {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  const emailPrefix = user.email ? user.email.split("@")[0] : (user.displayName || user.uid.slice(0, 6));

  if (snap.exists()) {
    const existingData = snap.data();
    const updates: Record<string, unknown> = {};

    // photoURL은 Google 계정 변경 시 항상 최신값으로 동기화
    if (user.photoURL && existingData.photoURL !== user.photoURL) {
      updates.photoURL = user.photoURL;
    }

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = serverTimestamp();
      await updateDoc(userRef, updates).catch(() => {});
    }

    // displayNames 컬렉션에 매핑이 누락되어 있다면 자동 동기화 (기존 가입자 마이그레이션)
    if (existingData.displayName) {
      const normalized = normalizeDisplayName(existingData.displayName);
      const nameRef = doc(db, "displayNames", normalized);
      getDoc(nameRef).then((nameSnap) => {
        if (!nameSnap.exists()) {
          setDoc(nameRef, {
            uid: user.uid,
            displayName: existingData.displayName,
            normalizedName: normalized,
            updatedAt: serverTimestamp(),
          }).catch(() => {});
        }
      });
    }

    return docToUserProfile(user.uid, { ...existingData, ...updates });
  }

  // ── 신규 가입자 초기 프로필 및 닉네임 생성 ──
  // 이메일 prefix가 이미 점유되어 있다면 충돌 방지를 위해 난수 접미사 추가
  let initialDisplayName = emailPrefix;
  let normalized = normalizeDisplayName(initialDisplayName);
  const existingNameSnap = await getDoc(doc(db, "displayNames", normalized));
  if (existingNameSnap.exists() && existingNameSnap.data().uid !== user.uid) {
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    initialDisplayName = `${emailPrefix}_${randomSuffix}`;
    normalized = normalizeDisplayName(initialDisplayName);
  }

  const defaultHandle = `@${initialDisplayName}`;
  const defaultBio = `${initialDisplayName}님의 마이링크에 오신 것을 환영합니다!`;

  const newProfile = {
    uid: user.uid,
    displayName: initialDisplayName,
    email: user.email,
    photoURL: user.photoURL || null,
    handle: defaultHandle,
    bio: defaultBio,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // 트랜잭션으로 displayNames 선점과 users 문서 생성을 원자적으로 실행
  try {
    await runTransaction(db, async (tx) => {
      const nameRef = doc(db, "displayNames", normalized);
      tx.set(nameRef, {
        uid: user.uid,
        displayName: initialDisplayName,
        normalizedName: normalized,
        updatedAt: serverTimestamp(),
      });
      tx.set(userRef, newProfile);
    });
  } catch {
    // 트랜잭션 폴백
    await setDoc(userRef, newProfile);
  }

  return {
    ...newProfile,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

/**
 * users/{uid} 문서 단발 조회 (TanStack Query용)
 */
export const fetchUserProfile = async (uid: string): Promise<FirestoreUserProfile | null> => {
  if (!uid) return null;
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  return docToUserProfile(uid, snap.data());
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
 * 프로필 정보 업데이트 (트랜잭션 기반 닉네임 100% 고유성 보장)
 * - 닉네임 변경 시: 기존 displayNames 문서 삭제(반환) + 새 displayNames 문서 선점 + users 문서 갱신
 * - 동시 저장 경쟁(Race condition) 시 0.001초 차이라도 먼저 도달한 유저만 성공하고 두 번째 유저는 실패
 */
export const updateUserProfileInFirestore = async (
  uid: string,
  updates: Partial<Pick<FirestoreUserProfile, "displayName" | "bio" | "handle">>
): Promise<void> => {
  const userRef = doc(db, "users", uid);

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) {
      throw new Error("사용자 정보를 찾을 수 없습니다.");
    }

    const existingData = userSnap.data();
    const oldDisplayName = existingData.displayName;
    const newDisplayName = updates.displayName?.trim();

    // 닉네임이 변경되는 경우: displayNames 고유 점유권 갱신
    if (newDisplayName && newDisplayName !== oldDisplayName) {
      const newNormalized = normalizeDisplayName(newDisplayName);
      const oldNormalized = oldDisplayName ? normalizeDisplayName(oldDisplayName) : null;

      const newNameRef = doc(db, "displayNames", newNormalized);
      const newNameSnap = await transaction.get(newNameRef);

      // 이미 다른 유저가 점유하고 있는 경우 원자적 차단
      if (newNameSnap.exists() && newNameSnap.data().uid !== uid) {
        throw new Error("이미 다른 사용자가 선점한 닉네임입니다. 다른 닉네임을 입력해 주세요.");
      }

      // 이전 닉네임 문서 삭제 (다른 사용자가 사용할 수 있도록 해제)
      if (oldNormalized && oldNormalized !== newNormalized) {
        const oldNameRef = doc(db, "displayNames", oldNormalized);
        transaction.delete(oldNameRef);
      }

      // 새 닉네임 문서 점유
      transaction.set(newNameRef, {
        uid,
        displayName: newDisplayName,
        normalizedName: newNormalized,
        updatedAt: serverTimestamp(),
      });
    }

    // users/{uid} 문서 갱신
    transaction.update(userRef, {
      ...updates,
      profileUpdatedByUser: true,
      updatedAt: serverTimestamp(),
    });
  });
};

/**
 * displayName으로 유저 프로필 조회 (공개 프로필 페이지용)
 * displayNames 단일 문서 O(1) 직접 조회 -> 없으면 기존 users 컬렉션 fallback
 * @returns 유저 프로필 또는 null
 */
export const fetchUserByDisplayName = async (
  displayName: string
): Promise<FirestoreUserProfile | null> => {
  const trimmed = displayName?.trim();
  if (!trimmed) return null;

  const normalized = normalizeDisplayName(trimmed);

  // 1. displayNames 컬렉션 O(1) 단일 키 조회 (빠르고 저렴)
  const nameDocRef = doc(db, "displayNames", normalized);
  const nameSnap = await getDoc(nameDocRef);

  if (nameSnap.exists()) {
    const targetUid = nameSnap.data().uid;
    if (targetUid) {
      return fetchUserProfile(targetUid);
    }
  }

  // 2. Fallback: displayNames 도입 이전 가입자를 위한 기존 쿼리 검색
  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("displayName", "==", trimmed),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const userDoc = snapshot.docs[0];
  return docToUserProfile(userDoc.id, userDoc.data());
};

/**
 * displayName 중복 여부 확인
 * displayNames 단일 문서 O(1) 조회로 검사 속도와 정확도 극대화
 * @returns true = 사용 가능, false = 이미 사용 중
 */
export const checkDisplayNameAvailable = async (
  displayName: string,
  currentUid: string
): Promise<boolean> => {
  const trimmed = displayName?.trim();
  if (!trimmed || trimmed.length < 2) return false;

  const normalized = normalizeDisplayName(trimmed);
  const nameDocRef = doc(db, "displayNames", normalized);
  const snapshot = await getDoc(nameDocRef);

  // 해당 닉네임 점유 문서가 없으면 사용 가능
  if (!snapshot.exists()) return true;

  // 본인이 이미 점유하고 있는 경우 사용 가능
  if (snapshot.data().uid === currentUid) return true;

  return false;
};
