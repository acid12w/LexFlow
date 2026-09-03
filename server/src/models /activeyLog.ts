import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firmId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userName: { type: String, required: true },

  // Explicitly group actions: 'TASK_MGMT' | 'BILLING' | 'CLIENT_DATA' | 'MATTER_MOD'
  category: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // The Safety Vault: Flexible object to handle structural differences across types
  metadata: {
    actionId: { type: mongoose.Schema.Types.ObjectId },
    actionTitle: { type: String },

    // Fields specific to Billing logs
    durationMinutes: { type: Number },
    billingRate: { type: Number },
    timestampAction: { type: String }, // e.g., "CLOCK_IN", "CLOCK_OUT"

    // Fields specific to Client Data mutations
    clientId: { type: mongoose.Schema.Types.ObjectId },
    fieldChanged: { type: String }, // e.g., "clientContactNumber"
    oldValue: { type: String },
    newValue: { type: String },
  },
});

export const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);
