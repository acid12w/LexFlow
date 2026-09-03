import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import {
  bulkUpdateTasksService,
  createTaskService,
  getTaskByFirmIdService,
  getTaskByCaseIdService,
  removeTaskService,
  updateTaskbyIdService,
} from "../services/taskService.js";
import { ProtectedRequest } from "../types/express.js";
import { createLog } from "#middlewares /activitylog.js";

export const getTaskById = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const firmId = req.user?.firmId;
    const userId = req.user?.id;

    const response = await getTaskByFirmIdService(firmId, userId);

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const getTaskByCaseId = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const caseId = String(req.params.id);
    const firmId = req.user?.firmId;

    const response = await getTaskByCaseIdService(caseId, firmId);

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const addTask = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const firmId = req.user?.firmId;
    const userName = req.user?.userName;

    const taskData = req.body;
    taskData.user = userId;
    taskData.firmId = new mongoose.Types.ObjectId(firmId);
    delete taskData.firm;

    const task = await createTaskService(taskData);

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "TASK_MGMT",
      description: "New task created",
      metadata: {
        actionId: taskData._id,
        actionTitle: taskData.title,
      },
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

export const removeTask = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = String(req.params.id);
    const firmId = req.user?.firmId;
    const userId = req.user?.id;
    const userName = req.user?.userName;

    const response = await removeTaskService(taskId, firmId);

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "TASK_MGMT",
      description: "A task was deleted",
      metadata: {
        actionId: response?._id,
        actionTitle: response?.title,
      },
    });

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTaskbyId = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  const taskId = String(req.params.id);
  const firmId = req.user?.firmId;
  const userId = req.user?.id;
  const userName = req.user?.userName;

  if (!firmId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const response = await updateTaskbyIdService(taskId, firmId, data);

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "TASK_MGMT",
      description: "A task was updated",
      metadata: {
        actionId: response?._id,
        actionTitle: response?.title,
      },
    });

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const bulkupdateTask = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const updates = req.body;
    const firmId = req.user?.firmId;
    const userId = req.user?.id;
    const userName = req.user?.userName;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: "No updates provided" });
    }

    const result = await bulkUpdateTasksService(updates, firmId);

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "TASK_MGMT",
      description: "A task was updated",
      metadata: {},
    });

    res.status(200).json({
      message: "Bulk update successful",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
