import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../app/services/taskService";
// import { toast } from "react-hot-toast";
import { useAlertStore } from "@/app/store/use-alert"; // Import your Zustand bridge

export function useGetAllTasks() {
  const result = useQuery({
    queryKey: ["tasks"],
    queryFn: () => taskService.getTasks(),
  });
  return result;
}

export function useGetAllTasksByCaseId(caseId: string | string[]) {
  // 💡 Extract the string safely if it happens to be an array
  const cleanCaseId = Array.isArray(caseId) ? caseId[0] : caseId;

  const result = useQuery({
    queryKey: ["task", cleanCaseId],
    // 💡 Pass the clean string to your service, with a fallback just in case it's empty
    queryFn: () => taskService.getTasksByCaseId(cleanCaseId ?? ""),
    enabled: !!cleanCaseId, // Skip the query if no ID is present
  });

  return result;
}

export function useCreateTasks(caseId: string) {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newTaskData) => taskService.createTask(newTaskData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", caseId] });
      queryClient.invalidateQueries({ queryKey: ["case"] });
      showAlert("sucess", "Your new task has been created.", "success");
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

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newTaskData, taskId) =>
      taskService.updateTasks(newTaskData, newTaskData._id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["case"] });
      showAlert("sucess", "Your task has been updated.", "success");
    },

    onError: (error) => {
      const serverMessage =
        error?.response?.data?.message || "somthing went wrong.";

      // Fire error notification
      showAlert("Operation failed", serverMessage, "error");
    },
  });
}

export function useBulkUpdateTasks() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (newTaskData) => taskService.bulkUpdateTasks(newTaskData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["case"] });
      showAlert("sucess", "Your task has been updated.", "success");
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

export function useRemoveTasks(taskId: string) {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);

  return useMutation({
    mutationFn: (taskId) => taskService.removeTask(taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["case"] });
      showAlert("sucess", "Your task has been removed.", "success");
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
