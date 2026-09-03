import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import {
  bulkUpdateMattersService,
  createMatterService,
  getAllMattersService,
  getMatterByUserIdService,
  getMatterByIdService,
  removeMatterService,
  updateMatterbyIdService,
} from "../services/matterService.js";
import {
  createClientService,
  getClientService,
} from "../services/clientService.js";
import { ProtectedRequest } from "../types/express.js";
import { createLog } from "#middlewares /activitylog.js";

const toAssigneeObjectIds = (value: unknown): mongoose.Types.ObjectId[] => {
  if (!value) return [];
  const items = Array.isArray(value) ? value : [value];
  return items
    .map((item) => {
      if (typeof item === "string" && mongoose.Types.ObjectId.isValid(item)) {
        return new mongoose.Types.ObjectId(item);
      }
      if (
        item &&
        typeof item === "object" &&
        "_id" in item &&
        mongoose.Types.ObjectId.isValid(String((item as { _id: string })._id))
      ) {
        return new mongoose.Types.ObjectId(
          String((item as { _id: string })._id)
        );
      }
      return null;
    })
    .filter((id): id is mongoose.Types.ObjectId => id !== null);
};

export const getAllMatters = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const firmId = req.user?.firmId;

    const userId = req.user?.id;

    const response = await getAllMattersService(firmId, userId);
    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const getMatterByUserId = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const firmId = req.user?.firmId;
    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await getMatterByUserIdService(firmId, userId);

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const getMatterbyId = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const caseId = req.params.id;
    const firmId = req.user?.firmId;

    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await getMatterByIdService(firmId, caseId);

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const addMatter = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const firmId = req.user?.firmId;
    const userName = req.user?.userName;

    // await createLog({
    //   userId: userId,
    //   firmId: firmId,
    //   userName: userName,
    //   category: "CASE_MGMT",
    //   description: "created new case ",
    //   metadata: {
    //     taskId: task._id,
    //     taskTitle: task.title,
    //   },
    // });

    const {
      template,
      title,
      description,
      matterDescription,
      responsibleAttorney,
      originatingAttorney,
      responsibleStaff,
      startDate,
      endDate,
      access,
      priority,
      rate,
      taskList,
      practiceArea,
      assignedTo,
      clientEmail,
      firstName,
      lastName,
      clientType,
      refrenceNumber,
    } = req.body;

    const clientExists = await getClientService(clientEmail);

    if (clientExists) {
      return res.status(404).json({ message: "Client already exsits" });
    }

    const client = await createClientService({
      firmId: new mongoose.Types.ObjectId(firmId),
      userId: new mongoose.Types.ObjectId(userId),
      firstName,
      lastName,
      email: clientEmail,
      clientType,
      refrenceNumber,
      type: clientType,
      status: "Active",
      createdBy: new mongoose.Types.ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const data = await createMatterService({
      firmId: new mongoose.Types.ObjectId(firmId),
      userId: new mongoose.Types.ObjectId(userId),
      clientId: client._id,
      template,
      title,
      description: description ?? matterDescription,
      responsibleAttorney: toAssigneeObjectIds(responsibleAttorney),
      originatingAttorney: toAssigneeObjectIds(originatingAttorney),
      responsibleStaff: toAssigneeObjectIds(responsibleStaff),
      startDate,
      endDate: endDate,
      access,
      priority,
      rate,
      // taskList,
      practiceArea,
      // assignedTo: toAssigneeObjectIds(assignedTo),
    });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const removeMatter = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const matterId = String(req.params.id);
    const firmId = req.user?.firmId;
    const userId = req.user?.id;
    const userName = req.user?.userName;

    const response = await removeMatterService(matterId, firmId);

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "TASK_MGMT",
      description: "Case was deleted ",
      metadata: {
        // actionId: taskData._id,
        // actionTitle: taskData.title,
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

export const updateMatterbyId = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const caseId = String(req.params.id);
    const firmId = req.user?.firmId;
    const userId = req.user?.id;
    const userName = req.user?.userName;
    const { data } = req.body;
    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "CASE_MGMT",
      description: "updated case",
      metadata: {
        taskId: data._id,
        taskTitle: data.title,
      },
    });

    const response = await updateMatterbyIdService(caseId, firmId, data);

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const bulkupdateMatter = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { updates } = req.body;
    const firmId = req.user?.firmId;
    const userId = req.user?.id;
    const userName = req.user?.userName;
    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await bulkUpdateMattersService(updates, firmId);

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "CASE_MGMT",
      description: "updated cases ",
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
