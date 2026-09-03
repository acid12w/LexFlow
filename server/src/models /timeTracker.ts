import mongoose, { Schema, Document } from "mongoose";

export interface TimeTracker extends Document {
  user: mongoose.Types.ObjectId;
  matter: mongoose.Types.ObjectId;
  firmId: mongoose.Types.ObjectId;
  description: string;
  duration: number;
  eventType: string;
  date: Date;
}

const timeTrackerSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Firm",
    required: [true, "firm is required"],
    index: true,
  },
  matter: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const TimeTracker = mongoose.model<TimeTracker>(
  "TimeTracker",
  timeTrackerSchema
);

export default TimeTracker;
