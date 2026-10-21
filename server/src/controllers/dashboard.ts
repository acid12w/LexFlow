import { Request, Response, NextFunction } from "express";
import Matter, { Matter as IMatterInterface } from "../models /matter.js";
import FinancialSnapshotSchema from "#models /financialSnapshot.js";
import mongoose from "mongoose";
import { generateFinancialSnapshot } from "#services/financialSnapshotService.js";
import { ActivityLog } from "#models /activeyLog.js";
import Task from "#models /tasks.js";
import { getTaskByFirmIdService } from "#services/taskService.js";
import {
  getMatterByUserIdService,
  getMattersDueSoon,
} from "#services/matterService.js";
import {
  getTimeTrackerdService,
  getTimeTrackerSnapshot,
} from "#services/timeTrackerService.js";

const statusConfig = {
  TODO: {
    label: "todo",
    fill: "#0088FF",
  },
  IN_PROGRESS: {
    label: "inprogress",
    fill: "#F59E0B",
  },
  IN_REVIEW: {
    label: "inreview",
    fill: "#A855F7",
  },
  AT_RISK: {
    label: "atrisk",
    fill: "#EF4444",
  },
  NOT_STARTED: {
    label: "notstarted",
    fill: "#6B7280",
  },
};

export const getCasesOverview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const firmId = req.user?.firmId;

  try {
    const total = await Matter.countDocuments({ firmId: firmId });

    // 1. Manually cast the string ID to a proper MongoDB ObjectId
    const objectIdFirm = new mongoose.Types.ObjectId(firmId);

    const grouped = await Matter.aggregate([
      {
        // 2. Match using the true ObjectId
        $match: {
          firmId: objectIdFirm,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          tasks: "$count",
          fill: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "TODO"] }, then: "#0088FF" },
                { case: { $eq: ["$_id", "IN_PROGRESS"] }, then: "#F59E0B" },
                { case: { $eq: ["$_id", "IN_REVIEW"] }, then: "#A855F7" },
                { case: { $eq: ["$_id", "AT_RISK"] }, then: "#EF4444" },
                { case: { $eq: ["$_id", "NOT_STARTED"] }, then: "#6B7280" },
                { case: { $eq: ["$_id", "COMPLETED"] }, then: "#08CB63" },
              ],
              default: "#000000",
            },
          },
        },
      },
    ]);

    console.log(grouped);

    res.json({
      total,
      grouped,
    });
  } catch (err) {
    next(err);
  }
};

export const getRevenueOverview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const total = await Matter.countDocuments();

    const grouped = await Matter.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      total,
      grouped,
    });
  } catch (err) {
    next(err);
  }
};

export const getTotalRevenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const billedResult = await Matter.aggregate([
      {
        $match: {
          firmId: new mongoose.Types.ObjectId(req.user?.firmId),
        },
      },
      {
        $group: {
          _id: null,
          totalBilled: {
            $sum: "$billAmount",
          },
        },
      },
    ]);

    const totalBilled = billedResult[0]?.totalBilled || 0;

    res.json({
      totalBilled,
    });
  } catch (err) {
    next(err);
  }
};

export const getCollectedRevenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const billedResult = await Matter.aggregate([
      {
        $match: {
          firmId: new mongoose.Types.ObjectId(req.user?.firmId),
          billIsCollected: true,
        },
      },
      {
        $group: {
          _id: null,
          totalBilled: {
            $sum: "$billAmount",
          },
        },
      },
    ]);

    const collectedBilled = billedResult[0]?.totalBilled || 0;

    // const firmId = req.user?.firmId;

    // generateFinancialSnapshot(firmId);

    res.json({
      collectedBilled,
    });
  } catch (err) {
    next(err);
  }
};

export const getRevenueTrend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const snapshots = await FinancialSnapshotSchema.find({
    firmId: req.user?.firmId,
  }).sort({
    year: 1,
    month: 1,
  });

  res.json(snapshots);
};

export const getUserDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const firmId = req.user?.firmId;
    const totalTasks = await Task.countDocuments({ user: userId });
    const TasksData = await getTaskByFirmIdService(firmId, userId);

    const totalMatters = await Matter.countDocuments({ userId: userId });
    const matterData = await getMatterByUserIdService(firmId, userId);
    const matterDueDate = await getMattersDueSoon(firmId, userId);

    const activityData = await ActivityLog.find({ userId: userId });

    const timeData = await getTimeTrackerSnapshot(userId, firmId);

    return res.status(200).json({
      success: true,
      data: {
        totalTasks,
        TasksData,
        totalMatters,
        matterData,
        activityData,
        timeData,
        matterDueDate,
      },
    });
  } catch (err) {
    next(err);
  }
};
