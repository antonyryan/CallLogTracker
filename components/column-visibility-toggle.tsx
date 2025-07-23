"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings2 } from "lucide-react"

const COLUMN_PREFERENCES_KEY = "call-log-column-preferences"

interface ColumnPreferences {
  duration: boolean
  phoneNumber: boolean
  contact: boolean
  dateTime: boolean
  outcome: boolean
  assignedTo: boolean
  status: boolean
}

const defaultPreferences: ColumnPreferences = {
  duration: true,
  phoneNumber: true,
  contact: true,
  dateTime: true,
  outcome: true,
  assignedTo: true,
  status: true,
}

export function ColumnVisibilityToggle() {
  const [preferences, setPreferences] = useState<ColumnPreferences>(defaultPreferences)

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(COLUMN_PREFERENCES_KEY)
    if (saved) {
      setPreferences({ ...defaultPreferences, ...JSON.parse(saved) })
    }
  }, [])

  const updatePreference = (column: keyof ColumnPreferences, visible: boolean) => {
    const newPreferences = { ...preferences, [column]: visible }
    setPreferences(newPreferences)
    localStorage.setItem(COLUMN_PREFERENCES_KEY, JSON.stringify(newPreferences))

    // Apply visibility changes to table columns
    const columnElements = document.querySelectorAll(`[data-column="${column}"]`)
    columnElements.forEach((el) => {
      if (visible) {
        el.classList.remove("hidden")
      } else {
        el.classList.add("hidden")
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-1" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          checked={preferences.duration}
          onCheckedChange={(checked) => updatePreference("duration", checked)}
        >
          Duration
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={preferences.phoneNumber}
          onCheckedChange={(checked) => updatePreference("phoneNumber", checked)}
        >
          Phone Number
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={preferences.contact}
          onCheckedChange={(checked) => updatePreference("contact", checked)}
        >
          Contact
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={preferences.dateTime}
          onCheckedChange={(checked) => updatePreference("dateTime", checked)}
        >
          Date/Time
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={preferences.outcome}
          onCheckedChange={(checked) => updatePreference("outcome", checked)}
        >
          Outcome
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={preferences.assignedTo}
          onCheckedChange={(checked) => updatePreference("assignedTo", checked)}
        >
          Assigned To
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={preferences.status}
          onCheckedChange={(checked) => updatePreference("status", checked)}
        >
          Status
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
