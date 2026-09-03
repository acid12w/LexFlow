import mongoose, { FilterQuery } from "mongoose";
import Task, { Task as ITaskInterface } from "../models /tasks.js";
import { syncMatterHealth } from "./matterHealthService.js";

const firmFilter = (firmId: string) => ({
  firmId: new mongoose.Types.ObjectId(firmId),
});

const applyTaskStatusSideEffects = (
  updateData: Record<string, unknown>
): Record<string, unknown> => {
  const next = { ...updateData };
  if (next.status === "DONE") {
    next.completedAt = next.completedAt ?? new Date();
  } else if (next.status !== undefined) {
    next.completedAt = null;
  }
  return next;
};

const syncHealthForTask = async (task: {
  matter?: mongoose.Types.ObjectId | null;
}) => {
  if (task?.matter) {
    await syncMatterHealth(task.matter);
  }
};

const getTaskByFirmIdService = async (firmId: string, userId: string) => {
  const tasks = await Task.find({
    ...firmFilter(firmId),
    $or: [{ user: userId }, { assignedTo: userId }],
  } as FilterQuery<ITaskInterface>);
  return tasks;
};

const getTaskByCaseIdService = async (caseId: string, firmId: string) => {
  return await Task.find({ matterId: caseId });
};

const createTaskService = async (taskData: Partial<ITaskInterface>) => {
  const payload = applyTaskStatusSideEffects(
    taskData as Record<string, unknown>
  );

  const newTask = await Task.create({
    user: taskData.user,
    matterId: taskData.matterId,
    firmId: taskData.firmId,
    title: taskData.title,
    description: taskData.description,
    eventType: taskData.eventType,
    status: payload.status ?? taskData.status,
    priority: taskData.priority,
    assignedTo: taskData.assignedTo,
    completedAt: payload.completedAt,
    assignedBy: taskData.assignedBy,
    startDate: taskData.startDate,
    endDate: taskData.endDate,
  });

  await syncHealthForTask(newTask);
  return newTask;
};

const removeTaskService = async (taskId: string, firmId: string) => {
  const task = await Task.findOne({ _id: taskId, ...firmFilter(firmId) });
  const deleted = await Task.findOneAndDelete({
    _id: taskId,
    ...firmFilter(firmId),
  });
  if (task?.matter) {
    await syncMatterHealth(task.matter);
  }
  return deleted;
};

const updateTaskbyIdService = async (
  taskId: string,
  firmId: string,
  updateData: Partial<ITaskInterface>
) => {
  const {
    firmId: _firm,
    user: _user,
    ...rest
  } = updateData as Record<string, unknown>;
  const safeUpdate = applyTaskStatusSideEffects(rest);

  const updated = await Task.findOneAndUpdate(
    { _id: taskId, ...firmFilter(firmId) },
    { $set: safeUpdate },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  if (updated) {
    await syncHealthForTask(updated);
  }
  return updated;
};

const bulkUpdateTasksService = async (
  updates: Array<Partial<ITaskInterface> & { _id: string }>,
  firmId: string
) => {
  const bulkOps = updates.map((update) => {
    const { _id, firmId: _f, user: _u, matter, ...rest } = update;
    const safeUpdate = applyTaskStatusSideEffects(
      rest as Record<string, unknown>
    );
    return {
      updateOne: {
        filter: { _id, ...firmFilter(firmId) },
        update: { $set: safeUpdate },
        runValidators: true,
      },
    };
  });

  const result = await Task.bulkWrite(bulkOps, { ordered: false });

  const matterIds = new Set<string>();
  for (const update of updates) {
    if (update.matter) {
      matterIds.add(String(update.matter));
    } else if (update._id) {
      const task = await Task.findById(update._id).select("matter").lean();
      if (task?.matter) matterIds.add(String(task.matter));
    }
  }

  await Promise.all([...matterIds].map((id) => syncMatterHealth(id)));

  return result;
};

export {
  getTaskByFirmIdService,
  getTaskByCaseIdService,
  createTaskService,
  removeTaskService,
  updateTaskbyIdService,
  bulkUpdateTasksService,
};
