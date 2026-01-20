import { DataCalendar } from "@/features/calendar/data-calendar";
import { Task, TaskStatus } from "@/features/tasks/types";

const data: Task[] = [
  {
    name: "John doe deposition",
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
    name: "Tim Montly sale of land",
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
    name: "Bob Phillips Murder trial",
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
        name: "Bob Phillips Murder trial",
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
        name: "Tim Montly sale of land",
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

const Calendar = () => {
  return (
    <div>
      <DataCalendar data={data || []} />
    </div>
  );
};

export default Calendar;
