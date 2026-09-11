import { api } from "../api/api";

export const matterService = {
  getMatter: async () => {
    const { data } = await api.get(`/matter`);
    return data;
  },

  getMatterByUserId: async () => {
    const { data } = await api.get(`/matter-user`);
    return data;
  },

  getMatterbyId: async (caseId: string) => {
    const { data } = await api.get(`/matter/${caseId}`);
    return data;
  },

  createCase: async (data) => {
    const response = await api.post(`/matter`, data);
    return response;
  },
  removeCase: async (caseId: string) => {
    const response = await api.delete(`/matter/${caseId}`);
    return response;
  },
  updateCase: async (updates, caseId: string) => {
    console.log(updates);
    const response = await api.patch(`/matter/${caseId}`, { data: updates });
    return response;
  },

  bulkUpdateCase: async (updates) => {
    const { data } = await api.patch("/matter", { updates });
    return data;
  },
};
