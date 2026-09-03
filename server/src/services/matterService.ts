import mongoose, { FilterQuery } from "mongoose";
import Matter, { Matter as IMatterInterface } from "../models /matter.js";
import {
  MATTER_STATUS,
  syncMatterHealthForFirm,
} from "./matterHealthService.js";
import Task from "#models /tasks.js";

const firmFilter = (firmId: string) => ({
  firmId: new mongoose.Types.ObjectId(firmId),
});

const stripComputedMatterFields = (data: Record<string, unknown>) => {
  const {
    status: _status,
    taskCount: _taskCount,
    completedTaskCount: _completed,
    ...safe
  } = data;
  return safe;
};

const getAllMattersService = async (firmId, userId) => {
  await syncMatterHealthForFirm(firmId);

  const matters = await Matter.find({
    firmId,
    $or: [
      // Matter is available to everyone
      {
        allowAccess: {
          $size: 0,
        },
      },

      // User has explicitly been granted access
      {
        allowAccess: userId,
      },
    ],
  }).lean();

  const matter2 = await Matter.find({
    firmId: new mongoose.Types.ObjectId(firmId),
  });

  console.log(matter2);

  return matters;
};

const getMatterByUserIdService = async (firmId: string, userId: string) => {
  return await Matter.find({
    ...firmFilter(firmId),
    $or: [{ userId }, { assignedTo: userId }],
  } as FilterQuery<IMatterInterface>);
};

const getMatterByIdService = async (firmId: string, caseId: string) => {
  return await Matter.findOne({
    ...firmFilter(firmId),
    _id: caseId,
  } as FilterQuery<IMatterInterface>);
};

const createMatterService = async (data: Partial<IMatterInterface>) => {
  const newMatter = await Matter.create({
    firmId: data.firmId,
    userId: data.userId,
    title: data.title,
    description: data.description,
    responsibleAttorney: data.responsibleAttorney,
    originatingAttorney: data.originatingAttorney,
    responsibleStaff: data.responsibleStaff,
    status: MATTER_STATUS.NOT_STARTED,
    taskCount: 0,
    completedTaskCount: 0,
    startDate: data.startDate,
    endDate: data.endDate,
    priority: data.priority,
    isBillable: data.isBillable,
    billingMethods: data.billingMethods,
    // taskList: data.taskList,
    practiceArea: data.practiceArea,
    // s
    clientId: data.clientId,
  });

  return newMatter;
};

const removeMatterService = async (matterId: string, firmId: string) => {
  // 1. Delete tasks linked to this matter (using the matter's foreign key)
  const taskResult = await Task.deleteMany({ matterId: matterId });
  console.log(taskResult);

  // 2. Delete the matter and return the document as it existed BEFORE deletion
  return await Matter.findOneAndDelete(
    { _id: matterId, firmId: firmId }, // Security: ensure it belongs to the firm
    { returnDocument: "before" }
  );
};

const updateMatterbyIdService = async (
  caseId: string,
  firmId: string,
  updateData: Partial<IMatterInterface>
) => {
  const safeUpdate = stripComputedMatterFields(
    updateData as Record<string, unknown>
  );

  return await Matter.findOneAndUpdate(
    { _id: caseId, ...firmFilter(firmId) },
    { $set: safeUpdate },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );
};

const bulkUpdateMattersService = async (
  updates: Array<Partial<IMatterInterface> & { _id: string }>,
  firmId: string
) => {
  const bulkOps = updates.map((update) => {
    const {
      _id,
      firmId: _f,
      status: _s,
      taskCount: _tc,
      completedTaskCount: _cc,
      ...rest
    } = update as Partial<IMatterInterface> & {
      _id: string;
      firmId?: unknown;
      status?: unknown;
      taskCount?: unknown;
      completedTaskCount?: unknown;
    };
    return {
      updateOne: {
        filter: { _id, ...firmFilter(firmId) },
        update: { $set: rest },
        runValidators: true,
      },
    };
  });

  return await Matter.bulkWrite(bulkOps, { ordered: false });
};

export {
  getAllMattersService,
  getMatterByUserIdService,
  getMatterByIdService,
  createMatterService,
  removeMatterService,
  updateMatterbyIdService,
  bulkUpdateMattersService,
};
