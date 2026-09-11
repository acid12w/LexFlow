import { api } from "../api/api";

interface signinPayload {
  userName: string;
  password: string;
  company?: string;
  inviteFirmId?: string;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
  };
  billing?: { defaultHourlyRate: number };
  role?: string;
}

export const clientService = {
  createUser: async (data: signinPayload) => {
    const response = await api.post("/user/sign-up", data);
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

  deleteTeamMember: async (userId: string) => {
    const response = await api.delete(`/user/removeTeamMember/${userId}`);
    return response;
  },

  updateFirmMember: async (data: []) => {
    const response = await api.patch(`/user/update-user`, data);
    return response;
  },
};
