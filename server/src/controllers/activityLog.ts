import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ActivityLog } from "#models /activeyLog.js";

export const getUserActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?.id;

    const response = await ActivityLog.find({ userId: userId });

    res.status(201).json({
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
