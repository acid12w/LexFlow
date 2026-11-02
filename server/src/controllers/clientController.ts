import { Request, Response, NextFunction } from "express";
import {
  getAllClientsService,
  getCaseByClientId,
  getClientByClientIdService,
  createClientService,
  deleteClientService,
  getClientMatters,
  updateClientService,
} from "#services/clientService.js";
import mongoose from "mongoose";

// Loads a client only if it belongs to the requesting user's firm
const getFirmClient = async (clientId: string, firmId: string) => {
  if (!mongoose.Types.ObjectId.isValid(clientId)) return null;
  const client = await getClientByClientIdService(clientId);
  if (!client || String(client.firmId) !== firmId) return null;
  return client;
};

export const getClientDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientId = String(req.params.id);
    const firmId = req.user?.firmId;
    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const clientData = await getFirmClient(clientId, firmId);
    if (!clientData) {
      return res.status(404).json({ message: "Client not found" });
    }
    const clientMatters = await getClientMatters(clientId);

    res.status(200).json({
      success: true,
      clientData,
      clientMatters,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllClients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const firmId = req.user?.firmId;
    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await getAllClientsService(firmId);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const getMilestone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const firmId = req.user?.firmId;
    const clientId = String(req.params.id);
    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userData = await getFirmClient(clientId, firmId);
    if (!userData) {
      return res.status(404).json({ message: "Client not found" });
    }
    const data = await getCaseByClientId(clientId);

    res.status(200).json({
      success: true,
      userData,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const firmId = req.user?.firmId;
    const userId = req.user?.id;
    if (!firmId || !userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const {
      firstName,
      lastName,
      clientContactNumber,
      clientEmail,
      clientType,
      refrenceNumber,
    } = req.body;

    const response = await createClientService({
      firmId: new mongoose.Types.ObjectId(firmId),
      userId: new mongoose.Types.ObjectId(userId),
      firstName,
      lastName,
      phone: clientContactNumber,
      email: clientEmail,
      refrenceNumber,
      type: clientType,
      status: "Active",
      createdBy: new mongoose.Types.ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const updateClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientId = String(req.params.id);
    const firmId = req.user?.firmId;
    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const existing = await getFirmClient(clientId, firmId);
    if (!existing) {
      return res.status(404).json({ message: "Client not found" });
    }

    const {
      _id: _ignoredId,
      firmId: _ignoredFirm,
      userId: _ignoredUser,
      createdBy: _ignoredCreatedBy,
      createdAt: _ignoredCreatedAt,
      ...safeUpdate
    } = req.body ?? {};

    const response = await updateClientService({
      ...safeUpdate,
      _id: clientId,
      updatedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientId = String(req.params.id);
    const firmId = req.user?.firmId;
    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const existing = await getFirmClient(clientId, firmId);
    if (!existing) {
      return res.status(404).json({ message: "Client not found" });
    }

    const response = await deleteClientService(clientId);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};
