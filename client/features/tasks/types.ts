export enum MatterStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  AT_RISK = "AT_RISK",
  DONE = "DONE",
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type Task = {
  _id: Key | null | undefined;
  name: string;
  status: TaskStatus;
  priority: string;
  workSpaceId: string;
  assigneeId: string;
  projectId: string;
  position: number;
  endDate: string;
  startDate: string;
  $id: string;
  SubTasksCompleted: number;
  subTasks: Task[];
};
