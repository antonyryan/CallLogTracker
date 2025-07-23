"use client"

import { useState, useEffect } from "react"
import type { CallLogItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Check, Loader2, AlertTriangle } from "lucide-react"
import { updateCallLogStatus } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function CheckCallLog({ call }: { call: CallLogItem }) {
  const [isPending, setIsPending] = useState(false)
  const [isChecked, setIsChecked] = useState(call.checked)
  const [showConflictAnimation, setShowConflictAnimation] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Optimistic UI update
  const [optimisticChecked, setOptimisticChecked] = useState(call.checked)

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        router.refresh()
      },
      5 * 60 * 1000,
    ) // 5 minutes

    return () => clearInterval(interval)
  }, [router])

  async function handleToggleCheck() {
    setIsPending(true)
    const newStatus = !isChecked

    // Get current agent info
    const currentAgent = localStorage.getItem("call-log-current-agent")
    const agentName = currentAgent ? JSON.parse(currentAgent).name : "Unknown Agent"

    // Optimistic update - show immediate feedback
    setOptimisticChecked(newStatus)

    try {
      const result = await updateCallLogStatus(call.id, newStatus, agentName)

      if (result.conflict) {
        // Conflict detected - show animation and revert
        setShowConflictAnimation(true)
        setOptimisticChecked(result.currentStatus)
        setIsChecked(result.currentStatus)

        toast({
          title: "Conflict detected",
          description: `This call was already ${result.currentStatus ? "checked" : "unchecked"} by ${result.updatedBy}.`,
          variant: "destructive",
        })

        // Remove animation after 2 seconds
        setTimeout(() => setShowConflictAnimation(false), 2000)
      } else {
        // Success - update actual state
        setIsChecked(newStatus)

        // Broadcast update to other users (in real app, this would be WebSocket)
        window.dispatchEvent(
          new CustomEvent("callStatusUpdate", {
            detail: { callId: call.id, checked: newStatus, updatedBy: agentName },
          }),
        )

        toast({
          title: newStatus ? "Call marked as checked" : "Call marked as unchecked",
          description: `Call to ${call.contactName || call.phoneNumber} has been updated.`,
        })

        // Refresh data to sync with other users
        setTimeout(() => router.refresh(), 1000)
      }
    } catch (error) {
      // Error - revert optimistic update
      setOptimisticChecked(isChecked)
      toast({
        title: "Error updating call status",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  // Listen for updates from other users
  useEffect(() => {
    const handleStatusUpdate = (event: CustomEvent) => {
      if (event.detail.callId === call.id) {
        setIsChecked(event.detail.checked)
        setOptimisticChecked(event.detail.checked)

        toast({
          title: "Call status updated",
          description: `This call was ${event.detail.checked ? "checked" : "unchecked"} by ${event.detail.updatedBy}.`,
        })
      }
    }

    window.addEventListener("callStatusUpdate", handleStatusUpdate as EventListener)
    return () => window.removeEventListener("callStatusUpdate", handleStatusUpdate as EventListener)
  }, [call.id, toast])

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && document.activeElement?.closest("tr")?.contains(e.target as Node)) {
        e.preventDefault()
        handleToggleCheck()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <Button
      variant={optimisticChecked ? "outline" : "default"}
      size="sm"
      onClick={handleToggleCheck}
      disabled={isPending}
      className={cn(
        optimisticChecked ? "text-muted-foreground" : "",
        showConflictAnimation ? "animate-pulse border-destructive bg-destructive/10" : "",
        "transition-all duration-200",
      )}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin mr-1" />
      ) : showConflictAnimation ? (
        <AlertTriangle className="h-4 w-4 mr-1 text-destructive" />
      ) : optimisticChecked ? (
        <Check className="h-4 w-4 mr-1" />
      ) : null}
      {showConflictAnimation ? "Conflict" : optimisticChecked ? "Checked" : "Mark as Checked"}
    </Button>
  )
}
