import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import {
  createTimeTrackerService,
  deleteTimeTrackerByIdService,
  getTimeTrackerByIdService,
  updateTimeTrackerByIdService,
} from "#services/timeTrackerService.js";
import { ProtectedRequest } from "../types/express.js";
import { createLog } from "#middlewares /activitylog.js";

export const createTimeTracker = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const firmId = req.user?.firmId;
    const userId = req.user?.id;
    const userName = req.user?.userName;
    if (!firmId || !userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await createTimeTrackerService({
      ...req.body,
      user: new mongoose.Types.ObjectId(userId),
      firmId: new mongoose.Types.ObjectId(firmId),
    });

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "TIME_TRACKER_MGMT",
      description: "completed task 'Draft Operating Agreement' for case",
      metadata: {
        taskId: response?._id,
        taskTitle: response?.title,
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

export const getTimeTrackerByUserId = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const firmId = req.user?.firmId;
    if (!userId || !firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await getTimeTrackerByIdService(userId, firmId);

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTimeTrackerById = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const firmId = req.user?.firmId;
    const userId = req.user?.id;
    const userName = req.user?.userName;
    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await updateTimeTrackerByIdService(
      String(req.params.id),
      firmId,
      req.body
    );

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "TIME_TRACKER_MGMT",
      description: "completed task 'Draft Operating Agreement' for case",
      metadata: {
        taskId: task._id,
        taskTitle: task.title,
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

export const deleteTimeTrackerById = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const firmId = req.user?.firmId;
    const userId = req.user?.id;
    const userName = req.user?.userName;
    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await deleteTimeTrackerByIdService(
      String(req.params.id),
      firmId
    );

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "TIME_TRACKER_MGMT",
      description: "Deleted time stamp",
      metadata: {
        taskId: response?._id,
        taskTitle: response?.title,
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
