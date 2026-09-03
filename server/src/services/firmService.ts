import mongoose from "mongoose";
import Firm from "../models /firm.js";

export const createFirm = async (data) => {
  return Firm.create(data);
};

export const getFirmById = async (firmId: string) => {
  if (!mongoose.Types.ObjectId.isValid(firmId)) {
    return null;
  }
  return Firm.findById(firmId);
};
