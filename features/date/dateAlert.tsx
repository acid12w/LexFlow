"use client";

import { cn } from "@/lib/utils";

function getDaysBetweenDates(endDate: string): number {
  // Convert both dates to their millisecond timestamps
  const now: Date = new Date();
  now.setHours(0, 0, 0, 0);
  const startMs = now;
  const endMs = new Date(endDate);

  // Convert milliseconds to days: (1000ms * 60s * 60m * 24h)
  const msInADay = 1000 * 60 * 60 * 24;

  // Calculate difference without Math.abs() to preserve the sign
  const diffInDays = Math.floor(
    (endMs.getTime() - startMs.getTime()) / msInADay
  );

  // Return a message for negative values, otherwise the number
  return diffInDays + 1;
}

interface DateAlertProps {
  date: string;
}

export const DateAlert = ({ date }: DateAlertProps) => {
  console.log(getDaysBetweenDates(date));
  const daysLeft = getDaysBetweenDates(date);
  return (
    <div
      className={cn(
        "px-3 py-1 rounded-sm font-medium text-sm w-fit capitalize", // Base classes
        daysLeft <= 3
          ? "bg-[#ffeaea] text-[#fc3838]"
          : "bg-gray-100 text-gray-500" // Ternary logic
      )}
    >
      <p className="">
        {daysLeft < 0
          ? Math.abs(daysLeft) + " over due"
          : daysLeft + " days left"}
      </p>
    </div>
  );
};
