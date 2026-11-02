import { Request, Response, NextFunction } from "express";
import { ActivityLog } from "#models /activeyLog.js";

export const getUserActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await ActivityLog.find({ userId: userId }).sort({
      createdAt: -1,
    });

    //total stats amount of time wored for the day
    //matter: matters along with total
    //upcoming deadlines
    //recent activity
    //tasks

    res.status(200).json({
      success: true,
      data: response,
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
    const firmId = req.user?.firmId;
    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await ActivityLog.find({ firmId: firmId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};
