"user client";

import React, { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CirclePlus, Pause, Play, RotateCcw, Save, Timer } from "lucide-react";
import { NewTimeForm } from "./newTimeForm";
import { TbSubtask } from "react-icons/tb";
import { useAlertStore } from "@/app/store/use-alert";

export const StopWatch = (userData) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);

  const showAlert = useAlertStore((state) => state.showAlert);
  useEffect(() => {
    if (isRunning) {
      // Calculate start time based on current time minus any previously elapsed time
      startTimeRef.current = Date.now() - elapsedTime;

      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10); // Updates every 10ms for smooth millisecond tracking
    } else {
      clearInterval(intervalIdRef.current);
    }

    return () => clearInterval(intervalIdRef.current);
  }, [isRunning]);

  const startPause = () => setIsRunning(!isRunning);

  const reset = () => {
    setElapsedTime(0);
    setIsRunning(false);
  };

  const [currentTime, setCurrentTime] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTriggerValidation = () => {
    // SAFEGUARD: Block empty or near-empty logs (e.g., less than 5 seconds)
    if (!elapsedTime || elapsedTime < 5) {
      showAlert(
        "Alert",
        "Cannot save time entries shorter than 5 seconds.",
        "warning"
      );
      return; // 🛑 BLOCKS the execution line; window will not open
    }

    // SUCCESS: Pause the timer and cleanly open the Dialog window
    setIsRunning(false);
    setIsDialogOpen(true);
  };

  const formatTime = () => {
    let minutes = Math.floor(elapsedTime / (1000 * 60));
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

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
        <Button
          className="rounded-full"
          size={"icon"}
          onClick={() => startPause()}
        >
          {isRunning ? <Pause /> : <Play />}
        </Button>
        <Button
          variant={"outline"}
          className="rounded-full"
          size="icon"
          onClick={() => reset()}
        >
          <RotateCcw />
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={() => handleTriggerValidation()} variant="outline">
            Save
          </Button>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="p-1 flex justify-center items-center bg-gray-200 outline-gray-800 outline-dashed rounded-full h-10 w-10">
                  <Timer className=" text-gray-600 " size={25} />
                </div>
                Time entry
              </DialogTitle>
            </DialogHeader>
            <NewTimeForm
              userData={userData}
              currentTime={formatTime()}
              onClose={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
