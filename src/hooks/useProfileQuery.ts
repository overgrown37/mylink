import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserProfile,
  updateUserProfileInFirestore,
  type FirestoreUserProfile,
} from "@/lib/userProfile";
import { useAuthStore } from "@/store/useAuthStore";
import { trackEvent } from "@/lib/firebase";

export const profileQueryKey = (uid?: string) => ["profile", uid] as const;

export interface UpdateProfileParams {
  uid: string;
  updates: Partial<Pick<FirestoreUserProfile, "displayName" | "bio" | "handle">>;
}

/**
 * 사용자 프로필 단발 조회 및 캐싱 훅
 */
export function useProfileQuery(uid?: string) {
  return useQuery({
    queryKey: profileQueryKey(uid),
    queryFn: () => (uid ? fetchUserProfile(uid) : null),
    enabled: Boolean(uid),
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 유지
  });
}

/**
 * 프로필 업데이트 훅 (낙관적 업데이트 적용, 실시간 리스너 미사용)
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uid, updates }: UpdateProfileParams) => {
      await updateUserProfileInFirestore(uid, updates);
      return updates;
    },
    // ── 낙관적 업데이트 (Optimistic Update) ──
    onMutate: async ({ uid, updates }) => {
      // 1. 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: profileQueryKey(uid) });

      // 2. 롤백용 이전 프로필 스냅샷 보관
      const previousProfile = queryClient.getQueryData<FirestoreUserProfile | null>(
        profileQueryKey(uid)
      );

      // 3. UI에 즉시 반영할 낙관적 프로필 객체 생성 및 캐시 주입 (0ms 지연)
      if (previousProfile) {
        const optimisticProfile: FirestoreUserProfile = {
          ...previousProfile,
          ...updates,
          updatedAt: Date.now(),
        };
        queryClient.setQueryData(profileQueryKey(uid), optimisticProfile);
        // useAuthStore 상태도 즉시 동기화
        useAuthStore.getState().setUserProfile(optimisticProfile);
      }

      return { previousProfile, uid };
    },
    // 에러 발생 시 이전 상태로 자동 롤백
    onError: (err, variables, context) => {
      console.error("프로필 업데이트 실패, 이전 상태로 롤백합니다:", err);
      if (context?.previousProfile) {
        queryClient.setQueryData(profileQueryKey(context.uid), context.previousProfile);
        useAuthStore.getState().setUserProfile(context.previousProfile);
      }
    },
    // 성공 시 또는 에러 처리 후 최종 캐시 무결성 검증
    onSettled: (_data, _error, variables) => {
      if (variables?.uid) {
        queryClient.invalidateQueries({ queryKey: profileQueryKey(variables.uid) });
      }
    },
    onSuccess: (_data, variables) => {
      trackEvent("profile_updated", { uid: variables.uid });
    },
  });
}

