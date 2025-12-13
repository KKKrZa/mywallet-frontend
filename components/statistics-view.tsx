"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { statisticsApi } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { AssetDistributionResponse, CategorySpendingResponse } from "@/lib/api-types"

const categoryConfig = {
  amount: {
    label: "金额",
    color: "var(--primary)",
  },
} satisfies ChartConfig

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function StatisticsView() {
  const [assetDist, setAssetDist] = React.useState<AssetDistributionResponse | null>(null)
  const [categorySpending, setCategorySpending] = React.useState<CategorySpendingResponse | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]

        const [assetRes, categoryRes] = await Promise.all([
          statisticsApi.getAssetDistribution(),
          statisticsApi.getCategorySpending(startOfMonth, endOfMonth)
        ])
        setAssetDist(assetRes)
        setCategorySpending(categoryRes)
      } catch (error) {
        console.error("Failed to fetch statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  const assetData = assetDist?.assets.map(item => ({
    name: item.asset_name,
    value: parseFloat(item.balance)
  })) || []

  const categoryData = categorySpending?.categories.map(item => ({
    category: item.category,
    amount: parseFloat(item.amount)
  })) || []

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>资产分布</CardTitle>
          <CardDescription>您的总资产构成</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "价值",
              }
            }}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <Pie
                data={assetData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
              >
                 {assetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
          <div className="mt-4 text-center text-2xl font-bold">
            总计: ¥{assetDist?.total_assets}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>分类支出</CardTitle>
          <CardDescription>本月各项支出</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={categoryConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={categoryData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
            </BarChart>
          </ChartContainer>
          <div className="mt-4 text-center text-2xl font-bold">
            总计: ¥{categorySpending?.total}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}