// src/routes/userRoutes.js
import express from "express";

import { protect } from "#middlewares /authMiddleware.js";
import {
  getCasesOverview,
  getTotalRevenue,
  getCollectedRevenue,
  getRevenueTrend,
  getUserDashboard,
  getFirmDashboard,
} from "../controllers/dashboard.js";

const router = express.Router();

// // GET /api/v1/dashboard
router.get("/cases-overview", protect, getCasesOverview);
router.get("/revenue-total", protect, getTotalRevenue);
router.get("/revenue-collected", protect, getCollectedRevenue);
router.get("/revenue-snapshot", protect, getUserDashboard);
router.get("/firm", protect, getFirmDashboard);

export default router;
