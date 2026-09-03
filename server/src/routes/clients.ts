// src/routes/userRoutes.js
import express from "express";

import { protect } from "#middlewares /authMiddleware.js";
import {
  updateClient,
  deleteClient,
  createClient,
  getAllClients,
  getClient,
  getMilestone,
} from "../controllers/clientController.js";

const router = express.Router();

// GET /api/v1/matters
router.get("/", protect, getAllClients);
router.get("/:id", protect, getClient);
router.get("/mile-stone/:id", getMilestone);
router.post("/:id", protect, createClient);
router.patch("/:id", protect, updateClient);
router.delete("/:id", protect, deleteClient);

export default router;
