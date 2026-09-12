import { api } from "../api/api";

interface UserPayload {
  data: [];
}

interface UserPayload {
  userName: string;
  password: string;
  profileImg: string;
  role: string;
  lastLogin: Date;
  status: string;
  verificationToken: string;
  verificationTokenExpires: Date;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    extension?: string;
    officeLocation?: string;
    practiceAreas: string[];
  };
  // Billing and Productivity Configurations
  billing: {
    defaultHourlyRate: number; // Used by your Time Tracker
    targetBillableHoursAnnual?: number;
  };
}

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

  getUsers: async (data: UserPayload) => {
    const response = await api.post(`/user/assignees`, data);
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

  updateFirmMember: async (data: any) => {
    const response = await api.patch(`/user/update-user`, data);
    return response;
  },

  joinFirm: async (data: any, token: string | undefined) => {
    const response = await api.patch(`/user/join-firm/${token}`, data);
    return response;
  },

  createFirm: async (data: any) => {
    const response = await api.post(`/user/create-firm`, data);
    return response;
  },
};
