"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, X, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PREDEFINED_AGENTS = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Alice Johnson" },
  { id: "3", name: "Bob Williams" },
  { id: "4", name: "Sarah Davis" },
  { id: "5", name: "Michael Brown" },
  { id: "6", name: "Emily Wilson" },
]

export default function CallFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentAgent, setCurrentAgent] = useState<any>(null)
  const [callStats, setCallStats] = useState({
    total: 0,
    checked: 0,
    unchecked: 0,
    assigned: 0,
    unassigned: 0,
  })

  // Load current agent from localStorage
  useEffect(() => {
    const savedAgent = localStorage.getItem("call-log-current-agent")
    if (savedAgent) {
      setCurrentAgent(JSON.parse(savedAgent))
    }
  }, [])

  // Mock call statistics (in real app, this would come from API)
  useEffect(() => {
    // Simulate fetching call statistics
    setCallStats({
      total: 15,
      checked: 8,
      unchecked: 7,
      assigned: 12,
      unassigned: 3,
    })
  }, [])

  const currentFilter = searchParams.get("filter") || "all"
  const currentAssignee = searchParams.get("assignee")

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams)

    if (filter === "all") {
      params.delete("filter")
      params.delete("assignee")
    } else if (filter === "my-calls" && currentAgent) {
      params.set("filter", "assigned")
      params.set("assignee", currentAgent.id)
    } else {
      params.set("filter", filter)
      params.delete("assignee")
    }

    router.push(`?${params.toString()}`)
  }

  const handleAssigneeChange = (assigneeId: string) => {
    const params = new URLSearchParams(searchParams)

    if (assigneeId === "all") {
      params.delete("assignee")
      params.set("filter", "all")
    } else {
      params.set("filter", "assigned")
      params.set("assignee", assigneeId)
    }

    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("filter")
    params.delete("assignee")
    router.push(`?${params.toString()}`)
  }

  const getFilterLabel = () => {
    if (currentFilter === "unassigned") return "Unassigned Calls"
    if (currentFilter === "unchecked") return "Unchecked Calls"
    if (currentFilter === "checked") return "Checked Calls"
    if (currentFilter === "assigned" && currentAssignee) {
      const agent = PREDEFINED_AGENTS.find((a) => a.id === currentAssignee)
      return `Assigned to ${agent?.name || "Unknown"}`
    }
    return "All Calls"
  }

  const hasActiveFilters = currentFilter !== "all" || currentAssignee

  return (
    <div className="space-y-4">
      {/* Call Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Call Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{callStats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{callStats.checked}</div>
              <div className="text-xs text-muted-foreground">Checked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{callStats.unchecked}</div>
              <div className="text-xs text-muted-foreground">Unchecked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{callStats.assigned}</div>
              <div className="text-xs text-muted-foreground">Assigned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{callStats.unassigned}</div>
              <div className="text-xs text-muted-foreground">Unassigned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={currentFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Calls</SelectItem>
              {currentAgent && <SelectItem value="my-calls">My Calls</SelectItem>}
              <SelectItem value="unchecked">Unchecked</SelectItem>
              <SelectItem value="checked">Checked</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
            </SelectContent>
          </Select>

          {currentFilter === "assigned" && (
            <Select value={currentAssignee || "all"} onValueChange={handleAssigneeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {PREDEFINED_AGENTS.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {getFilterLabel()}
              <button onClick={clearFilters} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
