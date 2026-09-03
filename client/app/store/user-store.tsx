import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/app/services/auth";
import type { FirmMember } from "@/features/combo-box/comboBox";

type UserStore = {
  user: Record<string, unknown>;
  members: FirmMember[];
  fetchMembers: () => Promise<void>;
  setUserCredentials: (newUser: Record<string, unknown>) => void;
};

export const useUserCredentials = create<UserStore>()(
  persist(
    (set, get) => ({
      user: {} as Record<string, unknown>,
      members: [] as FirmMember[],
      fetchMembers: async () => {
        const response = await authService.getFirmMembers();

        set({ members: response.data.response });
      },

      setUserCredentials: (newUser) => {
        const normalizedUser = {
          ...newUser,
          //   firmId:
          //     typeof newUser.firmId === "object"
          //       ? newUser.firmId?.toString?.() ?? String(newUser.firmId)
          //       : newUser.firmId,
        };

        set({ user: normalizedUser });
        get().fetchMembers();
      },
    }),
    { name: "user-storage" }
  )
);
