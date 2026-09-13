import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { matterService } from "../app/services/matter.Service";
import { useAlertStore } from "@/app/store/use-alert"; // Import your Zustand bridge
import { AxiosError } from "axios";

export function useGetAllMatters() {
  const result = useQuery({
    queryKey: ["case"],
    queryFn: () => matterService.getMatter(),
  });
  return result;
}

export function useGetAllMattersByUserId() {
  const result = useQuery({
    queryKey: ["case"],
    queryFn: () => matterService.getMatter(),
  });
  return result;
}

export function useGetMatterById(caseId: any) {
  return useQuery({
    // 1. Dynamic query keys guarantee unique state caches per case
    queryKey: ["case", caseId],

    // 2. JavaScript scope safely reads caseId from the function parameters
    queryFn: () => matterService.getMatterbyId(caseId),

    // 3. Safety Net: Prevents firing a broken API call if caseId is missing/null
    enabled: !!caseId,
  });
}

interface newCaseDataPayload {
  _id?: string; // 👈 Made optional for new creations
  title: string;
  description: string;
  responsibleAttorney: string[];
  originatingAttorney: string[];
  responsibleStaff: string[];
  assignedTo: string[];
  priority: string;
  practiceArea: string;
  allowAccess?: string[]; // 👈 Changed from [] to string[]
  startDate: Date;
  endDate: Date;
  isBillable: boolean;
  billingAmount: number;
  clientEmail: string;
  clientContactNumber: string;
  firstName: string;
  lastName: string;
  clientType: string;
  refrenceNumber: string;
}

export function useCreateMatters() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newCaseData: newCaseDataPayload) =>
      matterService.createCase(newCaseData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case"] });
      showAlert("success!", "You have created a case", "success");
    },

    onError: (error) => {
      const serverMessage = "Operation failed! Please try again.";
      showAlert("Operation failed!", serverMessage, "error");
    },
  });
}

export function useUpdateCase() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newcaseData: any) =>
      matterService.updateCase(newcaseData, newcaseData._id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case"] });
      // Fire success notification
      showAlert("success!", "You case has been updated", "success");
    },

    onError: (error) => {
      const serverMessage = "Operation failed! Please try again.";
      showAlert("Operation failed!", serverMessage, "error");
    },
  });
}

export function useBulkUpdateCases() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newcaseData: any) => matterService.bulkUpdateCase(newcaseData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case"] });
      showAlert("success!", "Your cases has been updated", "success");
    },

    onError: (error) => {
      const serverMessage = "Operation failed! Please try again.";
      showAlert("Operation failed!", serverMessage, "error");
    },
  });
}

export function useRemoveCases() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (caseId: string) => matterService.removeCase(caseId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case"] });
      showAlert("success!", "Your case has been removed", "success");
    },

    onError: (error) => {
      const serverMessage = "Operation failed! Please try again.";
      showAlert("Operation failed!", serverMessage, "error");
    },
  });
}
