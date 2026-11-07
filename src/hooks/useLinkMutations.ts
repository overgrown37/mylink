import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addLinkToFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
} from "@/lib/firestoreLinks";
import { useProfileStore } from "@/store/useProfileStore";
import { trackEvent } from "@/lib/firebase";
import { LinkItem } from "@/types/profile";

export const linksQueryKey = (uid?: string) => ["links", uid] as const;

/**
 * 새 링크 추가 뮤테이션 (TanStack Query)
 */
export function useAddLinkMutation() {
  const queryClient = useQueryClient();
  const addLink = useProfileStore((state) => state.addLink);

  return useMutation({
    mutationFn: async ({
      linkData,
      uid,
    }: {
      linkData: Omit<LinkItem, "id">;
      uid?: string;
    }) => {
      const savedLink = await addLinkToFirestore(linkData, uid);
      return { savedLink, uid };
    },
    onSuccess: ({ savedLink, uid }) => {
      // 로컬 Zustand 스토어 및 TanStack Query 캐시 동기화
      addLink(savedLink);
      trackEvent("link_added", { title: savedLink.title, url: savedLink.url });
      queryClient.invalidateQueries({ queryKey: linksQueryKey(uid) });
    },
  });
}

/**
 * 링크 수정 뮤테이션 (TanStack Query)
 */
export function useUpdateLinkMutation() {
  const queryClient = useQueryClient();
  const updateLink = useProfileStore((state) => state.updateLink);

  return useMutation({
    mutationFn: async ({
      id,
      updates,
      uid,
    }: {
      id: string;
      updates: Partial<Omit<LinkItem, "id">>;
      uid?: string;
    }) => {
      await updateLinkInFirestore(id, updates, uid);
      return { id, updates, uid };
    },
    onSuccess: ({ id, updates, uid }) => {
      updateLink(id, updates);
      queryClient.invalidateQueries({ queryKey: linksQueryKey(uid) });
    },
  });
}

/**
 * 링크 삭제 뮤테이션 (TanStack Query)
 */
export function useDeleteLinkMutation() {
  const queryClient = useQueryClient();
  const deleteLink = useProfileStore((state) => state.deleteLink);

  return useMutation({
    mutationFn: async ({ id, uid }: { id: string; uid?: string }) => {
      await deleteLinkFromFirestore(id, uid);
      return { id, uid };
    },
    onSuccess: ({ id, uid }) => {
      deleteLink(id);
      trackEvent("link_deleted", { linkId: id });
      queryClient.invalidateQueries({ queryKey: linksQueryKey(uid) });
    },
  });
}

