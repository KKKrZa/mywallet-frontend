"use client"

import { useEffect, useState } from "react"
import { IconCreditCard, IconCurrencyDollar, IconWallet, IconActivityHeartbeat } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { assetsApi, statisticsApi, subscriptionsApi } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export function SectionCards() {
  const [loading, setLoading] = useState(true)
  const [totalAssets, setTotalAssets] = useState<string>("0")
  const [monthlySpending, setMonthlySpending] = useState<string>("0")
  const [subscriptionSpending, setSubscriptionSpending] = useState<string>("0")
  const [activeSubscriptions, setActiveSubscriptions] = useState<number>(0)

  useEffect(() => {
    async function fetchData() {
      try {
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth() + 1

        const [assetsRes, monthlySpendingRes, subSpendingRes, subsListRes] = await Promise.all([
          assetsApi.getTotal(),
          statisticsApi.getMonthlySpending(currentYear, currentMonth),
          statisticsApi.getSubscriptionSpending(currentYear, currentMonth),
          subscriptionsApi.list("active"),
        ])

        setTotalAssets(assetsRes.total)
        setMonthlySpending(monthlySpendingRes.total_spending)
        setSubscriptionSpending(subSpendingRes.total_subscription_spending)
        setActiveSubscriptions(subsListRes.length)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32 mt-2" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-4 w-40" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>总资产</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ¥{totalAssets}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconWallet className="size-3" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            当前总余额
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>本月支出</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ¥{monthlySpending}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCurrencyDollar className="size-3" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            本月总消费
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>订阅费用</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ¥{subscriptionSpending}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCreditCard className="size-3" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            本月订阅支出
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>活跃订阅</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeSubscriptions}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconActivityHeartbeat className="size-3" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            当前活跃服务
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
