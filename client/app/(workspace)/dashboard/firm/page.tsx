"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";

import { Pie, PieChart, Cell } from "recharts";

import {
  DollarSign,
  TrendingUp,
  Clock,
  Activity,
  Briefcase,
} from "lucide-react";

import {
  useGetActivityLog,
  useGetTotalRevenue,
  useGetCollectedRevenue,
  useGetSnapShot,
} from "@/hooks/useDashboardHook";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const financialData = [
  { month: "Jan", income: 4500, expenses: 3200 },
  { month: "Feb", income: 5200, expenses: 3800 },
  { month: "Mar", income: 4800, expenses: 4100 },
  { month: "Apr", income: 6100, expenses: 4200 },
];

const financialConfig = {
  collected: { label: "Collected", color: "#0088FF" },
  outstanding: { label: "Outstanding", color: "#81C3FE" },
} satisfies ChartConfig;

const dashboardStats = {
  financials: {
    collected: 145200,
    outstanding: 38400,
    growthRate: "+12.5% from last month",
  },
  // Re-structured data to track pipeline volumes over a 6-month timeline
  historicalChartData: [
    { month: "Jan", Completed: 12, "In Progress": 15, "At Risk": 1 },
    { month: "Feb", Completed: 15, "In Progress": 14, "At Risk": 2 },
    { month: "Mar", Completed: 18, "In Progress": 16, "At Risk": 4 },
    { month: "Apr", Completed: 20, "In Progress": 19, "At Risk": 3 },
    { month: "May", Completed: 24, "In Progress": 18, "At Risk": 3 }, // Current Month Data
  ],
  recentActivity: [
    {
      id: 1,
      user: "Attorney Smith",
      action: "Completed task 'File Complaint'",
      target: "John Doe Case",
      time: "12 mins ago",
    },
    {
      id: 2,
      user: "Paralegal Jones",
      action: "Added 3 new tasks to",
      target: "Apex Innovations LLC",
      time: "1 hour ago",
    },
    {
      id: 3,
      user: "Clerk Brady",
      action: "Updated status to 'At Risk' on",
      target: "Maple Street Closing",
      time: "3 hours ago",
    },
  ],
};

export default function MatterDashboard() {
  const { financials, historicalChartData } = dashboardStats;

  const { data: recentActivity, isLoading, isPending } = useGetActivityLog();

  const { data: totalRevenue } = useGetTotalRevenue();
  const { data: collectedRevenue } = useGetCollectedRevenue();
  const { data: revenueSnapshot } = useGetSnapShot();

  const revenuseTrends = revenueSnapshot?.data || [];

  const outstandingRevenue =
    totalRevenue?.data.totalBilled - collectedRevenue?.data.collectedBilled;
  const collectionRate = (
    (collectedRevenue?.data.collectedBilled /
      (totalRevenue?.data.totalBilled + outstandingRevenue)) *
    100
  ).toFixed(1);

  console.log(revenuseTrends);

  // Extract latest metrics safely from our data array for summary indicators
  const latestMonthData = historicalChartData[historicalChartData.length - 1];
  const totalCases =
    latestMonthData["Completed"] +
    latestMonthData["In Progress"] +
    latestMonthData["At Risk"];

  return (
    <div className="space-y-8 p-6 bg-slate-50/50 min-h-screen">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Real-time overview of firm financials, matter health, and staff
          operations.
        </p>
      </div>

      {/* SECTION 1: FINANCIAL OVERVIEW */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Money Collected */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-slate-500">
              Collected Revenue
            </span>
            <div className="rounded-md bg-emerald-50 p-2 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">
              ${collectedRevenue?.data.collectedBilled}
            </span>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="h-3 w-3" /> {financials.growthRate}
            </p>
          </div>
        </div>

        {/* Money Outstanding */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-slate-500">
              Outstanding Invoices
            </span>
            <div className="rounded-md bg-amber-50 p-2 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">
              ${outstandingRevenue}
            </span>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Awaiting client clearance
            </p>
          </div>
        </div>

        {/* Collection Efficiency Rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-slate-500">
              Collection Rate
            </span>
            <div className="rounded-md bg-blue-50 p-2 text-blue-600">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">
              {collectionRate}%
            </span>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${collectionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: LINE CHART TRENDS & AUDIT TRAIL */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recharts Line Chart Trend Container */}
        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-slate-500" /> Case Velocity
              Trends
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Historical trajectory of operational statuses.
            </p>
          </div>

          {/* Chart Frame Block */}
          <div className="w-full h-52 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend
                  iconSize={8}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />

                {/* Clean, curved trend lines using monotone type definitions */}
                <Line
                  type="monotone"
                  dataKey="Completed"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="In Progress"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="At Risk"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-slate-400 border-t pt-3 flex justify-between items-center mt-2">
            <span>
              Total Cases (This Month): <strong>{totalCases}</strong>
            </span>
            <span className="text-blue-600 cursor-pointer hover:underline">
              View Historical Details &rarr;
            </span>
          </div>
        </div>

        {/* User Activity Log Feed */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-slate-500" /> Live Audit Trail
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Real-time team updates.
            </p>
          </div>

          <div className="space-y-4 my-4 overflow-y-auto max-h-[190px] pr-1">
            {recentActivity?.data.data.map((log) => (
              <div
                key={log.id}
                className="text-xs border-l-2 border-slate-200 pl-3 py-1 relative"
              >
                <div className="">{log.category}</div>
                <p className="text-slate-700">
                  <span className="font-semibold text-slate-900">
                    {log.userName} :
                  </span>{" "}
                  {/* {log.category}{" "} */}
                  <span className="font-medium text-blue-600">
                    {log.description}
                  </span>
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {log.createdAt}
                </span>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-400 border-t pt-3 text-center">
            <span className="text-slate-600 cursor-pointer hover:underline font-medium">
              Export System Logs
            </span>
          </div>
        </div>
      </div>

      {/* Income vs Expenses Bar Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>
            Monthly income vs expenses comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={financialConfig} className="h-[300px] w-full">
            <BarChart data={revenuseTrends}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="income"
                fill="var(--color-income)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                fill="var(--color-expenses)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
