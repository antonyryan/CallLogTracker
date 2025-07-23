"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"

interface CallRowSelectorProps {
  callId: string
}

export function CallRowSelector({ callId }: CallRowSelectorProps) {
  const [isSelected, setIsSelected] = useState(false)

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space key to toggle selection when row is focused
      if (e.code === "Space" && document.activeElement?.closest("tr")?.querySelector(`[data-call-id="${callId}"]`)) {
        e.preventDefault()
        setIsSelected(!isSelected)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [callId, isSelected])

  return (
    <Checkbox
      data-call-id={callId}
      checked={isSelected}
      onCheckedChange={setIsSelected}
      aria-label={`Select call ${callId}`}
    />
  )
}
