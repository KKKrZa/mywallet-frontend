"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/api-client"
import { authApi } from "@/lib/api"

export default function ProfilePage() {
  const [user, setUser] = React.useState({
    name: "用户",
    email: "",
    avatar: "",
    username: "",
    joinDate: "2023-01-01"
  })

  const [passwordForm, setPasswordForm] = React.useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(prev => ({
        ...prev,
        name: currentUser.username || "用户",
        username: currentUser.username || "",
        email: currentUser.email || "",
        joinDate: currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : prev.joinDate,
      }))
    }
  }, [])

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("两次输入的新密码不一致")
      return
    }

    if (passwordForm.new_password.length < 6) {
      toast.error("新密码长度不能少于6位")
      return
    }

    setLoading(true)
    try {
      await authApi.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      })
      toast.success("密码修改成功")
      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      })
    } catch (error) {
      console.error("Failed to change password:", error)
      toast.error("修改密码失败，请检查旧密码是否正确")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-lg">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>您的账户基本资料</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input id="username" value={user.username} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" value={user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinDate">注册日期</Label>
              <Input id="joinDate" value={user.joinDate} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>账户安全</CardTitle>
            <CardDescription>管理您的密码和安全设置</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">当前密码</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.old_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">新密码</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">确认新密码</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirm_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
              />
            </div>
            <Button onClick={handleChangePassword} disabled={loading}>
              {loading ? "修改中..." : "修改密码"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}