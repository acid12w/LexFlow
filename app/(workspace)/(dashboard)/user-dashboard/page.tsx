"use client"

import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

// 1. Data & Config for Income vs Expenses (Bar Chart)
const financialData = [
  { month: "Jan", income: 4500, expenses: 3200 },
  { month: "Feb", income: 5200, expenses: 3800 },
  { month: "Mar", income: 4800, expenses: 4100 },
  { month: "Apr", income: 6100, expenses: 4200 },
]

const financialConfig = {
  income: { label: "Income", color: "hsl(var(--chart-1))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

// 2. Data & Config for Project Status (Pie Chart)
const projectData = [
  { status: "completed", tasks: 45, fill: "hsl(var(--chart-1))" },
  { status: "inprogress", tasks: 25, fill: "hsl(var(--chart-2))" },
  { status: "todo", tasks: 30, fill: "hsl(var(--chart-3))" },
]

const projectConfig = {
  completed: { label: "Completed", color: "hsl(var(--chart-1))" },
  inprogress: { label: "In Progress", color: "hsl(var(--chart-2))" },
  todo: { label: "To Do", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 p-4">
      {/* Income vs Expenses Bar Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>Monthly income vs expenses comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={financialConfig} className="h-[300px] w-full">
            <BarChart data={financialData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Project Overview Pie Chart */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>Task distribution by status</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={projectConfig} className="mx-auto aspect-square max-h-[300px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={projectData}
                dataKey="tasks"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
              >
                {projectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent className="-translate-y-2" />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Showing total tasks for the current sprint
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
