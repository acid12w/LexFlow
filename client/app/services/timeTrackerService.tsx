import { api } from "../api/api";

export const timeTrackerService = {
  gettTimeTracker: async () => {
    const { data } = await api.get(`/time-tracker`);
    return data;
  },

  getTimeTrackersByUserId: async () => {
    const { data } = await api.get(`/time-tracker`);
    return data;
  },

  createTracker: async (data) => {
    const response = await api.post(`/time-tracker`, data);
    return response;
  },

  updateTracker: async (updates: [], taskId: string) => {
    const data = await api.patch(`/time-tracker/${taskId}`, updates);
    return data;
  },

  bulkUpdateTracker: async (updates: []) => {
    const { data } = await api.patch("/time-tracker", updates);
    return data;
  },

  removeItem: async (Id: string) => {
    const { data } = await api.delete(`/time-tracker/${Id}`);
    return data.data.response;
  },
};
