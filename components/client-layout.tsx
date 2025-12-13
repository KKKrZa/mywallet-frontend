"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getToken } from "@/lib/api-client"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Public paths that don't require authentication
    const publicPaths = ["/login", "/register"]
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    const token = getToken()

    if (!token && !isPublicPath) {
      router.push("/login")
    } else {
      setAuthorized(true)
    }
  }, [pathname, router])

  // Don't render protected content until authorized
  // But allow public pages to render immediately
  const publicPaths = ["/login", "/register"]
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  if (!authorized && !isPublicPath) {
    return null
  }

  return <>{children}</>
}