"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Timer, Activity } from "lucide-react";
import { useUserCredentials } from "@/app/store/user-store";
import { useGetUserActivityLog } from "@/hooks/useActivityHook";
import { useGetCasesOverview } from "@/hooks/useDashboardHook";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
} from "react";

// 1. Data & Config for Income vs Expenses (Bar Chart)
const financialData = [
  { month: "Jan", income: 4500, expenses: 3200 },
  { month: "Feb", income: 5200, expenses: 3800 },
  { month: "Mar", income: 4800, expenses: 4100 },
  { month: "Apr", income: 6100, expenses: 4200 },
];

const financialConfig = {
  income: { label: "Income", color: "#0088FF" },
  expenses: { label: "Expenses", color: "#81C3FE" },
} satisfies ChartConfig;

// 2. Data & Config for Project Status (Pie Chart)
const projectData = [
  { status: "completed", tasks: 45, fill: "#08CB63" },
  { status: "inprogress", tasks: 25, fill: "#F59E0B" },
  { status: "todo", tasks: 30, fill: "#0088FF" },
];

const projectConfig = {
  completed: { label: "Completed", color: "hsl(var(--chart-1))" },
  inprogress: { label: "In Progress", color: "hsl(var(--chart-2))" },
  todo: { label: "To Do", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

export default function Dashboard() {
  const { data: casesOverview } = useGetCasesOverview();
  const {
    data: recentActivity,
    isLoading,
    isPending,
  } = useGetUserActivityLog();

  const userData = useUserCredentials((state) => state?.user);

  return (
    <>
      {/* <div className="p-6">
        <h2 className="text-2xl">
          Welcome {userData?.profile.firstName} {userData?.profile.lastName}
        </h2>
        <p className="text-gray-500">Case management hub</p>
      </div> */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 p-4">
        {/* Project Overview Pie Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Task distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={projectConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={casesOverview?.data.grouped}
                  dataKey="tasks"
                  nameKey="status"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {casesOverview?.data.grouped.map(
                    (entry: { fill: string | undefined }, index: unknown) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    )
                  )}
                </Pie>
                <ChartLegend
                  formatter={(value) => `Status: ${value}`}
                  // content={<ChartLegendContent className="-translate-y-2" />}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Showing total cases for the current sprint
            </div>
          </CardFooter>
        </Card>

        <div className="p-4 col-span-4 border-2 rounded-lg w-full">
          <h4 className="font-semibold flex gap-2">
            <Activity className="text-gray-500" /> User activity log
          </h4>
          <p className="text-sm text-gray-600 mb-8">Real-time team updates.</p>
          <div className="flex flex-col gap-y-6 overflow-scroll">
            {recentActivity?.data.data &&
            recentActivity.data.data.length > 0 ? (
              recentActivity.data.data.map(
                (
                  activity: {
                    userName:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactPortal
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                    description: any;
                    metadata: { actionTitle: any };
                    createdAt:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactPortal
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                  },
                  index: Key | null | undefined
                ) => {
                  return (
                    <div
                      key={index}
                      className="flex gap-x-4 w-full border-l-2 border-gray-300"
                    >
                      <div className="flex flex-col gap-x-4 pl-2">
                        <div className="flex items-center gap-2">
                          <p className="mr-3 text-xs text-gray-500">
                            {activity.userName}
                          </p>
                        </div>
                        <h4 className=" text-sm">{`${activity?.description} : ${activity?.metadata?.actionTitle}`}</h4>
                        <p className="text-xs text-gray-500">
                          {activity.createdAt}
                        </p>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <h3 className="text-gray-600">no activity recorded</h3>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
