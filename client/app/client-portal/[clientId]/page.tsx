"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetMilestone } from "@/hooks/useClientHook";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ClientProgressPage = () => {
  // Mocking the current active step index (change this to see changes)
  const currentStepIndex = 1;
  const params = useParams();

  // Safely extract client ID or cast it if needed
  const clientId = Array.isArray(params.clientId)
    ? params.clientId[0]
    : params.clientId;

  const {
    data: MILESTONES,
    isLoading,
    isError,
  } = useGetMilestone(clientId || "");

  // 2. Professional Loading State
  if (isLoading) {
    return (
      <div className="space-y-3 px-2">
        <Skeleton className="h-[40px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  // 3. Error Handling / Empty Data Safeguard
  if (isError || !MILESTONES?.data?.data?.response) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error fetching tasks</AlertTitle>
        <AlertDescription>
          There has been an error or data is missing.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <main className="p-6 flex justify-center items-center flex-col">
      <h1 className="text-3xl font-bold">
        Hi {MILESTONES?.data?.userData?.firstName}{" "}
        {MILESTONES?.data?.userData?.lastName},
      </h1>
      <p className="mb-10">see where we are at with your project</p>

      <div className="flex flex-wrap items-start justify-center gap-24">
        {/* ADDED 'return' HERE FOR THE OUTER MAP LOOP */}
        {MILESTONES.data.data.response.map((steps) => {
          return steps.milestones.map((step, index) => {
            const isCompleted = step.status === "DONE";
            const isLast = index === steps.milestones.length - 1;

            return (
              <div
                key={step._id || index}
                className="relative flex flex-col items-center flex-1 min-w-[150px] max-w-[150px]"
              >
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute top-3 left-[calc(50%+18px)] right-[-50%] h-[2px] -z-10 w-[140%]",
                      index < currentStepIndex ? "bg-green-600" : "bg-green-200"
                    )}
                  />
                )}

                {/* Step Circle */}
                <div
                  className={cn(
                    "font-bold w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200",
                    isCompleted
                      ? "bg-green-600 text-white"
                      : "border-green-600 border-2 text-green-800"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>

                {/* Text Content */}
                <div className="text-center mt-3">
                  <h3 className="font-medium text-sm text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          });
        })}
      </div>
    </main>
  );
};

export default ClientProgressPage;
