import { api } from "../api/api";

export const authService = {
  createUser: async (data: {
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
  }) => {
    const response = await api.post("/user/sign-up", data);
    return response;
  },

  signinUser: async (data: { userName: string; password: string }) => {
    const response = await api.post("/user/sign-in", data);
    return response;
  },

  logout: async () => {
    const response = await api.post("/user/logout");
    return response;
  },

  getFirmMembers: async () => {
    const response = await api.get(`/user/firmMembers`);
    return response;
  },

  getUsers: async (data) => {
    const response = await api.post(`/user/assignees`, { data });
    return response;
  },

  geCurrenttUser: async () => {
    const response = await api.get(`/user/currentUser`);
    return response;
  },

  getTeamMember: async () => {
    const response = await api.get(`/user/teamMember`);
    return response;
  },

  getUserInvitation: async (id: string) => {
    const response = await api.get(`/user/firmInvitation/${id}`);
    return response;
  },

  deleteTeamMember: async (userId: string) => {
    const response = await api.delete(`/user/removeTeamMember/${userId}`);
    return response;
  },

  updateFirmMember: async (data) => {
    const response = await api.patch(`/user/update-user`, data);
    return response;
  },

  joinFirm: async (data, token: string | undefined) => {
    const response = await api.patch(`/user/join-firm/${token}`, data);
    return response;
  },

  createFirm: async (data) => {
    const response = await api.post(`/user/create-firm`, data);
    return response;
  },
};
