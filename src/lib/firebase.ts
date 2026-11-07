import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type Auth, type User } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, logEvent, type Analytics } from "firebase/analytics";

/**
 * Firebase 클라이언트 환경 설정
 * .env.local의 환경 변수를 우선 사용하며, 개발 편의성을 위해 fallback 값을 제공합니다.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAw6--ZgGi7ghDfP1yPtqbZZN1OpaAEVFA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "my-link-project-49e05.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "my-link-project-49e05",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "my-link-project-49e05.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "311995275705",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:311995275705:web:b4695c21b4edb9d4d3be68",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-2SNWXKHZKK",
};

/**
 * Firebase App 싱글톤 초기화
 * Next.js 개발 중 Fast Refresh나 재랜더링 시 중복 초기화되는 문제를 방지합니다.
 */
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/**
 * 주요 Firebase 서비스 인스턴스 (인증, 데이터베이스, 스토리지)
 */
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export { GoogleAuthProvider, signInWithPopup, signOut, type User };

/**
 * Next.js SSR 환경 대응 안전한 Analytics 초기화
 * Firebase Analytics는 브라우저 환경(window 객체)에서만 실행 가능합니다.
 */
let analyticsPromise: Promise<Analytics | null> | null = null;

export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") return null;

  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((supported) => (supported ? getAnalytics(app) : null))
      .catch(() => null);
  }

  return analyticsPromise;
};

/**
 * 간편한 이벤트 로깅 헬퍼 함수
 */
export const trackEvent = async (eventName: string, eventParams?: Record<string, unknown>) => {
  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch {
    // Analytics 오류는 애플리케이션 실행을 방해하지 않도록 처리
  }
};

export default app;
