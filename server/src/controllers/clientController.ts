import { Request, Response, NextFunction } from "express";
import {
  getClientService,
  getAllClientsService,
  getCaseByClientId,
  getClientByClientIdService,
  createClientService,
  deleteClientService,
} from "#services/clientService.js";
import mongoose from "mongoose";

export const getClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const firmId = req.user?.firmId;
    const { id } = req.params;

    const response = await getClientService(id, firmId);

    res.status(201).json({
      success: true,
      data: response,
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

    const response = await getAllClientsService(firmId);

    res.status(201).json({
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

    const clientId = req.params.id;

    const userData = await getClientByClientIdService(clientId);
    const data = await getCaseByClientId(clientId, firmId);

    res.status(201).json({
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
      clientContactNumber,
      email: clientEmail,
      clientType,
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
    const firmId = req.user.firmId;
    console.log(firmId);
    const response = await ActivityLog.find({ firmId: firmId });

    res.status(201).json({
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
    const clientId = req.params.id;

    console.log(clientId);
    const response = await deleteClientService(clientId);

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};
