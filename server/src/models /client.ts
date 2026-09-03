import mongoose, { Schema, Document } from "mongoose";

export interface IClientInterface extends Document {
  firmId: mongoose.Types.ObjectId;
  matterId: mongoose.Types.ObjectId;

  // Basic Information
  type: "Individual" | "Business";

  firstName?: string;
  lastName?: string;
  companyName?: string;

  email?: string;
  phone?: string;
  alternatePhone?: string;
  refrenceNumber: string;

  // Address
  address: {
    street?: string;
    city?: string;
    parish?: string;
    postalCode?: string;
    country?: string;
  };

  // Business Information
  registrationNumber?: string;
  taxNumber?: string;
  website?: string;

  // Matter Relationship
  primaryAttorney?: mongoose.Types.ObjectId;

  // Status
  status: "Active" | "Inactive" | "Prospective" | "Archived";

  // Personal Details
  dateOfBirth?: Date;
  occupation?: string;
  nationality?: string;

  // Emergency Contact
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };

  // Billing
  billing: {
    hourlyRate?: number;
    currency?: string;
    paymentTerms?: string;
    preferredPaymentMethod?: string;
  };

  // Communication
  preferredContactMethod?: "Email" | "Phone" | "SMS";

  // Notes
  notes?: string;

  // Conflict Checks
  aliases: string[];

  createdBy: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const ClientSchema = new Schema<IClientInterface>(
  {
    firmId: {
      type: Schema.Types.ObjectId,
      ref: "Firm",
      required: true,
      index: true,
      select: false,
    },

    type: {
      type: String,
      enum: ["Individual", "Business"],
      default: "Individual",
    },

    firstName: String,

    lastName: String,

    companyName: String,

    refrenceNumber: String,

    email: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
    },

    phone: String,

    alternatePhone: String,

    address: {
      street: String,
      city: String,
      parish: String,
      postalCode: String,
      country: String,
    },

    registrationNumber: String,

    primaryAttorney: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["Prospective", "Active", "Inactive", "Archived"],
      default: "Prospective",
    },

    dateOfBirth: Date,

    occupation: String,

    nationality: String,

    // emergencyContact: {
    //   name: String,
    //   relationship: String,
    //   phone: String,
    // },

    // billing: {
    //   hourlyRate: Number,
    //   currency: {
    //     type: String,
    //     default: "JMD",
    //   },
    //   paymentTerms: String,
    //   preferredPaymentMethod: String,
    // },

    // preferredContactMethod: {
    //   type: String,
    //   enum: ["Email", "Phone", "SMS"],
    //   default: "Email",
    // },

    aliases: [String],

    notes: String,

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model<IClientInterface>("Client", ClientSchema);

export default Client;
