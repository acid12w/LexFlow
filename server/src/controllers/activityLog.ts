import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ActivityLog } from "#models /activeyLog.js";
import { getTaskByCaseIdService } from "#services/taskService.js";

export const getUserActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?.id;

    const response = await ActivityLog.find({ userId: userId });

    //total stats amount of time wored for the day
    //matter: matters along with total
    //upcoming deadlines
    //recent activity
    //tasks

    const tasks = await getTaskByCaseIdService(userId);
    const totalCount = await db.collection('yourCollectionName').estimatedDocumentCount();
    const .count();




    res.status(201).json({
      success: true,
      data: {tasks:{tasks, t }},
    });
  } catch (err) {
    next(err);
  }
};

export const getFirmActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const firmId = req.user.firmId;

    const response = await ActivityLog.find({ firmId: firmId });

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};
