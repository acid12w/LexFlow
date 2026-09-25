"use client";

import React, { useCallback, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { Task, TaskStatus } from "./types";
import { KanbanColumnHeader } from "./kanbanColumnHeader";
import { KanbanCard } from "./kanbanCard";

import { useBulkUpdateTasks } from "@/hooks/task";

const boards: TaskStatus[] = [
  // TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TasksState = {
  [key in TaskStatus]: Task[];
};

interface DataKanbanProps {
  data: Task[];
}

interface TaskPositionUpdate {
  _id: string | null | undefined;
  status: TaskStatus;
  position: number;
}

export const DataKanban = ({ data }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      // [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task: Task) => {
      const status = task?.status;
      if (
        status &&
        Object.prototype.hasOwnProperty.call(initialTasks, status)
      ) {
        initialTasks[status as TaskStatus].push(task);
      }
    });

    (Object.keys(initialTasks) as TaskStatus[]).forEach((status) => {
      initialTasks[status].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      );
    });

    return initialTasks;
  });

  const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const sourceStatus = source.droppableId as TaskStatus;
      const destStatus = destination.droppableId as TaskStatus;

      let updatePayload: TaskPositionUpdate[] = [];

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };

        const sourceColumn = [...newTasks[sourceStatus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);

        if (!movedTask) return prevTasks;

        const updatedTask =
          sourceStatus !== destStatus
            ? { ...movedTask, status: destStatus }
            : movedTask;

        newTasks[sourceStatus] = sourceColumn;

        const destColumn = [...newTasks[destStatus]];
        destColumn.splice(destination.index, 0, updatedTask);
        newTasks[destStatus] = destColumn;

        // Build payload
        updatePayload = [];

        destColumn.forEach((task, index) => {
          updatePayload.push({
            _id: task._id,
            status: destStatus,
            position: (index + 1) * 1000,
          });
        });

        if (sourceStatus !== destStatus) {
          sourceColumn.forEach((task, index) => {
            updatePayload.push({
              _id: task._id,
              status: sourceStatus,
              position: (index + 1) * 1000,
            });
          });
        }

        return newTasks;
      });

      if (updatePayload.length > 0) {
        bulkUpdate(updatePayload);
      }
    },
    [bulkUpdate]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto mt-5">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-[#F7F9FD] p-3 rounded-md min-w-[200px]"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[board].map((taskItem, index) => (
                      <Draggable
                        key={taskItem._id}
                        draggableId={String(taskItem._id)}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={
                              provided.draggableProps
                                .style as React.CSSProperties
                            }
                          >
                            <KanbanCard tasks={taskItem} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
