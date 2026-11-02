import mongoose from "mongoose";
import Firm from "../models /firm.js";

interface CreateFirmParams {
  name: string;
  logo?: string;
  practiceAreas?: string[];
  workspace?: string;
  country?: string;
}

export const createFirm = async (data: CreateFirmParams) => {
  return Firm.create(data);
};

export const getFirmById = async (firmId: string) => {
  if (!mongoose.Types.ObjectId.isValid(firmId)) {
    return null;
  }
  return Firm.findById(firmId);
};
