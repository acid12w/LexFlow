import mongoose, { PipelineStage } from "mongoose";
import TimeTracker, {
  TimeTracker as ItimeTrackerInterface,
} from "../models /timeTracker.js";

const firmFilter = (firmId: string) => ({
  firmId: new mongoose.Types.ObjectId(firmId),
});

export const createTimeTrackerService = async (
  timeTrackerData: Partial<ItimeTrackerInterface>
) => {
  return await TimeTracker.create(timeTrackerData);
};

export const getTimeTrackerByIdService = async (
  userId: string,
  firmId: string
) => {
  return await TimeTracker.find({
    user: new mongoose.Types.ObjectId(userId),
    ...firmFilter(firmId),
  });
};

export const getTimeTrackerdService = async (
  userId: string | undefined,
  firmId: string | undefined
): Promise<number> => {
  if (!userId || !firmId) return 0;

  const result = await TimeTracker.collection
    .aggregate([
      // 1. Filter for the specified user and firm
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          ...firmFilter(firmId),
        },
      },
      // 2. Convert "HH:MM:SS" into total seconds per document
      {
        $addFields: {
          parts: {
            $map: {
              input: { $split: ["$duration", ":"] },
              as: "p",
              in: { $toInt: "$$p" },
            },
          },
        },
      },
      {
        $addFields: {
          seconds: {
            $add: [
              { $multiply: [{ $arrayElemAt: ["$parts", 0] }, 3600] }, // Hours to seconds
              { $multiply: [{ $arrayElemAt: ["$parts", 1] }, 60] }, // Minutes to seconds
              { $arrayElemAt: ["$parts", 2] }, // Seconds
            ],
          },
        },
      },
      // 3. Sum total seconds across all matched documents
      {
        $group: {
          _id: "$user",
          totalSeconds: { $sum: "$seconds" },
        },
      },
    ])
    .toArray();

  // Returns total seconds (e.g. 963 seconds), or 0 if no records found
  return result[0]?.totalSeconds ?? 0;
};

export const updateTimeTrackerByIdService = async (
  id: string,
  firmId: string,
  userId: string,
  timeTrackerData: Partial<ItimeTrackerInterface>
) => {
  const {
    firmId: _firm,
    user: _user,
    ...safeUpdate
  } = timeTrackerData as Record<string, unknown>;

  return await TimeTracker.findOneAndUpdate(
    {
      _id: id,
      user: new mongoose.Types.ObjectId(userId),
      ...firmFilter(firmId),
    },
    safeUpdate,
    { new: true, runValidators: true }
  );
};

export const deleteTimeTrackerByIdService = async (
  id: string,
  firmId: string,
  userId: string
) => {
  return await TimeTracker.findOneAndDelete({
    _id: id,
    user: new mongoose.Types.ObjectId(userId),
    ...firmFilter(firmId),
  });
};

export const getTimeTrackerSnapshot = async (
  userId: string | undefined,
  firmId: string | undefined
) => {
  if (!firmId) {
    throw new Error("firmId is required to fetch time tracker snapshots.");
  }

  // 1. Calculate start and end of the current week (Monday to Sunday)
  const now = new Date();
  const currentDay = now.getDay();
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + distanceToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // 2. Build the $match query
  const matchQuery: Record<string, any> = {
    firmId: new mongoose.Types.ObjectId(firmId),
    date: {
      $gte: startOfWeek,
      $lte: endOfWeek,
    },
  };

  if (userId) {
    matchQuery.user = new mongoose.Types.ObjectId(userId);
  }

  // 3. Define Pipeline with Duration String Parsing
  const pipeline: PipelineStage[] = [
    { $match: matchQuery },
    {
      $addFields: {
        // Convert duration string 'HH:MM:SS' into total seconds (or minutes)
        // If your string format differs, adjust the array indices accordingly
        numericDuration: {
          $let: {
            vars: {
              parts: { $split: ["$duration", ":"] },
            },
            in: {
              $add: [
                {
                  $multiply: [
                    { $toInt: { $arrayElemAt: ["$$parts", 0] } },
                    3600,
                  ],
                }, // Hours to seconds
                {
                  $multiply: [{ $toInt: { $arrayElemAt: ["$$parts", 1] } }, 60],
                }, // Minutes to seconds
                { $toDouble: { $arrayElemAt: ["$$parts", 2] } }, // Seconds/fractions
              ],
            },
          },
        },
        // Normalize isBillable string/boolean
        isBillableBool: {
          $in: ["$isBillable", [true, "true", "TRUE", 1]],
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        billableDuration: {
          $sum: {
            $cond: [{ $eq: ["$isBillableBool", true] }, "$numericDuration", 0],
          },
        },
        nonBillableDuration: {
          $sum: {
            $cond: [{ $eq: ["$isBillableBool", false] }, "$numericDuration", 0],
          },
        },
        totalDuration: {
          $sum: "$numericDuration",
        },
      },
    },
    { $sort: { _id: 1 } },
    {
      $group: {
        _id: null,
        dailyBreakdown: {
          $push: {
            date: "$_id",
            billableDuration: "$billableDuration",
            nonBillableDuration: "$nonBillableDuration",
            totalDuration: "$totalDuration",
          },
        },
        totalBillableWeek: { $sum: "$billableDuration" },
        totalNonBillableWeek: { $sum: "$nonBillableDuration" },
        grandTotalWeek: { $sum: "$totalDuration" },
      },
    },
    {
      $project: {
        _id: 0,
        dailyBreakdown: 1,
        summary: {
          totalBillable: "$totalBillableWeek",
          totalNonBillable: "$totalNonBillableWeek",
          grandTotal: "$grandTotalWeek",
        },
      },
    },
  ];

  const result = await TimeTracker.aggregate(pipeline);

  return (
    result[0] || {
      dailyBreakdown: [],
      summary: {
        totalBillable: 0,
        totalNonBillable: 0,
        grandTotal: 0,
      },
    }
  );
};
