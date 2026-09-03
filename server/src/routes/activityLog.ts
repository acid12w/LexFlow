// src/routes/userRoutes.js
import express from "express";

import { protect } from "#middlewares /authMiddleware.js";
import {
  getUserActivity,
  getFirmActivity,
} from "../controllers/activityLog.js";

const router = express.Router();

// GET /api/v1/matters
router.get("/user", protect, getUserActivity);
router.get("/firm", protect, getFirmActivity);

export default router;
