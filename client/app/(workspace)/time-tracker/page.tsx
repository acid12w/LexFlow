"use client";

import { TimeTrackerDataTable } from "@/features/table/TimeTrackerDataTable";

import { useGetTimeTrackerByUserId } from "@/hooks/useTimeTrackerHook";
import { TimeStampActionBtn } from "@/features/actionBtn/timeStampActionBtn";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const TimeTracker = () => {
  const {
    data: timeStampData,
    isLoading,
    isError,
    error,
  } = useGetTimeTrackerByUserId();

  // 2. Professional Loading State
  if (isLoading) {
    return (
      <div className="space-y-3 px-2">
        <Skeleton className="h-[40px] w-full" /> {/* Search bar skeleton */}
        <Skeleton className="h-[300px] w-full" /> {/* Table skeleton */}
      </div>
    );
  }

  // 3. Error Handling
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error fetching tasks</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <TimeTrackerDataTable
        ActionDropdown={TimeStampActionBtn}
        initialData={timeStampData?.data || []}
      />
    </div>
  );
};

export default TimeTracker;
