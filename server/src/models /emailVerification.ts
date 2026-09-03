import mongoose, { Schema, Document } from "mongoose";

export interface IemailVerified extends Document {
  name: string;
}

const emailVerifiedSchema: Schema = new mongoose.Schema({
  verificationToken: String,

  verificationTokenExpires: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("emailVerifiedSchema", emailVerifiedSchema);
