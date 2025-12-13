"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconChartBar,
  IconDashboard,
  IconInnerShadowTop,
  IconSettings,
  IconWallet,
  IconCreditCard,
  IconExchange,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "仪表盘",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "资产管理",
      url: "/dashboard/assets",
      icon: IconWallet,
    },
    {
      title: "订阅管理",
      url: "/dashboard/subscriptions",
      icon: IconCreditCard,
    },
    {
      title: "交易记录",
      url: "/dashboard/transactions",
      icon: IconExchange,
    },
    {
      title: "统计分析",
      url: "/dashboard/statistics",
      icon: IconChartBar,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">MyWallet</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
