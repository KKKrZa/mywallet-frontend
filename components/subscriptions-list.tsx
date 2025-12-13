"use client"

import * as React from "react"
import { IconBrandNetflix, IconCloud, IconMusic, IconVideo, IconDeviceLaptop, IconTrash, IconPencil } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SubscriptionResponse, SubscriptionCategory, BillingCycle, AssetResponse } from "@/lib/api-types"
import { subscriptionsApi, assetsApi } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function SubscriptionsList() {
  const [subscriptions, setSubscriptions] = React.useState<SubscriptionResponse[]>([])
  const [assets, setAssets] = React.useState<AssetResponse[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [formData, setFormData] = React.useState({
    name: "",
    category: "video" as SubscriptionCategory,
    amount: "",
    billing_cycle: "monthly" as BillingCycle,
    next_billing_date: new Date().toISOString().split("T")[0],
    auto_renew: true,
    asset_id: null as number | null,
  })

  const fetchData = React.useCallback(async () => {
    try {
      const [subsRes, assetsRes] = await Promise.all([
        subscriptionsApi.list(),
        assetsApi.list()
      ])
      setSubscriptions(subsRes)
      setAssets(assetsRes)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast.error("Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
      }

      if (editingId) {
        await subscriptionsApi.update(editingId, data)
        toast.success("订阅更新成功")
      } else {
        await subscriptionsApi.create(data)
        toast.success("订阅创建成功")
      }
      
      setIsCreateOpen(false)
      setEditingId(null)
      resetForm()
      fetchData()
    } catch (error) {
      console.error("Failed to save subscription:", error)
      toast.error(editingId ? "更新订阅失败" : "创建订阅失败")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "video",
      amount: "",
      billing_cycle: "monthly",
      next_billing_date: new Date().toISOString().split("T")[0],
      auto_renew: true,
      asset_id: null,
    })
  }

  const openCreate = () => {
    setEditingId(null)
    resetForm()
    setIsCreateOpen(true)
  }

  const openEdit = (sub: SubscriptionResponse) => {
    setEditingId(sub.id)
    setFormData({
      name: sub.name,
      category: sub.category as SubscriptionCategory,
      amount: sub.amount,
      billing_cycle: sub.billing_cycle as BillingCycle,
      next_billing_date: sub.next_billing_date,
      auto_renew: sub.auto_renew,
      asset_id: sub.asset_id,
    })
    setIsCreateOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await subscriptionsApi.delete(id)
      toast.success("订阅删除成功")
      fetchData()
    } catch (error) {
      console.error("Failed to delete subscription:", error)
      toast.error("删除订阅失败")
    }
  }

  const getIcon = (category: string) => {
    switch (category) {
      case "video": return <IconVideo className="size-4" />
      case "music": return <IconMusic className="size-4" />
      case "software": return <IconDeviceLaptop className="size-4" />
      case "cloud": return <IconCloud className="size-4" />
      default: return <IconBrandNetflix className="size-4" />
    }
  }

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>订阅管理</CardTitle>
          <CardDescription>管理您的周期性付款</CardDescription>
        </div>
        <Button onClick={openCreate}>添加订阅</Button>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "编辑订阅" : "添加新订阅"}</DialogTitle>
              <DialogDescription>
                {editingId ? "修改现有的订阅信息。" : "追踪新的周期性订阅服务。"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">名称</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">分类</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: SubscriptionCategory) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">视频流媒体</SelectItem>
                    <SelectItem value="music">音乐</SelectItem>
                    <SelectItem value="software">软件</SelectItem>
                    <SelectItem value="cloud">云服务</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">金额</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="billing_cycle" className="text-right">周期</Label>
                <Select
                  value={formData.billing_cycle}
                  onValueChange={(value: BillingCycle) => setFormData({ ...formData, billing_cycle: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择周期" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">每月</SelectItem>
                    <SelectItem value="yearly">每年</SelectItem>
                    <SelectItem value="weekly">每周</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="next_billing_date" className="text-right">下次扣款</Label>
                <Input
                  id="next_billing_date"
                  type="date"
                  value={formData.next_billing_date}
                  onChange={(e) => setFormData({ ...formData, next_billing_date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="asset_id" className="text-right">付款方式</Label>
                <Select
                  value={formData.asset_id?.toString() || "none"}
                  onValueChange={(value) => setFormData({ ...formData, asset_id: value === "none" ? null : parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择付款方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无</SelectItem>
                    {assets.map(asset => (
                      <SelectItem key={asset.id} value={asset.id.toString()}>
                        {asset.name} (¥{asset.balance})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="auto_renew" className="text-right">自动续费</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="auto_renew"
                    checked={formData.auto_renew}
                    onCheckedChange={(checked) => setFormData({ ...formData, auto_renew: checked as boolean })}
                  />
                  <label
                    htmlFor="auto_renew"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    启用自动续费
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>周期</TableHead>
              <TableHead>下次扣款</TableHead>
              <TableHead className="text-right">金额</TableHead>
              <TableHead className="text-right">状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  暂无订阅。
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex w-fit gap-1 items-center capitalize">
                      {getIcon(sub.category)}
                      {sub.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{sub.billing_cycle}</TableCell>
                  <TableCell>{sub.next_billing_date}</TableCell>
                  <TableCell className="text-right">¥{sub.amount}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 mr-2"
                      onClick={() => openEdit(sub)}
                    >
                      <IconPencil className="size-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(sub.id)}
                    >
                      <IconTrash className="size-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}