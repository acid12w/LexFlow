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
  getClientByClientIdService,
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
    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await getAllMattersService(firmId, userId);
    res.status(200).json({
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

    res.status(200).json({
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
    if (!response) {
      return res.status(404).json({ message: "Matter not found" });
    }

    res.status(200).json({
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
    if (!firmId || !userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

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
      allowAccess,
      priority,
      rate,
      taskList,
      practiceArea,
      assignedTo,
      clientEmail,
      clientId,
    } = req.body;

    // 1. Determine if access is restricted
    const isRestricted = Array.isArray(allowAccess) && allowAccess.length > 0;

    // 2. Build allowAccess array:
    //    - If restricted: ensure creator's userId is included & convert to ObjectIds
    //    - If empty/not passed: keep as [] to represent firm-wide access
    const hasAccess = isRestricted
      ? Array.from(
          new Set([...allowAccess, userId].map((id) => String(id)))
        ).map((id) => new mongoose.Types.ObjectId(id))
      : [];

    const client = clientId
      ? await getClientByClientIdService(clientId)
      : null;
    if (clientId && (!client || String(client.firmId) !== firmId)) {
      return res.status(404).json({ message: "Client not found" });
    }

    const data = await createMatterService({
      firmId: new mongoose.Types.ObjectId(firmId),
      userId: new mongoose.Types.ObjectId(userId),
      clientId: client?._id,
      template,
      title,
      description: description ?? matterDescription,
      responsibleAttorney: toAssigneeObjectIds(responsibleAttorney),
      originatingAttorney: toAssigneeObjectIds(originatingAttorney),
      responsibleStaff: toAssigneeObjectIds(responsibleStaff),
      startDate,
      endDate: endDate,
      allowAccess: hasAccess,
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
    if (!firmId || !userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await removeMatterService(matterId, firmId);
    if (!response) {
      return res.status(404).json({ message: "Matter not found" });
    }

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "CASE_MGMT",
      description: "Case was deleted",
      metadata: {
        actionId: response._id,
        actionTitle: response.title,
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
    const { data } = req.body ?? {};
    if (!firmId || !userId) {
      return res.status(401).json({ message: "Not authorized" });
    }
    if (!data || typeof data !== "object") {
      return res.status(400).json({ message: "No update data provided" });
    }

    const response = await updateMatterbyIdService(caseId, firmId, data);
    if (!response) {
      return res.status(404).json({ message: "Matter not found" });
    }

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "CASE_MGMT",
      description: "updated case",
      metadata: {
        actionId: response._id,
        actionTitle: response.title,
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
    if (!firmId || !userId) {
      return res.status(401).json({ message: "Not authorized" });
    }
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: "No updates provided" });
    }

    const response = await bulkUpdateMattersService(updates, firmId);

    await createLog({
      userId: userId,
      firmId: firmId,
      userName: userName,
      category: "CASE_MGMT",
      description: "updated cases",
      metadata: {},
    });

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};
