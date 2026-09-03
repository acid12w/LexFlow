import mongoose from "mongoose";
import Matter from "../models /matter.js";
import Task from "../models /tasks.js";

export const MATTER_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  AT_RISK: "AT_RISK",
} as const;

export type MatterStatus = (typeof MATTER_STATUS)[keyof typeof MATTER_STATUS];

const COMPLETED_TASK_STATUS = "DONE";

type TaskLike = { status?: string };

export function computeMatterHealthFromTasks(
  tasks: TaskLike[],
  dueDate?: Date | null
): {
  status: MatterStatus;
  taskCount: number;
  completedTaskCount: number;
} {
  console.log(tasks);
  const taskCount = tasks.length;
  const completedTaskCount = tasks.filter(
    (t) => t.status === COMPLETED_TASK_STATUS
  ).length;

  let status: MatterStatus = MATTER_STATUS.NOT_STARTED;

  if (taskCount === 0) {
    status = MATTER_STATUS.NOT_STARTED;
  } else if (completedTaskCount === taskCount) {
    status = MATTER_STATUS.DONE;
  } else if (completedTaskCount > 0) {
    status = MATTER_STATUS.IN_PROGRESS;
  } else {
    const hasActiveWork = tasks.some((t) =>
      ["IN_PROGRESS", "IN_REVIEW"].includes(t.status ?? "")
    );
    status = hasActiveWork
      ? MATTER_STATUS.IN_PROGRESS
      : MATTER_STATUS.NOT_STARTED;
  }

  if (
    dueDate &&
    status !== MATTER_STATUS.DONE &&
    new Date() > new Date(dueDate)
  ) {
    status = MATTER_STATUS.AT_RISK;
  }

  return { status, taskCount, completedTaskCount };
}

export async function syncMatterHealth(
  matterId: string | mongoose.Types.ObjectId
) {
  const id = new mongoose.Types.ObjectId(matterId);
  const matter = await Matter.findById(id);
  if (!matter) return null;

  const tasks = await Task.find({ matterId: id }).select("status").lean();
  const { status, taskCount, completedTaskCount } =
    computeMatterHealthFromTasks(tasks, matter.dueDate);

  return Matter.findByIdAndUpdate(
    id,
    { $set: { status, taskCount, completedTaskCount } },
    { new: true }
  );
}

export async function syncMatterHealthByTaskId(taskId: string) {
  const task = await Task.findById(taskId).select("matter").lean();
  if (!task?.matterId) return null;
  return syncMatterHealth(task.matterId);
}

export async function syncMatterHealthForFirm(firmId: string) {
  const matters = await Matter.find({
    firmId: new mongoose.Types.ObjectId(firmId),
  }).select("_id");

  await Promise.all(matters.map((m) => syncMatterHealth(m._id)));
}
