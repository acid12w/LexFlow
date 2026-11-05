"use client";

import { cn } from "@/lib/utils";

function getDaysBetweenDates(endDate: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  const msInADay = 1000 * 60 * 60 * 24;
  return Math.floor((end.getTime() - now.getTime()) / msInADay);
}

interface DateAlertProps {
  date: Date;
}

export const DateAlert = ({ date }: DateAlertProps) => {
  const parsed = new Date(date);
  const formattedShort = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(parsed);

  const daysLeft = getDaysBetweenDates(date);

  const label =
    daysLeft < 0
      ? `${Math.abs(daysLeft)} days overdue`
      : daysLeft === 0
      ? "Due today"
      : `${daysLeft} days left`;

  return (
    <div
      className={cn(
        "px-3 py-1 rounded-sm font-medium text-sm w-fit capitalize",
        daysLeft <= 3
          ? "bg-[#ffeaea] dark:bg-[#ff3838]/15 text-[#fc3838] dark:text-[#ff6b6b]"
          : "bg-muted text-muted-foreground"
      )}
    >
      <p>{daysLeft <= 5 ? label : formattedShort}</p>
    </div>
  );
};
