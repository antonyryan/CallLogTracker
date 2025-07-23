"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Clock, Wifi } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function RefreshControl() {
  const router = useRouter()
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [timeAgo, setTimeAgo] = useState<string>("")
  const [isOnline, setIsOnline] = useState(true)

  // Update the "time ago" text every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeAgo(formatDistanceToNow(lastRefreshed, { addSuffix: true }))
    }, 10000)

    // Initial set
    setTimeAgo(formatDistanceToNow(lastRefreshed, { addSuffix: true }))

    return () => clearInterval(timer)
  }, [lastRefreshed])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const timer = setInterval(
      () => {
        handleRefresh()
      },
      5 * 60 * 1000,
    ) // 5 minutes

    return () => clearInterval(timer)
  }, [router])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleRefresh = () => {
    // Refresh the data
    router.refresh()

    // Update last refreshed time
    setLastRefreshed(new Date())
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Wifi className={`h-4 w-4 ${isOnline ? "text-green-500" : "text-red-500"}`} />
          <Clock className="h-4 w-4" />
          <span>Last updated: {timeAgo || "just now"}</span>
        </div>
      </div>

      <Badge variant="outline" className="text-xs">
        Auto-refresh: 5min
      </Badge>
    </div>
  )
}
