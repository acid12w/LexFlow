// components/LexFlowDashboard.tsx
"use client";

import { useGetSnapShot } from "@/hooks/useDashboardHook";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Activity,
  ListTodo,
  MoreHorizontal,
  Plus,
  Search,
  TrendingUp,
  Users,
  Wallet,
  ScrollText,
  FileText,
  User,
  Timer,
} from "lucide-react";
import type { ReactNode } from "react";

export type DashboardRole = "user" | "admin";

export type UserDashboardData = {
  userName: string;
  roleLabel?: string;
  stats: {
    myMatters: number;
    myTasks: number;
    dueSoon: number;
    overdue: number;
  };
  tasks: {
    id: string;
    title: string;
    matter: string;
    priority: "Low" | "Medium" | "High" | "Urgent";
    due: string;
    completed?: boolean;
  }[];
  time: {
    total: string;
    billable: string;
    nonBillable: string;
    weeklyHours: number[];
  };
  matters: {
    id: string;
    title: string;
    client: string;
    status: string;
    due: string;
  }[];
  deadlines: {
    id: string;
    title: string;
    matter: string;
    date: string;
    urgent?: boolean;
  }[];
  activity: {
    id: string;
    text: string;
    detail?: string;
    time: string;
    Icon: SVGRectElement<any, any>;
    type: "task" | "matter" | "userActivity" | "time";
  }[];
};

const defaultUserData: UserDashboardData = {
  userName: "John",
  roleLabel: "Attorney",
  stats: { myMatters: 7, myTasks: 12, dueSoon: 4, overdue: 2 },
  tasks: [
    {
      id: "1",
      title: "Review client documents",
      matter: "Smith v. Jones",
      priority: "High",
      due: "Today, 10:00 AM",
    },
    {
      id: "2",
      title: "Prepare affidavit",
      matter: "Anderson Estate",
      priority: "Medium",
      due: "Today, 1:00 PM",
    },
    {
      id: "3",
      title: "Contact opposing counsel",
      matter: "Brown Contract",
      priority: "Medium",
      due: "Today, 3:30 PM",
    },
  ],
  time: {
    total: "4h 32m",
    billable: "3h 45m",
    nonBillable: "0h 47m",
    weeklyHours: [6, 8, 7, 9, 6, 0, 0],
  },
  matters: [
    {
      id: "1",
      title: "Smith v. Jones",
      client: "John Smith",
      status: "In Progress",
      due: "Sep 12",
    },
    {
      id: "2",
      title: "Anderson Estate",
      client: "Mary Anderson",
      status: "At Risk",
      due: "Sep 15",
    },
    {
      id: "3",
      title: "Brown Contract",
      client: "Brown Ltd.",
      status: "Not Started",
      due: "Sep 21",
    },
    {
      id: "4",
      title: "Williams Divorce",
      client: "Patricia Williams",
      status: "In Review",
      due: "Sep 28",
    },
    {
      id: "5",
      title: "Robinson Litigation",
      client: "Charles Robinson",
      status: "In Progress",
      due: "Oct 05",
    },
  ],
  deadlines: [
    {
      id: "1",
      title: "Review client documents",
      matter: "Smith v. Jones",
      date: "Today",
      urgent: true,
    },
    {
      id: "2",
      title: "File motion",
      matter: "Anderson Estate",
      date: "Wed, Sep 04",
    },
    {
      id: "3",
      title: "Client meeting",
      matter: "Brown Contract",
      date: "Fri, Sep 06",
    },
    {
      id: "4",
      title: "Prepare trial brief",
      matter: "Williams Divorce",
      date: "Tue, Sep 10",
    },
    {
      id: "5",
      title: "Court filing",
      matter: "Robinson Litigation",
      date: "Fri, Sep 12",
    },
  ],
  activity: [
    {
      id: "1",
      text: "You completed a task",
      detail: "Review contract · Smith v. Jones",
      time: "10 minutes ago",
      Icon: FileText,
      type: "matter",
    },
    {
      id: "2",
      text: "Jane Doe assigned you a task",
      detail: "Prepare affidavit · Anderson Estate",
      time: "1 hour ago",
      Icon: ScrollText,
      type: "task",
    },
    {
      id: "3",
      text: "You logged 1h 30m",
      detail: "Brown Contract",
      time: "Yesterday",
      Icon: Timer,
      type: "time",
    },
    {
      id: "4",
      text: "New document uploaded",
      detail: "Client Agreement.pdf · Smith v. Jones",
      time: "Yesterday",
      Icon: ScrollText,
      type: "task",
    },
    {
      id: "5",
      text: "Mark Brown commented",
      detail: "Looks good, please proceed · Williams Divorce",
      time: "2 days ago",
      Icon: User,
      type: "userActivity",
    },
  ],
};

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

