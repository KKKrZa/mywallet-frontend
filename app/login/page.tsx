"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { authApi } from "@/lib/api"
import { setToken } from "@/lib/api-client"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new URLSearchParams()
      formData.append("username", username)
      formData.append("password", password)

      const res = await authApi.login(formData)
      setToken(res.access_token)
      toast.success("登录成功")
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      toast.error("登录失败，请检查用户名和密码")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>登录</CardTitle>
          <CardDescription>欢迎回来，请登录您的账户</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </Button>
            <div className="text-center text-sm text-gray-500">
              还没有账户？
              <Link href="/register" className="text-blue-600 hover:underline">
                立即注册
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}