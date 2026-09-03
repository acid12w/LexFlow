import mongoose, { Schema, Document } from "mongoose";

// 1. TypeScript Interface for the Matter
export interface Matter extends Document {
  firmId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  template: [];
  title: string;
  description: string;
  responsibleAttorney: mongoose.Types.ObjectId[];
  originatingAttorney: mongoose.Types.ObjectId[];
  responsibleStaff: mongoose.Types.ObjectId[];
  status: string;
  taskCount: number;
  completedTaskCount: number;
  startDate: Date;
  endDate?: Date;
  access: [];
  priority: string;
  isBillable: true;
  billIsCollected: boolean;
  billAmount: number;
  billingMethods: string;
  billCollectedDate: string;
  rate: number;
  // taskList: mongoose.Types.ObjectId[];
  practiceArea: string;
  assignedTo: [];
}

// 2. The Matter Schema
const matterSchema: Schema = new Schema(
  {
    firmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Firm",
      required: [true, "firm is required"],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "client is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Please add a matter name"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      // required: [true, "Please add a description"],
      maxlength: [200, "description cannot be more than 200 characters"],
    },
    responsibleAttorney: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: [true, "At least one assignee is required"],
      },
    ],
    originatingAttorney: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    responsibleStaff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      default: "NOT_STARTED",
    },
    allowAccess: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    taskCount: {
      type: Number,
      default: 0,
    },
    completedTaskCount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isBillable: {
      type: Boolean,
      default: false,
    },
    access: {
      type: String,
    },
    billingMethods: {
      type: String,
    },
    billIsCollected: {
      type: Boolean,
      default: false,
    },
    billAmount: {
      type: Number,
    },
    billCollectedDate: {
      type: Date,
    },
    // taskList: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "TaskList",
    //     // required: [true, "At least one assignee is required"],
    //   },
    // ],
    practiceArea: {
      type: String,
    },

    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: [true, "At least one assignee is required"],
      },
    ],
    priority: {
      type: String,
      required: [true, "Please add a priority"],
    },

    completedAt: { type: Date },
    assignedBy: {
      type: String,
      // required: [true, "Please add an assignee's"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// 3. Export the Model
const Matter = mongoose.model<Matter>("Matter", matterSchema);

export default Matter;
