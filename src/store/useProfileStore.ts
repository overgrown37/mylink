import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfile, LinkItem, ThemeId } from "@/types/profile";
import mockProfileData from "@/data/mockProfile";

interface ProfileState {
  profile: UserProfile;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Actions
  setLinks: (links: LinkItem[]) => void;
  addLink: (link: Omit<LinkItem, "id" | "order">) => void;
  deleteLink: (id: string) => void;
  updateLink: (id: string, updated: Partial<LinkItem>) => void;
  setTheme: (themeId: ThemeId) => void;
  resetToMockData: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: mockProfileData,
      hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      setLinks: (links: LinkItem[]) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links,
            updatedAt: new Date().toISOString(),
          },
        })),

      addLink: (newLinkData) =>
        set((state) => {
          // Calculate max order or append to end
          const maxOrder = state.profile.links.reduce(
            (max, item) => Math.max(max, item.order),
            0
          );
          const newLink: LinkItem = {
            ...newLinkData,
            id: `link-${Date.now()}`,
            order: maxOrder + 1,
          };
          return {
            profile: {
              ...state.profile,
              links: [...state.profile.links, newLink],
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      deleteLink: (id: string) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.filter((l) => l.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),

      updateLink: (id: string, updated: Partial<LinkItem>) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.map((l) =>
              l.id === id ? { ...l, ...updated } : l
            ),
            updatedAt: new Date().toISOString(),
          },
        })),

      setTheme: (themeId: ThemeId) =>
        set((state) => ({
          profile: {
            ...state.profile,
            themeId,
            updatedAt: new Date().toISOString(),
          },
        })),

      resetToMockData: () =>
        set({
          profile: mockProfileData,
        }),
    }),
    {
      name: "mylink_profile_data", // LocalStorage Key specified in PRD
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
