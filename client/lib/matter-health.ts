export const MATTER_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  AT_RISK: "AT_RISK",
} as const;

export type MatterStatus = (typeof MATTER_STATUS)[keyof typeof MATTER_STATUS];

export const MATTER_STATUS_LABELS: Record<MatterStatus, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  DONE: "Done",
  AT_RISK: "At risk",
};

export function matterStatusClassName(status: string) {
  switch (status) {
    case MATTER_STATUS.DONE:
      return "bg-[#d9fcf4] text-[#03a24e]";
    case MATTER_STATUS.IN_PROGRESS:
      return "bg-[#E2F1FF] text-[#006bc9] dark:bg-[#006bc9] dark:text-[#E2F1FF]";
    case MATTER_STATUS.AT_RISK:
      return "bg-[#ffbfbf] text-[#ff3838] dark:bg-[#ff3838] dark:text-[#ffe0e0]";
    case MATTER_STATUS.NOT_STARTED:
    default:
      return "bg-[#fff4d3] text-[#e49101]";
  }
}

export function getTaskProgressPercent(
  completed: number | undefined,
  total: number | undefined
) {
  const done = completed ?? 0;
  const count = total ?? 0;
  if (count === 0) return 0;
  return Math.round((done / count) * 100);
}

export function formatTaskProgress(
  completed: number | undefined,
  total: number | undefined
) {
  const done = completed ?? 0;
  const count = total ?? 0;
  if (count === 0) return "No tasks yet";
  return `${done}/${count} tasks complete`;
}
