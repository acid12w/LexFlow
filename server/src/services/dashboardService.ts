import mongoose, { PipelineStage } from "mongoose";
import Matter from "../models /matter.js";
import Task from "../models /tasks.js";
import Client from "../models /client.js";
import User from "../models /user.js";
import TimeTracker from "../models /timeTracker.js";
import { ActivityLog } from "../models /activeyLog.js";
import { syncMatterHealthForFirm } from "./matterHealthService.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const DONE = "DONE";

// Matter status codes -> labels the client's StatusBadge understands
const MATTER_STATUS_LABELS: Record<string, string> = {
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  AT_RISK: "At Risk",
  NOT_STARTED: "Not Started",
  DONE: "Completed",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Monday-based week, matching the time tracker snapshot
const startOfWeek = (date: Date) => {
  const d = startOfDay(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return d;
};

// "Sep 12"
const formatShortDate = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

// "Today" | "Tomorrow" | "Wed, Sep 04"
const formatDeadlineDate = (date: Date, today: Date) => {
  const days = Math.round((startOfDay(date).getTime() - today.getTime()) / DAY_MS);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
  });
};

// "10 minutes ago" | "Yesterday" | "Sep 12"
const formatRelativeTime = (date: Date, now: Date) => {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const plural = (n: number, unit: string) =>
    `${n} ${unit}${n === 1 ? "" : "s"} ago`;

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return plural(Math.floor(seconds / 60), "minute");
  if (seconds < 86400) return plural(Math.floor(seconds / 3600), "hour");
  if (seconds < 2 * 86400) return "Yesterday";
  if (seconds < 7 * 86400) return plural(Math.floor(seconds / 86400), "day");
  return formatShortDate(date);
};

// 9000 -> "2h 30m", 7200 -> "2h"
const formatHours = (totalSeconds: number) => {
  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
};

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "?";

type UserLike = {
  userName?: string | null;
  profile?: { firstName?: string; lastName?: string };
};

const getDisplayName = (user: UserLike | null | undefined) =>
  [user?.profile?.firstName, user?.profile?.lastName]
    .filter(Boolean)
    .join(" ") ||
  user?.userName ||
  "Unknown";

type ClientLike = {
  firstName?: string;
  lastName?: string;
  companyName?: string;
};

const getClientName = (client: ClientLike | null | undefined) =>
  client?.companyName ||
  [client?.firstName, client?.lastName].filter(Boolean).join(" ") ||
  "—";

// Converts a "HH:MM:SS" duration string into seconds inside an aggregation
const durationToSeconds = {
  $let: {
    vars: { parts: { $split: ["$duration", ":"] } },
    in: {
      $add: [
        { $multiply: [{ $toInt: { $arrayElemAt: ["$$parts", 0] } }, 3600] },
        { $multiply: [{ $toInt: { $arrayElemAt: ["$$parts", 1] } }, 60] },
        { $toDouble: { $arrayElemAt: ["$$parts", 2] } },
      ],
    },
  },
};

const idsOf = (values: unknown[] | undefined) =>
  (values ?? []).map((v) => String(v));

