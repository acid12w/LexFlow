import { authService } from "@/app/services/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAlertStore } from "@/app/store/use-alert"; // Import your Zustand bridge
import { useUserCredentials } from "@/app/store/user-store";

export function useSignin() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newUserData) => authService.signinUser(newUserData),

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
      const serverMessage =
        error?.response?.data?.message ||
        "Incorrect email or password. Please try again.";

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

export function useSignup() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newUserData) => authService.createUser(newUserData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firmMembers"] });
      showAlert("success!", "You have created a user", "success");
    },

    onError: (error) => {
      const serverMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Sign-up failed. Please try again.";
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

export function useGetUsersByArray(data) {
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

export function useGetInvitationById(id) {
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
    mutationFn: (userId) => authService.deleteTeamMember(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firmMembers"] });

      // Fire success notification
      showAlert("success!", "user has been removed.", "success");
    },

    onError: (error) => {
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

    onError: (error) => {
      const serverMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Operation failed!";

      showAlert("Operation failed!", serverMessage, "error");
    },
  });
}

export function useJoinfirmMember() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newuserData: []) =>
      authService.joinFirm(newuserData, newuserData?.token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Fire success notification
      showAlert("success!", "You user has been updated", "success");
    },

    onError: (error) => {
      console.error("Mutation Error:", error);
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

    onError: (error) => {
      console.error("Mutation Error:", error);
      const serverMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Operation failed! Please try again.";
      showAlert("Operation failed!", serverMessage, "error");
    },
  });
}

// export function useEmailVerification() {
//   return useMutation({
//     mutationFn: (token) => authService.verifyEmail(token),

//     onError: (error) => {
//       // const serverMessage =
//       //   error?.response?.data?.error ||
//       //   error?.response?.data?.message ||
//       //   "Sign-up failed. Please try again.";
//       // showAlert("Sign-up failed", serverMessage, "error");
//     },
//   });
// }
