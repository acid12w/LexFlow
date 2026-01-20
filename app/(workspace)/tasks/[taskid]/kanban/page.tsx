"use client";

import { DataKanban } from "@/features/tasks/data-kanban";
import { Task, TaskStatus } from "@/features/tasks/types";

const data: Task[] = [
  {
    name: "John doe ",
    status: TaskStatus.TODO,
    priority: "low", // Replace TODO with a valid TaskStatus value if needed
    workSpaceId: "sjfd",
    assigneeId: "sjfd",
    projectId: "sjfd",
    position: 1,
    dueDate: "2026-01-23",
    $id: "1",
    subTasks: [],
    SubTasksCompleted: 0,
  },
  {
    name: "gorege court hearing",
    status: TaskStatus.IN_PROGRESS,
    priority: "high", // Replace TODO with a valid TaskStatus value if needed
    workSpaceId: "ubdfkb",
    assigneeId: "ubdfkb",
    projectId: "ubdfkb",
    position: 2,
    dueDate: "2026-01-10",
    $id: "2",
    subTasks: [],
    SubTasksCompleted: 0,
  },
  {
    name: "gorege court hearing",
    status: TaskStatus.IN_REVIEW,
    priority: "medium", // Replace TODO with a valid TaskStatus value if needed
    workSpaceId: "ubdfkb",
    assigneeId: "ubdfkb",
    projectId: "ubdfkb",
    position: 2,
    dueDate: "2026-01-15",
    $id: "3",
    SubTasksCompleted: 1,
    subTasks: [
      {
        name: "gorege court hearing",
        status: TaskStatus.IN_REVIEW,
        priority: "medium", // Replace TODO with a valid TaskStatus value if needed
        $id: "1",
        workSpaceId: "ubdfkb",
        assigneeId: "ubdfkb",
        projectId: "ubdfkb",
        position: 2,
        dueDate: "2026-01-15",
        subTasks: [],
        SubTasksCompleted: 0,
      },
      {
        name: "gorege court hearing",
        status: TaskStatus.IN_REVIEW,
        priority: "medium", // Replace TODO with a valid TaskStatus value if needed
        $id: "2",
        workSpaceId: "ubdfkb",
        assigneeId: "ubdfkb",
        projectId: "ubdfkb",
        position: 2,
        dueDate: "2026-01-15",
        subTasks: [],
        SubTasksCompleted: 0,
      },
    ],
  },
];

const KanbanBoard = () => {
  return (
    <>
      <div className="px-2">
        <DataKanban data={data} />
      </div>
    </>
  );
};

export default KanbanBoard;
