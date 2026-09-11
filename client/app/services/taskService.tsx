import { api } from "../api/api";

export const taskService = {
  getTasks: async () => {
    const { data } = await api.get(`/tasks`);
    return data;
  },

  getTasksByCaseId: async (caseId: string) => {
    const { data } = await api.get(`/tasks/case/${caseId}`);
    return data;
  },

  createTask: async (data) => {
    const response = await api.post(`/tasks`, data);
    return response;
  },

  updateTasks: async (updates, taskId: string) => {
    const data = await api.patch(`/tasks/${taskId}`, updates);
    return data;
  },

  bulkUpdateTasks: async (updates) => {
    const { data } = await api.patch("/tasks", updates);
    return data;
  },

  removeTask: async (taskId: string) => {
    const { data } = await api.delete(`/tasks/${taskId}`);
    return data.data.response;
  },
};
