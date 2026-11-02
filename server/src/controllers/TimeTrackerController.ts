import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import {
  createTimeTrackerService,
  deleteTimeTrackerByIdService,
  getTimeTrackerByIdService,
  getTimeTrackerSnapshot as getTimeTrackerSnapshotService,
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
      description: "Created time entry",
      metadata: {
        actionId: response._id,
        actionTitle: response.description,
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

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const getTimeTrackerSnapshot = async (
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

    const response = await getTimeTrackerSnapshotService(userId, firmId);

    res.status(200).json({
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
    if (!firmId || !userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await updateTimeTrackerByIdService(
      String(req.params.id),
      firmId,
      userId,
      req.body
    );
    if (!response) {
      return res.status(404).json({ message: "Time entry not found" });
    }

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "TIME_TRACKER_MGMT",
      description: "Updated time entry",
      metadata: {
        actionId: response._id,
        actionTitle: response.description,
      },
    });
    res.status(200).json({
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
    if (!firmId || !userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await deleteTimeTrackerByIdService(
      String(req.params.id),
      firmId,
      userId
    );
    if (!response) {
      return res.status(404).json({ message: "Time entry not found" });
    }

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "TIME_TRACKER_MGMT",
      description: "Deleted time entry",
      metadata: {
        actionId: response._id,
        actionTitle: response.description,
      },
    });
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};