export const getFirmDashboardService = async (
  firmId: string,
  userId: string
) => {
  const firmObjectId = new mongoose.Types.ObjectId(firmId);
  const now = new Date();
  const today = startOfDay(now);
  const weekStart = startOfWeek(now);

  // Refresh computed matter statuses (e.g. AT_RISK) before counting them
  await syncMatterHealthForFirm(firmId);

  const billableHoursPipeline: PipelineStage[] = [
    {
      $match: {
        firmId: firmObjectId,
        date: { $gte: weekStart },
        isBillable: { $in: [true, "true"] },
      },
    },
    { $group: { _id: "$user", seconds: { $sum: durationToSeconds } } },
  ];

  const [
    currentUser,
    members,
    matters,
    tasks,
    clientCount,
    billableHours,
    activityLogs,
  ] = await Promise.all([
    User.findById(userId).select("userName profile").lean(),
    User.find({ firmId: firmObjectId }).select("userName profile").lean(),
    Matter.find({ firmId: firmObjectId })
      .select(
        "title clientId status endDate billAmount billIsCollected billCollectedDate createdAt userId responsibleAttorney responsibleStaff assignedTo"
      )
      .populate("clientId", "firstName lastName companyName")
      .lean(),
    Task.find({ firmId: firmObjectId })
      .select("title status endDate matterId user assignedTo")
      .lean(),
    Client.countDocuments({ firmId: firmObjectId }),
    TimeTracker.aggregate<{ _id: mongoose.Types.ObjectId; seconds: number }>(
      billableHoursPipeline
    ),
    ActivityLog.find({ firmId: firmObjectId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const activeMatters = matters.filter((m) => m.status !== DONE);
  const openTasks = tasks.filter((t) => t.status !== DONE);
  const matterById = new Map(matters.map((m) => [String(m._id), m]));
  const clientNameOf = (matter: (typeof matters)[number]) =>
    getClientName(matter.clientId as unknown as ClientLike);

  // --- Revenue ---------------------------------------------------------
  const billed = matters.reduce((sum, m) => sum + (m.billAmount ?? 0), 0);
  const collected = matters
    .filter((m) => m.billIsCollected)
    .reduce((sum, m) => sum + (m.billAmount ?? 0), 0);

  // Last 6 months: collected by collection date, outstanding by billing date
  const months = Array.from({ length: 6 }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    const inMonth = (value: unknown) => {
      if (!value) return false;
      const date = new Date(value as string | Date);
      return date >= start && date < end;
    };

    return {
      label: start.toLocaleDateString("en-US", { month: "short" }),
      collected: matters
        .filter((m) => m.billIsCollected && inMonth(m.billCollectedDate))
        .reduce((sum, m) => sum + (m.billAmount ?? 0), 0),
      outstanding: matters
        .filter((m) => !m.billIsCollected && inMonth(m.createdAt))
        .reduce((sum, m) => sum + (m.billAmount ?? 0), 0),
    };
  });

  // --- Matter health ---------------------------------------------------
  const statusCounts = new Map<string, number>();
  for (const matter of matters) {
    const status = matter.status || "NOT_STARTED";
    statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
  }
  const matterHealth = Object.entries(MATTER_STATUS_LABELS)
    .map(([status, label]) => ({ label, value: statusCounts.get(status) ?? 0 }))
    .filter((item) => item.value > 0 || item.label !== "In Review");

  // --- Tasks across the firm (order matches the client's bar colors) ----
  const isOverdue = (t: (typeof tasks)[number]) =>
    t.status !== DONE && !!t.endDate && new Date(t.endDate) < today;
  const taskStatus = [
    {
      label: "Completed",
      value: tasks.filter((t) => t.status === DONE).length,
    },
    {
      label: "In Progress",
      value: openTasks.filter(
        (t) =>
          !isOverdue(t) && ["IN_PROGRESS", "IN_REVIEW"].includes(t.status)
      ).length,
    },
    {
      label: "Not Started",
      value: openTasks.filter(
        (t) =>
          !isOverdue(t) && !["IN_PROGRESS", "IN_REVIEW"].includes(t.status)
      ).length,
    },
    { label: "Overdue", value: openTasks.filter(isOverdue).length },
  ];

  // --- Team workload ---------------------------------------------------
  const hoursByUser = new Map(
    billableHours.map((row) => [String(row._id), row.seconds ?? 0])
  );

  // Assignees if any, otherwise whoever created the record
  const matterPeople = (m: (typeof matters)[number]) => {
    const assigned = [
      ...idsOf(m.responsibleAttorney),
      ...idsOf(m.responsibleStaff),
      ...idsOf(m.assignedTo),
    ];
    return assigned.length ? assigned : [String(m.userId)];
  };
  const taskPeople = (t: (typeof tasks)[number]) => {
    const assigned = idsOf(t.assignedTo);
    return assigned.length ? assigned : [String(t.user)];
  };

  const workload = members
    .map((member) => {
      const id = String(member._id);
      const name = getDisplayName(member);
      return {
        name,
        initials: getInitials(name),
        matters: activeMatters.filter((m) => matterPeople(m).includes(id))
          .length,
        tasks: openTasks.filter((t) => taskPeople(t).includes(id)).length,
        hours: formatHours(hoursByUser.get(id) ?? 0),
      };
    })
    .sort((a, b) => b.tasks - a.tasks || b.matters - a.matters);

  // --- Matter overview: active matters, soonest due first ---------------
  const byDueDate = (a?: Date | null, b?: Date | null) =>
    (a ? new Date(a).getTime() : Infinity) -
    (b ? new Date(b).getTime() : Infinity);

  const matterOverview = [...activeMatters]
    .sort((a, b) => byDueDate(a.endDate, b.endDate))
    .slice(0, 6)
    .map((m) => ({
      id: String(m._id),
      title: m.title,
      client: clientNameOf(m),
      status: MATTER_STATUS_LABELS[m.status] ?? m.status,
      due: m.endDate ? formatShortDate(new Date(m.endDate)) : "—",
    }));

  // --- Upcoming deadlines: open tasks and active matters due from today -
  const upcoming = [
    ...openTasks
      .filter((t) => t.endDate && new Date(t.endDate) >= today)
      .map((t) => ({
        id: `task-${t._id}`,
        title: t.title,
        matter: matterById.get(String(t.matterId))?.title ?? "No matter",
        date: new Date(t.endDate as Date),
      })),
    ...activeMatters
      .filter((m) => m.endDate && new Date(m.endDate) >= today)
      .map((m) => ({
        id: `matter-${m._id}`,
        title: `${m.title} due`,
        matter: clientNameOf(m),
        date: new Date(m.endDate as Date),
      })),
  ];

  const deadlines = upcoming
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5)
    .map((d) => ({
      id: d.id,
      title: d.title,
      matter: d.matter,
      date: formatDeadlineDate(d.date, today),
      urgent: d.date.getTime() - today.getTime() < 2 * DAY_MS,
    }));

  // --- Firm activity ---------------------------------------------------
  const activity = activityLogs.map(
    (log: {
      _id: unknown;
      userName?: string;
      description?: string;
      createdAt?: Date;
      metadata?: { actionTitle?: string };
    }) => ({
      id: String(log._id),
      text: log.description ?? "",
      detail: [log.userName, log.metadata?.actionTitle]
        .filter(Boolean)
        .join(" · "),
      time: log.createdAt ? formatRelativeTime(new Date(log.createdAt), now) : "",
    })
  );

  return {
    userName: currentUser?.profile?.firstName || currentUser?.userName || "",
    stats: {
      activeMatters: activeMatters.length,
      clients: clientCount,
      openTasks: openTasks.length,
      revenueBilled: formatCurrency(billed),
    },
    matterHealth,
    revenue: {
      billed: formatCurrency(billed),
      collected: formatCurrency(collected),
      outstanding: formatCurrency(billed - collected),
      months,
    },
    workload,
    taskStatus,
    matters: matterOverview,
    deadlines,
    activity,
  };
};
