import mongoose, { Schema, Document } from "mongoose";

export interface IFirm extends Document {
  name: string;
}

const firmSchema: Schema = new Schema(
  {
    name: {
      type: String,
      // required: [true, "Firm name is required"],
      trim: true,
      maxlength: [200, "Firm name cannot exceed 200 characters"],
    },
    logo: {
      type: String,
    },
    practiceAreas: {
      type: [String],
    },
    workspace: {
      type: String,
    },
    subscriptionPlan: {
      type: String,
    },
    billingPreferences: {
      type: String,
    },
    country: {
      type: String,
    },
    timeZone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Firm = mongoose.model<IFirm>("Firm", firmSchema);

export default Firm;
