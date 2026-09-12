import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { timeTrackerService } from "../app/services/timeTrackerService";

import { useAlertStore } from "@/app/store/use-alert"; // Import your Zustand bridge
import { AxiosError } from "axios";

// export function useGetAlltimeTracker() {
//   const result = useQuery({
//     queryKey: ["alltimeStamp"],
//     queryFn: () => timeTrackerService.getMatter(),
//   });
//   return result;
// }

export function useGetTimeTrackerByUserId() {
  const result = useQuery({
    queryKey: ["timeStamp"],
    queryFn: (userId) => timeTrackerService.getTimeTrackersByUserId(),
  });
  return result;
}

export function useCreatetimeTracker() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newCaseData: any) =>
      timeTrackerService.createTracker(newCaseData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeStamp"] });

      // Fire success notification
      showAlert("success!", "You have created a time stamp.", "success");
    },

    onError: (error: AxiosError<{ error?: string; message?: string }>) => {
      // Parse server message string if it exists, otherwise fall back to safety text
      const serverMessage =
        error?.response?.data?.message || "somthing went wrong.";

      // Fire error notification
      showAlert("Sign-in failed", serverMessage, "error");
    },
  });
}

// export function useUpdatetimeTracker() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (newcaseData) =>
//       timeTrackerService.updateCase(newcaseData, newcaseData._id),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["timeStamp"] });
//     },

//     onError: (error) => {
//       console.error("Mutation Error:", error);
//     },
//   });
// }

export function useRemovetimeTracker(caseId: string) {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (caseId: string) => timeTrackerService.removeItem(caseId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeStamp"] });

      // Fire success notification
      showAlert("success!", "time stamp has been removed.", "success");
    },

    onError: (error: AxiosError<{ error?: string; message?: string }>) => {
      const serverMessage =
        error?.response?.data?.message || "somthing went wrong.";

      // Fire error notification
      showAlert("Operation failed", serverMessage, "error");
    },
  });
}
