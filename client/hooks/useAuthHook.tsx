import { authService } from "@/app/services/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAlertStore } from "@/app/store/use-alert"; // Import your Zustand bridge
import { useUserCredentials } from "@/app/store/user-store";
import { AxiosError } from "axios";

interface signinPayload {
  userName: string;
  password: string;
}

export function useSignin() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newUserData: signinPayload) =>
      authService.signinUser(newUserData),

    onSuccess: () => {
      // Refresh user credentials cache
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Fire success notification
      showAlert("Welcome back!", "You have successfully logged in.", "success");
    },

    onError: (error) => {
      // Log the concrete error object for local troubleshooting
      console.error("Sign-in error payload:", error);

      // Parse server message string if it exists, otherwise fall back to safety text
      const serverMessage = "Incorrect email or password. Please try again.";

      // Fire error notification
      showAlert("Sign-in failed", serverMessage, "error");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      // Optional: Redirect to login page
      window.location.href = "/sign-in";
    },
  });
}

interface signupPayload {
  password: string;
  userName: string;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function useSignup() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newUserData: signupPayload) =>
      authService.createUser(newUserData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firmMembers"] });
      showAlert("success!", "You have created a user", "success");
    },

    onError: (error) => {
      const serverMessage = "Sign-up failed. Please try again.";
      showAlert("Sign-up failed", serverMessage, "error");
    },
  });
}

export function useGetMembersBy(p0?: { enabled: boolean }) {
  const result = useQuery({
    queryKey: ["firmMember"],
    queryFn: () => authService.getFirmMembers(),
    enabled: p0?.enabled ?? true,
  });
  return result;
}

interface useGetUsersByArrayPayload {
  userName: string;
  password: string;
  profileImg: string;
  role: string;
  lastLogin: Date;
  status: string;
  verificationToken: string;
  verificationTokenExpires: Date;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    extension?: string;
    officeLocation?: string;
    practiceAreas: string[];
  };
  // Billing and Productivity Configurations
  billing: {
    defaultHourlyRate: number; // Used by your Time Tracker
    targetBillableHoursAnnual?: number;
  };
}

export function useGetUsersByArray(data: useGetUsersByArrayPayload) {
  const result = useQuery({
    queryKey: ["users", data],
    queryFn: () => authService.getUsers(data),
  });
  return result;
}

export function useGetTeamMember() {
  const result = useQuery({
    queryKey: ["firmMembers"],
    queryFn: () => authService.getTeamMember(),
  });
  return result;
}

export function useGetInvitationById(id: string) {
  const result = useQuery({
    queryKey: ["invitation"],
    queryFn: () => authService.getUserInvitation(id),
  });
  return result;
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (userId: string) => authService.deleteTeamMember(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firmMembers"] });

      // Fire success notification
      showAlert("success!", "user has been removed.", "success");
    },

    onError: (error) => {
      console.error("Mutation Error:", error);

      const serverMessage = "somthing went wrong.";

      // Fire error notification
      showAlert("Operation failed", serverMessage, "error");
    },
  });
}

interface FirmMemberPayload {
  userName?: string; // 💡 Now optional
  profile?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    practiceAreas?: string[];
  };
  billing: {
    defaultHourlyRate?: number;
  };
}
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? T[P] // Preserve array types intact (e.g. string[])
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

export function useUpdateFirmMember() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);
  const setUserCredentials = useUserCredentials(
    (state) => state.setUserCredentials
  );

  return useMutation({
    // Accept DeepPartial here so callers can pass partial updates
    mutationFn: (data: DeepPartial<FirmMemberPayload>) =>
      authService.updateFirmMember(data),

    onSuccess: ({ data }) => {
      setUserCredentials(data.data);

      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });

      showAlert("Success!", "Your profile has been updated.", "success");
    },

    onError: (error) => {
      const serverMessage = "Operation failed!";

      showAlert("Operation failed!", serverMessage, "error");
    },
  });
}

interface JoinFirmPayload {
  userName?: string;
  password?: string;
  token?: string; // Or string if it is always guaranteed
}

export function useJoinfirmMember() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newuserData: JoinFirmPayload) =>
      authService.joinFirm(newuserData, newuserData?.token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Fire success notification
      showAlert("success!", "You user has been updated", "success");
    },

    onError: (error) => {
      const serverMessage = "Operation failed! Please try again.";
      showAlert("Operation failed!", serverMessage, "error");
    },
  });
}

interface CreateFirmPayload {
  name: string;
  country: string;
  practiceAreas: string[];
  workspace: string;
  logo?: File | undefined;
}

export function useCreateFirm() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  // No explicit generics needed here!
  return useMutation({
    mutationFn: (firmData: CreateFirmPayload) =>
      authService.createFirm(firmData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      showAlert("success!", "Your firm has been created", "success");
    },

    onError: (error) => {
      const serverMessage = "Operation failed! Please try again.";
      showAlert("Operation failed!", serverMessage, "error");
    },
  });
}
