import { Request } from "express";

export interface AuthUser {
  id: string;
  firmId: string;
  userName: string;
}

export interface ProtectedRequest extends Request {
  user?: AuthUser;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
