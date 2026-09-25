import { api } from "../api/api";

export const clientService = {
  createClient: async (data: any) => {
    const response = await api.post("/client", data);
    return response;
  },

  getAllClients: async () => {
    const response = await api.get(`/client/`);
    return response;
  },

  getMilestone: async (id: string) => {
    const response = await api.get(`/client/mile-stone/${id}`);
    return response;
  },

  deleteClient: async (clientId: string) => {
    console.log(clientId);
    const response = await api.delete(`/client/${clientId}`);
    return response;
  },

  updateFirmMember: async (data: []) => {
    const response = await api.patch(`/user/update-user`, data);
    return response;
  },
};
