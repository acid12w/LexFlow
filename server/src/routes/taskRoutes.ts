// src/routes/userRoutes.js
import express from "express";
import {
  // getAllTasks,
  addTask,
  getTaskById,
  getTaskByCaseId,
  removeTask,
  updateTaskbyId,
  bulkupdateTask,
} from "../controllers/taskController.js";
import { protect } from "#middlewares /authMiddleware.js";

const router = express.Router();

// GET /api/v1/tasks
// router.get("/", getAllTasks);

// GET /api/v1/tasks/123
router.get("/", protect, getTaskById);

router.get("/case/:id", protect, getTaskByCaseId);

// POST /api/v1/tasks
router.post("/", protect, addTask);

// DELETE /api/v1/tasks/123
router.delete("/:id", protect, removeTask);

router.patch("/:id", protect, updateTaskbyId);
// DELETE /api/v1/tasks/
router.patch("/", protect, bulkupdateTask);

export default router;
