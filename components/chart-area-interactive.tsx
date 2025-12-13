"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { statisticsApi } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  spending: {
    label: "支出",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface MonthlyData {
  date: string
  spending: number
}

export function ChartAreaInteractive() {
  const [data, setData] = React.useState<MonthlyData[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const now = new Date()
        const promises = []
        
        // Fetch last 6 months
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
          promises.push(
            statisticsApi.getMonthlySpending(d.getFullYear(), d.getMonth() + 1)
              .then(res => ({
                date: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                spending: parseFloat(res.total_spending)
              }))
              .catch(() => ({
                date: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                spending: 0
              }))
          )
        }

        const results = await Promise.all(promises)
        setData(results)
      } catch (error) {
        console.error("Failed to fetch chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>支出趋势</CardTitle>
        <CardDescription>
          最近 6 个月的月度支出
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillSpending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-spending)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-spending)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="spending"
              type="natural"
              fill="url(#fillSpending)"
              stroke="var(--color-spending)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
