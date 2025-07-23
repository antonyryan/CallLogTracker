"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Circle, Users, RefreshCw } from "lucide-react"
import { fetchAgentStatuses } from "@/lib/actions"
import type { Agent } from "@/lib/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function AgentStatusHeader() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load agent statuses
  useEffect(() => {
    loadAgentStatuses()

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadAgentStatuses, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadAgentStatuses = async () => {
    try {
      const statuses = await fetchAgentStatuses()
      setAgents(statuses)
    } catch (error) {
      console.error("Failed to load agent statuses:", error)
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    await loadAgentStatuses()
    setIsLoading(false)
  }

  const onlineAgents = agents.filter((agent) => agent.status === "online")
  const offlineAgents = agents.filter((agent) => agent.status === "offline")

  return (
    <div className="flex items-center gap-2">
      {/* Quick status overview */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Circle className="h-3 w-3 fill-current text-green-500" />
          <span className="text-sm font-medium text-green-600">{onlineAgents.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <Circle className="h-3 w-3 fill-current text-gray-400" />
          <span className="text-sm font-medium text-gray-500">{offlineAgents.length}</span>
        </div>
      </div>

      {/* Detailed status popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Users className="h-4 w-4" />
            Team Status
            <Badge variant="secondary" className="text-xs">
              {onlineAgents.length}/{agents.length}
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Agent Status</h4>
                <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
              </div>

              <div className="space-y-3">
                {/* Online Agents */}
                {onlineAgents.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Circle className="h-3 w-3 fill-current text-green-500" />
                      <span className="text-sm font-medium text-green-600">Online ({onlineAgents.length})</span>
                    </div>
                    <div className="space-y-1 ml-5">
                      {onlineAgents.map((agent) => (
                        <div key={agent.id} className="flex items-center justify-between">
                          <span className="text-sm">{agent.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {agent.callsAssigned || 0} calls
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Offline Agents */}
                {offlineAgents.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Circle className="h-3 w-3 fill-current text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">Offline ({offlineAgents.length})</span>
                    </div>
                    <div className="space-y-1 ml-5">
                      {offlineAgents.map((agent) => (
                        <div key={agent.id} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{agent.name}</span>
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Unavailable
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {agents.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-4">No agents found</div>
                )}
              </div>

              {/* Summary */}
              <div className="mt-4 pt-3 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">{onlineAgents.length}</div>
                    <div className="text-xs text-muted-foreground">Available</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {onlineAgents.reduce((sum, agent) => sum + (agent.callsAssigned || 0), 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Active Calls</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  )
}