function CardHeader({
  icon: Icon,
  title,
  action,
}: {
  icon?: typeof BriefcaseBusiness;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div className="flex items-center gap-2 font-semibold text-slate-900">
        {Icon && (
          <Icon className="h-8 w-8 text-slate-700 bg-gray-100 outline-gray-800 outline-dashed p-2 rounded-full" />
        )}
        {title}
      </div>
      {action}
    </div>
  );
}

function ViewAll() {
  return (
    <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
      View all →
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "In Progress": "bg-blue-50 text-blue-700",
    "In Review": "bg-violet-50 text-violet-700",
    "At Risk": "bg-red-50 text-red-700",
    "Not Started": "bg-slate-100 text-slate-600",
    Completed: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span
      className={`rounded-full px-2 py-1 text-[11px] font-medium ${
        styles[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
  danger,
}: {
  icon: typeof BriefcaseBusiness;
  label: string;
  value: string | number;
  note?: string;
  danger?: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <Icon className="h-4 w-4" />
        </div>
        {danger && (
          <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-medium text-red-600">
            Attention
          </span>
        )}
      </div>
      <p className="mt-4 text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      {note && <p className="mt-1 text-[11px] text-slate-400">{note}</p>}
    </Card>
  );
}

function WeeklyBars({ values }: { values: any[] }) {
  // Extract durations to find the max value safely
  const durations = values.map((item) => {
    const value = Object.values(item)[0]; // handles your { tues: 5673 } structure
    return typeof value === "number" ? value : 0;
  });

  const max = Math.max(...durations, 1);
  const maxHeightPx = 80; // Maximum height of the tallest bar in pixels

  return (
    <div className="mt-5 flex items-end gap-2">
      {values.map((item, index) => {
        const entries = Object.entries(item);
        const dayName = entries[0] ? entries[0][0] : "";
        const duration = entries[0] ? (entries[0][1] as number) : 0;

        const shortDay = dayName.slice(0, 3);

        // Calculate height in pixels instead of percentage
        const calculatedHeight = Math.max(4, (duration / max) * maxHeightPx);

        return (
          <div key={index} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-blue-500 transition-all duration-300"
              style={{ height: `${calculatedHeight}px` }}
            />
            <span className="text-[9px] text-slate-400">{shortDay}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function UserDashboard({
  data = defaultUserData,
}: {
  data?: UserDashboardData;
}) {
  const { data: dashboardData, isError, isLoading } = useGetSnapShot();

  if (isLoading) {
    return <p>loading...</p>;
  }

  const totalTasks = dashboardData?.data.data.totalTasks;
  const TasksData = dashboardData?.data.data.TasksData;
  const totalMatters = dashboardData?.data.data.totalMatters;
  const matterData = dashboardData?.data.data.matterData;
  const activityData = dashboardData?.data.data.activityData;
  const timeData = dashboardData?.data.data.timeData;
  const matterDueDate = dashboardData?.data.data.matterDueDate;

  const weeklytime = timeData.dailyBreakdown.map((timeDate) => {
    const dateString = timeDate.date;

    const [year, month, day] = dateString.split("-").map(Number);
    // Note: Month is 0-indexed in JS dates (0 = January, 9 = October)
    const dateObj = new Date(year, month - 1, day);

    const dayofTheWeek = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
    });

    return {
      [dayofTheWeek]: timeDate.totalDuration,
    };
  });

  console.log(TasksData);

  return (
    <DashboardShell
      userName={data.userName}
      roleLabel={data.roleLabel ?? "User"}
    >
      <DashboardHeading
        name={data.userName}
        subtitle="Here's what's happening with your work today."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BriefcaseBusiness}
          label="My Matters"
          value={totalMatters}
          note="Active matters"
        />
        <StatCard
          icon={ListTodo}
          label="My Tasks"
          value={totalTasks}
          note="Total tasks"
        />
        <StatCard
          icon={CalendarDays}
          label="Due Soon"
          value={data.stats.dueSoon}
          note="Due this week"
        />
        <StatCard
          icon={AlertCircle}
          label="Overdue"
          value={data.stats.overdue}
          note="Past due"
          danger
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader icon={ListTodo} title="My Tasks" action={<ViewAll />} />
          <div className="divide-y divide-slate-100">
            {TasksData.map((task, index) => (
              <div key={index} className="flex items-center gap-3 px-5 py-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  defaultChecked={task.status}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {task.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {task.priority} priority
                  </p>
                </div>
                <span className="hidden text-xs text-slate-400 sm:block">
                  {task.endDate}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            icon={Clock3}
            title="Today's Time"
            action={
              <button className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700">
                Start Timer
              </button>
            }
          />
          <div className="p-5">
            <p className="text-3xl font-semibold text-slate-950">
              {timeData.summary.grandTotal}
            </p>
            <p className="mt-1 text-xs text-slate-400">Total logged today</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Billable</p>
                <p className="mt-1 font-semibold">
                  {timeData.summary.totalBillable}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Non-billable</p>
                <p className="mt-1 font-semibold">
                  {timeData.summary.totalNonBillable}
                </p>
              </div>
            </div>
            <p className="mt-5 text-xs font-medium text-slate-600">
              Weekly Billable Hours
            </p>
            <WeeklyBars values={weeklytime} />
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <MatterTable title="My Matters" matters={matterData} />
        <DeadlineList deadlines={TasksData} />
      </div>

      <ActivityCard activity={activityData} />
    </DashboardShell>
  );
}

function DashboardShell({
  children,
  userName,
  roleLabel,
}: {
  children: ReactNode;
  userName: string;
  roleLabel: string;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="">
        <div className="mx-auto max-w-[1450px] p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}

function DashboardHeading({
  name,
  subtitle,
}: {
  name: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Good morning, {name} <span>👋</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <p className="hidden text-xs text-slate-400 sm:block">Today</p>
    </div>
  );
}

function MatterTable({ title, matters }: { title: string; matters: any[] }) {
  return (
    <Card>
      <CardHeader icon={BriefcaseBusiness} title={title} action={<ViewAll />} />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[10px] uppercase text-slate-400">
            <tr>
              <th className="px-5 py-3">Matter</th>
              <th className="px-3 py-3">Client</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matters.map((m, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium">{m.title}</td>
                <td className="px-3 py-3 text-slate-500">{m.client}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={m.status} />
                </td>
                <td className="px-3 py-3 text-slate-500">{m.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function DeadlineList({ deadlines }: { deadlines: any[] }) {
  return (
    <Card>
      <CardHeader
        icon={CalendarDays}
        title="Upcoming Deadlines"
        action={<ViewAll />}
      />
      <div className="divide-y divide-slate-100">
        {deadlines.map((d, index) => {
          const islast = index === deadlines.length - 1;
          return (
            <div
              key={index}
              className="flex items-center gap-3 px-5 py-4 relative"
            >
              <div
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[10px] font-semibold ${
                  d.urgent
                    ? "bg-red-50 text-red-600"
                    : "bg-slate-50 text-slate-500"
                }`}
              >
                {d.date}
              </div>
              <div className="min-w-0 flex-1 ml-4">
                <p className="truncate text-sm font-medium">{d.title}</p>
                <p className="truncate text-xs text-slate-400">{d.matter}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />

              <div
                className={cn(
                  "absolute top-2 left-[70px] h-[83%] z-10 w-0.5 bg-gray-200"
                )}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ActivityCard({
  activity,
  title = "Recent Activity",
}: {
  activity: any[];
  title?: string;
}) {
  enum activityType {
    TASK_MGMT = "TASK_MGMT",
  }
  const ActivityIconMap: Record<activityType, React.ReactNode> = {
    [activityType.TASK_MGMT]: (
      <ScrollText className="size-[40px] rounded-full bg-amber-100 text-amber-400 p-2" />
    ),
  };

  return (
    <Card className="mt-4">
      <CardHeader icon={Activity} title={title} action={<ViewAll />} />
      <div className="divide-y divide-slate-100">
        {activity.map((a, index) => {
          const icon = ActivityIconMap[a.category];
          const islast = index === activity.length - 1;
          return (
            <div key={index} className="flex gap-3 px-5 py-4 ">
              <div className="relative">
                {icon}
                {!islast && (
                  <div
                    className={cn(
                      "absolute top-10 right-[19px] h-[83%] z-10 w-0.5 bg-gray-200"
                    )}
                  />
                )}
              </div>

              <div className="flex-1">
                {/* <p className="text-sm font-medium">{a.metadata.actionTitle}</p> */}
                <p className="text-xs text-slate-400">{a.description}</p>
              </div>
              <span className="text-xs text-slate-400">{a.createdAt}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
