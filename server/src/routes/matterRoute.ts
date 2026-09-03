// src/routes/userRoutes.js
import express from "express";
import {
  getAllMatters,
  addMatter,
  getMatterByUserId,
  getMatterbyId,
  removeMatter,
  updateMatterbyId,
  bulkupdateMatter,
} from "../controllers/matterController.js";
import { protect } from "#middlewares /authMiddleware.js";

const router = express.Router();

// GET /api/v1/matters
router.get("/", protect, getAllMatters);

// POST /api/v1/matters
router.post("/", protect, addMatter);

// GET /api/v1/matters/matter-user
router.get("/matter-user", protect, getMatterByUserId); 

router.get("/:id", protect, getMatterbyId);

// DELETE /api/v1/matters/123
router.delete("/:id", protect, removeMatter);

router.patch("/:id", protect, updateMatterbyId); 

router.patch("/", protect, bulkupdateMatter);

export default router;
