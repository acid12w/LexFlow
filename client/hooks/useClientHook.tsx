import { clientService } from "@/app/services/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAlertStore } from "@/app/store/use-alert"; // Import your Zustand bridge
import { useUserCredentials } from "@/app/store/user-store";

export function useCreateClient() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newClientData: any) =>
      clientService.createClient(newClientData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      showAlert("success!", "your client was deleted", "success");
    },

    onError: (error) => {
      const serverMessage = "Sign-up failed. Please try again.";
      showAlert("Sign-up failed", serverMessage, "error");
    },
  });
}

export function useRemoveClient() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (clientId: any) => clientService.deleteClient(clientId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      showAlert("success!", "You have created a user", "success");
    },

    onError: (error) => {
      const serverMessage = "Sign-up failed. Please try again.";
      showAlert("Sign-up failed", serverMessage, "error");
    },
  });
}

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
