"use client"

import * as React from "react"
import { IconArrowDownLeft, IconArrowUpRight, IconFilter } from "@tabler/icons-react"

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
import { TransactionResponse, TransactionType, TransactionCategory, AssetResponse, SubscriptionResponse } from "@/lib/api-types"
import { transactionsApi, assetsApi, subscriptionsApi } from "@/lib/api"
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

export function TransactionsList() {
  const [transactions, setTransactions] = React.useState<TransactionResponse[]>([])
  const [assets, setAssets] = React.useState<AssetResponse[]>([])
  const [subscriptions, setSubscriptions] = React.useState<SubscriptionResponse[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [newTx, setNewTx] = React.useState({
    type: "expense" as TransactionType,
    category: "other" as TransactionCategory,
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    asset_id: null as number | null,
    subscription_id: null as number | null,
  })
  
  // Filters
  const [filterCategory, setFilterCategory] = React.useState<TransactionCategory | "all">("all")

  const fetchData = React.useCallback(async () => {
    try {
      const [txRes, assetsRes, subsRes] = await Promise.all([
        transactionsApi.list({
          category: filterCategory === "all" ? undefined : filterCategory
        }),
        assetsApi.list(),
        subscriptionsApi.list()
      ])
      // Sort by date descending
      setTransactions(txRes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      setAssets(assetsRes)
      setSubscriptions(subsRes)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast.error("Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }, [filterCategory])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = async () => {
    try {
      await transactionsApi.create({
        ...newTx,
        amount: parseFloat(newTx.amount) || 0,
      })
      toast.success("交易创建成功")
      setIsCreateOpen(false)
      setNewTx({
        type: "expense",
        category: "other",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        asset_id: null,
        subscription_id: null,
      })
      fetchData()
    } catch (error) {
      console.error("Failed to create transaction:", error)
      toast.error("创建交易失败")
    }
  }

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>交易记录</CardTitle>
          <CardDescription>查看和管理您的交易历史</CardDescription>
        </div>
        <div className="flex gap-2">
           <Select
              value={filterCategory}
              onValueChange={(value: TransactionCategory | "all") => setFilterCategory(value)}
            >
              <SelectTrigger className="w-[180px]">
                <IconFilter className="mr-2 size-4" />
                <SelectValue placeholder="筛选分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="subscription">订阅</SelectItem>
                <SelectItem value="food">餐饮</SelectItem>
                <SelectItem value="salary">薪资</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>添加交易</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加新交易</DialogTitle>
                <DialogDescription>
                  记录一笔新的收入或支出。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">类型</Label>
                  <Select
                    value={newTx.type}
                    onValueChange={(value: TransactionType) => setNewTx({ ...newTx, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">支出</SelectItem>
                      <SelectItem value="income">收入</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">分类</Label>
                  <Select
                    value={newTx.category}
                    onValueChange={(value: TransactionCategory) => setNewTx({ ...newTx, category: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subscription">订阅</SelectItem>
                      <SelectItem value="food">餐饮</SelectItem>
                      <SelectItem value="salary">薪资</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">金额</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">日期</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newTx.date}
                    onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">描述</Label>
                  <Input
                    id="description"
                    value={newTx.description}
                    onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="asset_id" className="text-right">资产</Label>
                  <Select
                    value={newTx.asset_id?.toString() || "none"}
                    onValueChange={(value) => setNewTx({ ...newTx, asset_id: value === "none" ? null : parseInt(value) })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择资产" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">无</SelectItem>
                      {assets.map(asset => (
                        <SelectItem key={asset.id} value={asset.id.toString()}>
                          {asset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {newTx.category === "subscription" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subscription_id" className="text-right">订阅</Label>
                    <Select
                      value={newTx.subscription_id?.toString() || "none"}
                      onValueChange={(value) => setNewTx({ ...newTx, subscription_id: value === "none" ? null : parseInt(value) })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="选择订阅" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">无</SelectItem>
                        {subscriptions.map(sub => (
                          <SelectItem key={sub.id} value={sub.id.toString()}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleCreate}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日期</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>描述</TableHead>
              <TableHead className="text-right">金额</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  暂无交易记录。
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={tx.type === "income" ? "text-green-600 border-green-200" : "text-red-600 border-red-200"}>
                      {tx.type === "income" ? <IconArrowDownLeft className="mr-1 size-3" /> : <IconArrowUpRight className="mr-1 size-3" />}
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{tx.category}</TableCell>
                  <TableCell>{tx.description || "-"}</TableCell>
                  <TableCell className={`text-right font-medium ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {tx.type === "income" ? "+" : "-"}¥{tx.amount}
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