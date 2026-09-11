"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DataKanban } from "@/features/tasks/data-kanban";
import { Task, TaskStatus } from "@/features/tasks/types";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const KanbanBoard = ({
  tasksData,
  isLoading,
}: {
  tasksData: Task[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3 px-2">
        <Skeleton className="h-10 w-full" /> {/* Search bar skeleton */}
        <Skeleton className="h-[300px] w-full" /> {/* Table skeleton */}
      </div>
    );
  }

  return (
    <>
      <div className="px-2">
        <DataKanban data={tasksData || []} />
      </div>
    </>
  );
};

export default KanbanBoard;
