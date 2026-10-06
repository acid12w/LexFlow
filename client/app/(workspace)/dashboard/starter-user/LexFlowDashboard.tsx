// components/LexFlowDashboard.tsx
"use client";

import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  ListTodo,
  MoreHorizontal,
  Plus,
  Search,
  TrendingUp,
  Users,
  Wallet,
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
  }[];
};

export type AdminDashboardData = {
  userName: string;
  stats: {
    activeMatters: number;
    clients: number;
    openTasks: number;
    revenueBilled: string;
  };
  matterHealth: {
    label: string;
    value: number;
  }[];
  revenue: {
    billed: string;
    collected: string;
    outstanding: string;
    months: { label: string; collected: number; outstanding: number }[];
  };
  workload: {
    name: string;
    initials: string;
    matters: number;
    tasks: number;
    hours: string;
  }[];
  taskStatus: {
    label: string;
    value: number;
  }[];
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
    },
    {
      id: "2",
      text: "Jane Doe assigned you a task",
      detail: "Prepare affidavit · Anderson Estate",
      time: "1 hour ago",
    },
    {
      id: "3",
      text: "You logged 1h 30m",
      detail: "Brown Contract",
      time: "Yesterday",
    },
    {
      id: "4",
      text: "New document uploaded",
      detail: "Client Agreement.pdf · Smith v. Jones",
      time: "Yesterday",
    },
    {
      id: "5",
      text: "Mark Brown commented",
      detail: "Looks good, please proceed · Williams Divorce",
      time: "2 days ago",
    },
  ],
};

