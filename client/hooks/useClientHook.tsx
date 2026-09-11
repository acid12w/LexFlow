import { clientService } from "@/app/services/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAlertStore } from "@/app/store/use-alert"; // Import your Zustand bridge
import { useUserCredentials } from "@/app/store/user-store";
import { AxiosError } from "axios";
import { authService } from "@/app/services/auth";

interface newUserDataPayload {
  userName: string;
  password: string;
  company?: string;
  inviteFirmId?: string;
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
    mutationFn: (newUserData: newUserDataPayload) =>
      authService.createUser(newUserData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firmMembers"] });
      showAlert("success!", "You have created a user", "success");
    },

    onError: (error: AxiosError<{ error?: string; message?: string }>) => {
      const serverMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Sign-up failed. Please try again.";
      showAlert("Sign-up failed", serverMessage, "error");
    },
  });
}

// export function useGetClientById(id: string) {
//   const result = useQuery({
//     queryKey: ["client"],
//     queryFn: () => clientService.getClientById(id),
//   });
//   return result;
// }

export function useGetAllClients() {
  const result = useQuery({
    queryKey: ["clients"],
    queryFn: () => clientService.getAllClients(),
  });
  return result;
}

export function useGetMilestone(clientId: string) {
  const result = useQuery({
    queryKey: ["clients"],
    queryFn: () => clientService.getMilestone(clientId),
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

    onError: (error: AxiosError<{ error?: string; message?: string }>) => {
      console.error("Mutation Error:", error);

      const serverMessage =
        error?.response?.data?.message || "somthing went wrong.";

      // Fire error notification
      showAlert("Operation failed", serverMessage, "error");
    },
  });
}

export function useUpdateFirmMember() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  const setUserCredentials = useUserCredentials(
    (state) => state.setUserCredentials
  );

  return useMutation({
    mutationFn: (data) => authService.updateFirmMember(data),

    onSuccess: ({ data }) => {
      console.log(data.data);
      setUserCredentials(data.data);

      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });

      showAlert("Success!", "Your profile has been updated.", "success");
    },

    onError: (error: AxiosError<{ error?: string; message?: string }>) => {
      const serverMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Operation failed!";

      showAlert("Operation failed!", serverMessage, "error");
    },
  });
}

interface useJoinfirmMemberPayload {
  token: string;
}

export function useJoinfirmMember() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newuserData: useJoinfirmMemberPayload) =>
      authService.joinFirm(newuserData, newuserData.token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Fire success notification
      showAlert("success!", "You user has been updated", "success");
    },

    onError: (error: AxiosError<{ error?: string; message?: string }>) => {
      const serverMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Operation failed! Please try again.";
      showAlert("Operation failed!", serverMessage, "error");
    },
  });
}

export function useCreateFirm() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (firmData) => authService.createFirm(firmData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Fire success notification
      showAlert("success!", "You user has been updated", "success");
    },

    onError: (error: AxiosError<{ error?: string; message?: string }>) => {
      const serverMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Operation failed! Please try again.";
      showAlert("Operation failed!", serverMessage, "error");
    },
  });
}
