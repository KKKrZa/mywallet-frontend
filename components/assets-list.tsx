"use client"

import * as React from "react"
import { IconBuildingBank, IconCash, IconCreditCard, IconTrendingUp, IconTrash } from "@tabler/icons-react"

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
import { AssetResponse, AssetType } from "@/lib/api-types"
import { assetsApi } from "@/lib/api"
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

export function AssetsList() {
  const [assets, setAssets] = React.useState<AssetResponse[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [newAsset, setNewAsset] = React.useState({
    name: "",
    type: "bank" as AssetType,
    balance: "",
    currency: "CNY",
  })

  const fetchAssets = React.useCallback(async () => {
    try {
      const res = await assetsApi.list()
      setAssets(res)
    } catch (error) {
      console.error("Failed to fetch assets:", error)
      toast.error("Failed to fetch assets")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  const handleCreate = async () => {
    try {
      await assetsApi.create({
        ...newAsset,
        balance: parseFloat(newAsset.balance) || 0,
      })
      toast.success("资产创建成功")
      setIsCreateOpen(false)
      setNewAsset({ name: "", type: "bank", balance: "", currency: "CNY" })
      fetchAssets()
    } catch (error) {
      console.error("Failed to create asset:", error)
      toast.error("创建资产失败")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await assetsApi.delete(id)
      toast.success("资产删除成功")
      fetchAssets()
    } catch (error) {
      console.error("Failed to delete asset:", error)
      toast.error("删除资产失败")
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "bank": return <IconBuildingBank className="size-4" />
      case "payment": return <IconCreditCard className="size-4" />
      case "cash": return <IconCash className="size-4" />
      case "investment": return <IconTrendingUp className="size-4" />
      default: return <IconBuildingBank className="size-4" />
    }
  }

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>资产列表</CardTitle>
          <CardDescription>管理您的财务账户</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>添加资产</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加新资产</DialogTitle>
              <DialogDescription>
                创建一个新的资产账户以跟踪您的余额。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  名称
                </Label>
                <Input
                  id="name"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  类型
                </Label>
                <Select
                  value={newAsset.type}
                  onValueChange={(value: AssetType) => setNewAsset({ ...newAsset, type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">银行</SelectItem>
                    <SelectItem value="payment">支付平台</SelectItem>
                    <SelectItem value="cash">现金</SelectItem>
                    <SelectItem value="investment">投资</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="balance" className="text-right">
                  余额
                </Label>
                <Input
                  id="balance"
                  type="number"
                  value={newAsset.balance}
                  onChange={(e) => setNewAsset({ ...newAsset, balance: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>货币</TableHead>
              <TableHead className="text-right">余额</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  暂无资产。请添加一个开始使用。
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex w-fit gap-1 items-center capitalize">
                      {getIcon(asset.type)}
                      {asset.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{asset.currency}</TableCell>
                  <TableCell className="text-right">¥{asset.balance}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(asset.id)}
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