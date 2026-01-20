export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type Task = {
  name: string;
  status: TaskStatus;
  priority: string;
  workSpaceId: string;
  assigneeId: string;
  projectId: string;
  position: number;
  dueDate: string;
  $id: string;
  SubTasksCompleted: number;
  subTasks: Task[];
};
