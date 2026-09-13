"use client";

import React, { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { NewTimeForm } from "./newTimeForm";
import { useAlertStore } from "@/app/store/use-alert";

export const StopWatch: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // 1. Properly type NodeJS / Browser Timeout Ref
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const showAlert = useAlertStore((state) => state.showAlert);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedTime;

      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    } else if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [isRunning, elapsedTime]);

  const startPause = () => setIsRunning((prev) => !prev);

  const reset = () => {
    setElapsedTime(0);
    setIsRunning(false);
  };

  const handleTriggerValidation = () => {
    // 5000ms = 5 seconds elapsed time safeguard
    if (!elapsedTime || elapsedTime < 5000) {
      showAlert(
        "Alert",
        "Cannot save time entries shorter than 5 seconds.",
        "warning"
      );
      return;
    }

    setIsRunning(false);
    setIsDialogOpen(true);
  };

  const formatTime = (): string => {
    const minutes = Math.floor(elapsedTime / (1000 * 60));
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10);

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0") +
      ":" +
      String(milliseconds).padStart(2, "0")
    );
  };

  return (
    <div className="flex items-center gap-x-4">
      <Timer className="size-10 text-[#64B7FF]" />
      <div className="w-[70px]">
        <span className="text-xs">Time</span>
        <p>{formatTime()}</p>
      </div>
      <div className="flex items-center gap-x-2">
        <Button className="rounded-full" size="icon" onClick={startPause}>
          {isRunning ? <Pause /> : <Play />}
        </Button>
        <Button
          variant="outline"
          className="rounded-full"
          size="icon"
          onClick={reset}
        >
          <RotateCcw />
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={handleTriggerValidation} variant="outline">
            Save
          </Button>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="p-1 flex justify-center items-center bg-gray-200 outline-gray-800 outline-dashed rounded-full h-10 w-10">
                  <Timer className="text-gray-600" size={25} />
                </div>
                Time entry
              </DialogTitle>
            </DialogHeader>
            <NewTimeForm
              currentTime={formatTime()}
              onClose={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
