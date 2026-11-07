import { create } from "zustand";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { auth, googleProvider, trackEvent } from "@/lib/firebase";
import {
  getOrCreateUserProfile,
  subscribeUserProfile,
  type FirestoreUserProfile,
} from "@/lib/userProfile";

interface AuthState {
  user: User | null;
  userProfile: FirestoreUserProfile | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  error: string | null;
  hasInitialized: boolean;

  // Actions
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUserProfile: (profile: FirestoreUserProfile | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userProfile: null,
  isLoading: true,
  isAuthenticating: false,
  error: null,
  hasInitialized: false,

  setUserProfile: (profile) => set({ userProfile: profile }),
  clearError: () => set({ error: null }),

  loginWithGoogle: async () => {
    set({ isAuthenticating: true, error: null });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Firestore users/{uid} 프로필 가져오기 또는 생성
      const profile = await getOrCreateUserProfile(user);

      set({
        user,
        userProfile: profile,
        isAuthenticating: false,
      });

      trackEvent("login_success", {
        method: "google",
        uid: user.uid,
      });
      return;
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      const isUserCancellation =
        firebaseError?.code === "auth/popup-closed-by-user" ||
        firebaseError?.code === "auth/cancelled-popup-request";

      // 사용자가 팝업 창을 닫았거나 요청을 직접 취소한 경우: 에러 없이 대기 상태만 초기화
      if (isUserCancellation) {
        set({ isAuthenticating: false, error: null });
        return;
      }

      // 팝업 차단 또는 네트워크 에러 등 사용자 피드백이 필요한 경우
      let friendlyMessage = "Google 로그인 중 문제가 발생했습니다.";
      if (firebaseError?.code === "auth/popup-blocked") {
        friendlyMessage = "브라우저에 의해 로그인 팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해 주세요.";
      } else if (firebaseError?.code === "auth/network-request-failed") {
        friendlyMessage = "네트워크 연결이 불안정합니다. 인터넷 연결을 확인해 주세요.";
      } else if (err instanceof Error) {
        friendlyMessage = err.message;
      }

      console.warn("Google 로그인 중단/오류:", firebaseError?.code || err);
      set({ error: friendlyMessage, isAuthenticating: false });
      return;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await signOut(auth);
      set({
        user: null,
        userProfile: null,
        isLoading: false,
      });
      trackEvent("logout_success");
    } catch (err: unknown) {
      console.error("로그아웃 실패:", err);
      set({ isLoading: false });
    }
  },
}));

// SSR 안전한 Auth 상태 초기화 리스너 등록 헬퍼
let isListenerAttached = false;
let profileUnsubscribe: (() => void) | null = null;

export const initAuthListener = () => {
  if (typeof window === "undefined" || isListenerAttached) {
    return () => {};
  }

  isListenerAttached = true;

  const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
    // 기존 프로필 구독 해제
    if (profileUnsubscribe) {
      profileUnsubscribe();
      profileUnsubscribe = null;
    }

    if (firebaseUser) {
      try {
        // 프로필 정보 동기화
        const profile = await getOrCreateUserProfile(firebaseUser);
        useAuthStore.setState({
          user: firebaseUser,
          userProfile: profile,
          isLoading: false,
          hasInitialized: true,
        });

        // 프로필 실시간 구독
        profileUnsubscribe = subscribeUserProfile(
          firebaseUser.uid,
          (updatedProfile) => {
            if (updatedProfile) {
              useAuthStore.setState({ userProfile: updatedProfile });
            }
          }
        );
      } catch (err) {
        console.warn("사용자 프로필 동기화 오류:", err);
        useAuthStore.setState({
          user: firebaseUser,
          isLoading: false,
          hasInitialized: true,
        });
      }
    } else {
      useAuthStore.setState({
        user: null,
        userProfile: null,
        isLoading: false,
        hasInitialized: true,
      });
    }
  });

  return () => {
    if (profileUnsubscribe) profileUnsubscribe();
    unsubscribeAuth();
    isListenerAttached = false;
  };
};
