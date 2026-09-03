import mongoose from "mongoose";
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
  return await TimeTracker.find({ user: userId, ...firmFilter(firmId) });
};

export const updateTimeTrackerByIdService = async (
  id: string,
  firmId: string,
  timeTrackerData: Partial<ItimeTrackerInterface>
) => {
  const { firmId: _firm, user: _user, ...safeUpdate } =
    timeTrackerData as Record<string, unknown>;

  return await TimeTracker.findOneAndUpdate(
    { _id: id, ...firmFilter(firmId) },
    safeUpdate,
    { new: true }
  );
};

export const deleteTimeTrackerByIdService = async (
  id: string,
  firmId: string
) => {
  return await TimeTracker.findOneAndDelete({ _id: id, firmId });
};
