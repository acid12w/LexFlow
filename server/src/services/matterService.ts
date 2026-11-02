import mongoose, { FilterQuery } from "mongoose";
import Matter, { Matter as IMatterInterface } from "../models /matter.js";
import {
  MATTER_STATUS,
  syncMatterHealthForFirm,
} from "./matterHealthService.js";
import Task from "#models /tasks.js";

const firmFilter = (firmId: string | undefined) => ({
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

const getAllMattersService = async (
  firmId: string | undefined,
  userId: string | undefined
) => {
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

const getMatterByUserIdService = async (
  firmId: string | undefined,
  userId: string | undefined
) => {
  return await Matter.find({
    ...firmFilter(firmId),
    $or: [{ userId }, { assignedTo: userId }],
  } as FilterQuery<IMatterInterface>);
};

const getMatterByIdService = async (
  firmId: string | undefined,
  caseId: string | string[]
) => {
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
    allowAccess: data.allowAccess,
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

const removeMatterService = async (
  matterId: string | undefined,
  firmId: string | undefined
) => {
  // 1. Delete the matter first, scoped to the firm, so another firm's tasks
  //    can't be wiped by guessing a matter id
  const matter = await Matter.findOneAndDelete(
    { _id: matterId, firmId: firmId },
    { returnDocument: "before" }
  );
  if (!matter) return null;

  // 2. Delete tasks linked to this matter (using the matter's foreign key)
  await Task.deleteMany({ matterId: matter._id });

  return matter;
};

const updateMatterbyIdService = async (
  caseId: string | undefined,
  firmId: string | undefined,
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

const getMattersDueSoon = async (
  firmId: string | undefined,
  userId?: string | undefined
) => {
  if (!firmId) {
    throw new Error("firmId is required to fetch upcoming matters.");
  }

  // 1. Get the start of today (midnight) matching your helper function logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 2. Build the standard base match query
  const matchQuery: Record<string, any> = {
    firmId: new mongoose.Types.ObjectId(firmId),
    endDate: { $exists: true, $ne: null }, // Ensure endDate exists
  };

  if (userId) {
    matchQuery.userId = new mongoose.Types.ObjectId(userId);
  }

  // 3. Define the Aggregation Pipeline using $expr for date math
  const pipeline = [
    {
      $match: {
        ...matchQuery,
        $expr: {
          $lt: [
            {
              $floor: {
                $divide: [
                  { $subtract: ["$endDate", today] }, // Difference in milliseconds
                  1000 * 60 * 60 * 24, // Milliseconds in a day
                ],
              },
            },
            5, // getDaysBetweenDates < 5
          ],
        },
      },
    },
    // Optional: Attach 'daysLeft' to the returned documents so you can easily display it in UI
    {
      $addFields: {
        daysLeft: {
          $floor: {
            $divide: [{ $subtract: ["$endDate", today] }, 1000 * 60 * 60 * 24],
          },
        },
      },
    },
    // Sort by closest deadline first
    {
      $sort: {
        endDate: 1,
      },
    },
  ];

  // 4. Execute aggregation on the Matter model
  const MatterModel = mongoose.models.Matter || mongoose.model("Matter");
  const results = await MatterModel.aggregate(pipeline);

  return results;
};

export {
  getAllMattersService,
  getMatterByUserIdService,
  getMatterByIdService,
  createMatterService,
  removeMatterService,
  updateMatterbyIdService,
  bulkUpdateMattersService,
  getMattersDueSoon,
};
