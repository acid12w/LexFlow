import mongoose from "mongoose";

const FinancialSnapshotSchema = new mongoose.Schema({
  firmId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  year: Number,
  month: Number,

  totalBilled: Number,
  collected: Number,
  outstanding: Number,

  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("FinancialSnapshot", FinancialSnapshotSchema);
