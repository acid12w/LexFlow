import mongoose, { Document, Schema } from "mongoose";

export type FirmInvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED";

export interface IFirmInvitation extends Document {
  firmId: mongoose.Types.ObjectId;
  email: string;
  role: string;
  firmName: string;
  workspaceIds?: mongoose.Types.ObjectId[];
  token: string;
  invitedBy?: mongoose.Types.ObjectId;
  status: FirmInvitationStatus;
  expiresAt: Date;
  acceptedAt?: Date;
}

const FirmInvitationSchema = new Schema<IFirmInvitation>({
  firmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Firm",
    required: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
  },

  role: {
    type: String,
    required: true,
  },

  firmName: {
    type: String,
  },

  workspaceIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
  ],

  token: {
    type: String,
    required: true,
    unique: true,
  },

  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "EXPIRED"],
    default: "PENDING",
  },

  expiresAt: {
    type: Date,
    required: true,
  },

  acceptedAt: Date,
});

export default mongoose.model<IFirmInvitation>(
  "FirmInvitation",
  FirmInvitationSchema
);
