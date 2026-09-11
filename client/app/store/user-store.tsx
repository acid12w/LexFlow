import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/app/services/auth";
import type { FirmMember } from "@/features/combo-box/comboBox";

// 1. Strongly Typed User Structures
export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  practiceAreas?: string[];
}

export interface UserBilling {
  defaultHourlyRate?: number;
}

export interface UserData {
  _id?: string;
  userName?: string;
  role?: string;
  firmId?: string;
  profile?: UserProfile;
  billing?: UserBilling;
  [key: string]: unknown; // Allows unexpected optional keys from API without throwing TS errors
}

// 2. Zustand Store Interface
type UserStore = {
  user: UserData | null;
  members: FirmMember[];
  fetchMembers: () => Promise<void>;
  setUserCredentials: (newUser: UserData) => void;
};

// 3. Store Implementation
export const useUserCredentials = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      members: [],

      fetchMembers: async () => {
        try {
          const response = await authService.getFirmMembers();
          set({ members: response.data.response });
        } catch (error) {
          console.error("Failed to fetch firm members:", error);
        }
      },

      setUserCredentials: (newUser) => {
        const normalizedUser: UserData = {
          ...newUser,
          firmId:
            typeof newUser.firmId === "object" && newUser.firmId !== null
              ? String(newUser.firmId)
              : newUser.firmId,
        };

        set({ user: normalizedUser });
        get().fetchMembers();
      },
    }),
    { name: "user-storage" }
  )
);
