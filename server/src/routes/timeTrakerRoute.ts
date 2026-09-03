import {
  createTimeTracker,
  deleteTimeTrackerById,
  getTimeTrackerByUserId,
  updateTimeTrackerById,
} from "#controllers/TimeTrackerController.js";
import { protect } from "#middlewares /authMiddleware.js";

import express from "express";

const router = express.Router();

router.post("/", protect, createTimeTracker);
router.get("/", protect, getTimeTrackerByUserId);
router.put("/:id", protect, updateTimeTrackerById);
router.delete("/:id", protect, deleteTimeTrackerById);

export default router;
