import mongoose, { Schema, Document } from "mongoose";

// 1. TypeScript Interface for the Task
export interface Task extends Document {
  user: mongoose.Types.ObjectId;
  matterId: mongoose.Types.ObjectId;
  firmId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  eventType?: string;
  status: string;
  priority: string;
  assignedTo: [];
  completedAt: string;
  assignedBy: string;
  startDate?: Date;
  endDate?: Date;
  position?: number;
  mileStone: boolean;
}

// 2. The Task Schema
const taskSchema: Schema = new Schema(
  {
    // Linking the task to a specific User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    matterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Matter",
      // required: true,
      index: true, // Adding an index makes searching for tasks by Matter very fast
    },
    firmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Firm",
      required: [true, "firm is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Please add a task title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please add a description"],
    },
    eventType: {
      type: String,
      required: [true, "Please add an event type"],
    },
    status: {
      type: String,
      required: [true, "Please add a status"],
    },
    position: {
      type: Number,
      default: 0,
    },
    priority: {
      type: String,
      required: [true, "Please add a priority"],
    },
    mileStone: {
      type: Boolean,
      default: false,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: [true, "At least one assignee is required"],
      },
    ],
    completedAt: { type: Date },
    endDate: {
      type: Date,
    },
    startDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// 3. Export the Model
const Task = mongoose.model<Task>("Task", taskSchema);

export default Task;
