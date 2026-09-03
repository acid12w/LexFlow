import mongoose, { Schema, Document } from "mongoose";
import { Model } from "mongoose";
import bcrypt from "bcryptjs";

// 1. Define roles as a strict array for safety
export const USER_ROLES = [
  "Admin",
  "Partner",
  "Associate",
  "Paralegal",
  "Support Staff",
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface IUser extends Document {
  userName: string;
  password: string;
  profileImg: string;
  role: string;
  firmId: mongoose.Types.ObjectId;
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

interface IUserMethods {
  matchPassword(password: string): Promise<boolean>;
}

// type UserModel = Model<DocumentData, QueryHelpers, InstanceMethods>
type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema: Schema = new Schema<IUser, UserModel, IUserMethods>({
  userName: {
    type: String,
    // required: [true, "username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
  role: {
    type: String,
    enum: ["Attorney", "Paralegal", "Admin", "Secretary"],
    default: "Paralegal",
  },
  firmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Firm",
    // required: [true, "firm is required"],
    index: true,
  },
  verificationToken: { type: String },
  verificationTokenExpires: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending",
  },
  // company: { type: String, required: true, trim: true },
  profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      // required: [true, "Contact email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, trim: true },
    extension: { type: String, trim: true },
    officeLocation: { type: String, trim: true },
    practiceAreas: [{ type: String, trim: true }], // e.g. ["Litigation", "Family Law"]
  },
  billing: {
    defaultHourlyRate: {
      type: Number,

      default: 0, // 0 handles non-billing staff like paralegals/support
      min: [0, "Hourly rate cannot be negative"],
    },
    targetBillableHoursAnnual: { type: Number, default: 1500 },
  },

  profileImg: { type: String, default: "default-avatar.png" },
  lastLogin: {
    type: Date,
  },
});

// Remove 'next' from the arguments
UserSchema.pre("save", async function () {
  // If password isn't changed, just return (finishes the hook)
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // No next() call needed here!
  } catch (error) {
    // If an error happens, throw it; Mongoose will catch it
    throw error;
  }
});

// 3. Export the Model
const User = mongoose.model<IUser, UserModel>("User", UserSchema);

export default User;