const defaultAdminData: AdminDashboardData = {
  userName: "Adrian",
  stats: {
    activeMatters: 48,
    clients: 73,
    openTasks: 126,
    revenueBilled: "$425,000",
  },
  matterHealth: [
    { label: "In Progress", value: 24 },
    { label: "In Review", value: 8 },
    { label: "At Risk", value: 5 },
    { label: "Not Started", value: 7 },
    { label: "Completed", value: 4 },
  ],
  revenue: {
    billed: "$425,000",
    collected: "$343,000",
    outstanding: "$82,000",
    months: [
      { label: "Jan", collected: 55, outstanding: 22 },
      { label: "Feb", collected: 63, outstanding: 28 },
      { label: "Mar", collected: 72, outstanding: 25 },
      { label: "Apr", collected: 68, outstanding: 31 },
      { label: "May", collected: 78, outstanding: 27 },
      { label: "Jun", collected: 88, outstanding: 35 },
    ],
  },
  workload: [
    {
      name: "John Smith",
      initials: "JS",
      matters: 12,
      tasks: 32,
      hours: "28h",
    },
    { name: "Jane Doe", initials: "JD", matters: 8, tasks: 24, hours: "21h" },
    {
      name: "Mark Brown",
      initials: "MB",
      matters: 15,
      tasks: 41,
      hours: "34h",
    },
    { name: "Sarah Lee", initials: "SL", matters: 6, tasks: 18, hours: "19h" },
  ],
  taskStatus: [
    { label: "Completed", value: 72 },
    { label: "In Progress", value: 31 },
    { label: "Not Started", value: 14 },
    { label: "Overdue", value: 9 },
  ],
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
      text: "John Smith completed a task",
      detail: "Review contract · Smith v. Jones",
      time: "10 minutes ago",
    },
    {
      id: "2",
      text: "Jane Doe completed 4 tasks",
      detail: "Anderson Estate",
      time: "32 minutes ago",
    },
    {
      id: "3",
      text: "New client added",
      detail: "Brown Ltd.",
      time: "1 hour ago",
    },
    {
      id: "4",
      text: "Mark Brown logged 3h 20m",
      detail: "Contract Review",
      time: "2 hours ago",
    },
    {
      id: "5",
      text: "Sarah Lee uploaded a document",
      detail: "Williams Divorce",
      time: "3 hours ago",
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
        {Icon && <Icon className="h-4 w-4 text-slate-500" />}
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

function WeeklyBars({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="mt-5 flex h-28 items-end gap-2">
      {values.map((value, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t bg-blue-500/80"
            style={{ height: `${Math.max(4, (value / max) * 80)}%` }}
          />
          <span className="text-[9px] text-slate-400">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
          </span>
        </div>
      ))}
    </div>
  );
}

function RevenueBars({
  months,
}: {
  months: AdminDashboardData["revenue"]["months"];
}) {
  const max = Math.max(
    ...months.flatMap((m) => [m.collected, m.outstanding]),
    1
  );
  return (
    <div className="mt-6 flex h-36 items-end gap-3">
      {months.map((month) => (
        <div
          key={month.label}
          className="flex flex-1 items-end justify-center gap-1"
        >
          <div
            className="w-3 rounded-t bg-emerald-500"
            style={{ height: `${(month.collected / max) * 100}%` }}
          />
          <div
            className="w-3 rounded-t bg-slate-300"
            style={{ height: `${(month.outstanding / max) * 100}%` }}
          />
        </div>
      ))}
      {months.map((month) => (
        <span key={`label-${month.label}`} className="sr-only">
          {month.label}
        </span>
      ))}
    </div>
  );
}

export function UserDashboard({
  data = defaultUserData,
}: {
  data?: UserDashboardData;
}) {
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
          value={data.stats.myMatters}
          note="Active matters"
        />
        <StatCard
          icon={ListTodo}
          label="My Tasks"
          value={data.stats.myTasks}
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
            {data.tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-5 py-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  defaultChecked={task.completed}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {task.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {task.matter} · {task.priority} priority
                  </p>
                </div>
                <span className="hidden text-xs text-slate-400 sm:block">
                  {task.due}
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
              {data.time.total}
            </p>
            <p className="mt-1 text-xs text-slate-400">Total logged today</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Billable</p>
                <p className="mt-1 font-semibold">{data.time.billable}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Non-billable</p>
                <p className="mt-1 font-semibold">{data.time.nonBillable}</p>
              </div>
            </div>
            <p className="mt-5 text-xs font-medium text-slate-600">
              Weekly Billable Hours
            </p>
            <WeeklyBars values={data.time.weeklyHours} />
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <MatterTable title="My Matters" matters={data.matters} />
        <DeadlineList deadlines={data.deadlines} />
      </div>

      <ActivityCard activity={data.activity} />
    </DashboardShell>
  );
}

export function AdminDashboard({
  data = defaultAdminData,
}: {
  data?: AdminDashboardData;
}) {
  return (
    <DashboardShell userName={data.userName} roleLabel="Admin">
      <DashboardHeading
        name={data.userName}
        subtitle="Here's what's happening across your firm."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BriefcaseBusiness}
          label="Active Matters"
          value={data.stats.activeMatters}
          note="+12% from last month"
        />
        <StatCard
          icon={Users}
          label="Clients"
          value={data.stats.clients}
          note="+8% from last month"
        />
        <StatCard
          icon={ListTodo}
          label="Open Tasks"
          value={data.stats.openTasks}
          note="+6% from last month"
        />
        <StatCard
          icon={Wallet}
          label="Total Revenue (Billed)"
          value={data.stats.revenueBilled}
          note="+18% from last month"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.25fr]">
        <MatterHealth data={data.matterHealth} />
        <Card>
          <CardHeader
            icon={Wallet}
            title="Revenue"
            action={
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-[10px]">
                <button className="rounded-md bg-white px-2 py-1 shadow-sm">
                  This Month
                </button>
                <button className="px-2 py-1 text-slate-500">
                  Last 3 Months
                </button>
                <button className="px-2 py-1 text-slate-500">This Year</button>
              </div>
            }
          />
          <div className="p-5">
            <p className="text-2xl font-semibold text-slate-950">
              {data.revenue.billed}
            </p>
            <p className="text-xs text-slate-400">Total billed</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-400">Collected</p>
                <p className="font-semibold">{data.revenue.collected}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Outstanding</p>
                <p className="font-semibold">{data.revenue.outstanding}</p>
              </div>
            </div>
            <RevenueBars months={data.revenue.months} />
            <div className="mt-3 flex justify-between text-[10px] text-slate-400">
              {data.revenue.months.map((m) => (
                <span key={m.label}>{m.label}</span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <WorkloadTable workload={data.workload} />
        <TaskStatus data={data.taskStatus} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <MatterTable title="Matter Overview" matters={data.matters} />
        <DeadlineList deadlines={data.deadlines} />
      </div>

      <ActivityCard activity={data.activity} title="Firm Activity" />
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
      <aside className="fixed inset-y-0 left-0 hidden w-56 bg-[#09213f] text-white lg:block">
        <div className="flex h-16 items-center px-5 text-xl font-bold">
          <span className="mr-2 grid h-7 w-7 place-items-center rounded-md bg-blue-500">
            L
          </span>
          LexFlow
        </div>
        <nav className="space-y-1 px-3 py-4">
          {[
            "Dashboard",
            "Matters",
            "Clients",
            "Tasks",
            "Time Tracking",
            "Billing",
            "Documents",
            "Firm Members",
            "Settings",
          ].map((item, i) => (
            <button
              key={item}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                i === 0
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-current opacity-70" />
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="lg:pl-56">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="relative max-w-xl flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-400"
              placeholder="Search matters, clients, or tasks..."
            />
          </div>
          <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            ●
          </button>
          <div className="flex items-center gap-2 text-sm">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 font-semibold text-blue-700">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="font-medium">{userName}</p>
              <p className="text-[10px] text-slate-400">{roleLabel}</p>
            </div>
          </div>
        </header>
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

function MatterTable({
  title,
  matters,
}: {
  title: string;
  matters: UserDashboardData["matters"];
}) {
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
            {matters.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
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

function DeadlineList({
  deadlines,
}: {
  deadlines: UserDashboardData["deadlines"];
}) {
  return (
    <Card>
      <CardHeader
        icon={CalendarDays}
        title="Upcoming Deadlines"
        action={<ViewAll />}
      />
      <div className="divide-y divide-slate-100">
        {deadlines.map((d) => (
          <div key={d.id} className="flex items-center gap-3 px-5 py-4">
            <div
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[10px] font-semibold ${
                d.urgent
                  ? "bg-red-50 text-red-600"
                  : "bg-slate-50 text-slate-500"
              }`}
            >
              {d.date}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{d.title}</p>
              <p className="truncate text-xs text-slate-400">{d.matter}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function ActivityCard({
  activity,
  title = "Recent Activity",
}: {
  activity: UserDashboardData["activity"];
  title?: string;
}) {
  return (
    <Card className="mt-4">
      <CardHeader icon={Clock3} title={title} action={<ViewAll />} />
      <div className="divide-y divide-slate-100">
        {activity.map((a) => (
          <div key={a.id} className="flex gap-3 px-5 py-4">
            <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">{a.text}</p>
              <p className="text-xs text-slate-400">{a.detail}</p>
            </div>
            <span className="text-xs text-slate-400">{a.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MatterHealth({ data }: { data: AdminDashboardData["matterHealth"] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <Card>
      <CardHeader
        icon={BriefcaseBusiness}
        title="Matter Health"
        action={<ViewAll />}
      />
      <div className="p-5">
        <div className="flex items-center gap-6">
          <div
            className="relative grid h-40 w-40 shrink-0 place-items-center rounded-full"
            style={{
              background: `conic-gradient(#22c55e 0deg 180deg, #3b82f6 180deg 240deg, #f59e0b 240deg 277deg, #cbd5e1 277deg 330deg, #8b5cf6 330deg 360deg)`,
            }}
          >
            <div className="grid h-24 w-24 place-items-center rounded-full bg-white">
              <div className="text-center">
                <p className="text-2xl font-semibold">{total}</p>
                <p className="text-[10px] text-slate-400">Active Matters</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {data.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="w-20 text-slate-500">{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          ⚠ 5 matters require attention · View at-risk matters →
        </div>
      </div>
    </Card>
  );
}

function WorkloadTable({
  workload,
}: {
  workload: AdminDashboardData["workload"];
}) {
  return (
    <Card>
      <CardHeader icon={Users} title="Team Workload" action={<ViewAll />} />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[10px] uppercase text-slate-400">
            <tr>
              <th className="px-5 py-3">User</th>
              <th className="px-2 py-3">Matters</th>
              <th className="px-2 py-3">Tasks</th>
              <th className="px-2 py-3">Billable Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {workload.map((u) => (
              <tr key={u.name}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700">
                      {u.initials}
                    </span>
                    {u.name}
                  </div>
                </td>
                <td>{u.matters}</td>
                <td>{u.tasks}</td>
                <td>{u.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function TaskStatus({ data }: { data: AdminDashboardData["taskStatus"] }) {
  const total = data.reduce((sum, x) => sum + x.value, 0);
  return (
    <Card>
      <CardHeader
        icon={ListTodo}
        title="Tasks Across the Firm"
        action={<ViewAll />}
      />
      <div className="p-5">
        <p className="text-2xl font-semibold">{total}</p>
        <p className="text-xs text-slate-400">Total</p>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
          {data.map((item, i) => (
            <span
              key={item.label}
              className={`inline-block h-full ${
                ["bg-emerald-500", "bg-blue-500", "bg-slate-300", "bg-red-500"][
                  i
                ]
              }`}
              style={{ width: `${(item.value / total) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {data.map((item) => (
            <div key={item.label} className="text-xs">
              <span className="text-slate-400">{item.label}</span>
              <strong className="ml-2">{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
