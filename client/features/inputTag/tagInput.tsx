// input-tags.tsx

"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input">;

type InputTagsProps = Omit<InputProps, "value" | "onChange"> & {
  value: string[];
  onChange: (value: string[]) => void;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value = [], onChange, onKeyDown, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");

    React.useEffect(() => {
      if (pendingDataPoint.includes(",")) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint
            .split(",")
            .map((chunk) => chunk.trim())
            .filter(Boolean),
        ]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
      const trimmed = pendingDataPoint.trim();
      if (trimmed) {
        const newDataPoints = new Set([...value, trimmed]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addPendingDataPoint();
      } else if (
        e.key === "Backspace" &&
        pendingDataPoint.length === 0 &&
        value.length > 0
      ) {
        e.preventDefault();
        onChange(value.slice(0, -1));
      }

      // Delegate custom onKeyDown handler if provided in props
      onKeyDown?.(e);
    };

    return (
      <div
        className={cn(
          "has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-neutral-950 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-neutral-300 min-h-10 flex w-full flex-wrap gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950",
          className
        )}
      >
        {value.map((item) => (
          <Badge
            key={item}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {item}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-3 w-3 p-0 hover:bg-transparent"
              onClick={() => {
                onChange(value.filter((i) => i !== item));
              }}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <input
          {...props}
          ref={ref}
          className={cn(
            "flex-1 outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 bg-transparent"
          )}
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }
);

InputTags.displayName = "InputTags";

export { InputTags };
