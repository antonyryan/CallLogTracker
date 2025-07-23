"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Circle, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { distributeCallsToAgents, fetchAgentStatuses } from "@/lib/actions"
import type { Agent } from "@/lib/types"

export default function AgentStatusPanel() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isRebalancing, setIsRebalancing] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null)
  const { toast } = useToast()

  // Load current agent and fetch statuses
  useEffect(() => {
    const savedAgent = localStorage.getItem("call-log-current-agent")
    if (savedAgent) {
      setCurrentAgent(JSON.parse(savedAgent))
    }

    // Fetch initial agent statuses
    loadAgentStatuses()

    // Set up polling for agent statuses every 30 seconds
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

  const handleRebalance = async () => {
    setIsRebalancing(true)

    try {
      const result = await distributeCallsToAgents()

      toast({
        title: "Calls rebalanced",
        description: `${result.distributed} calls redistributed among ${result.agents} available agents.`,
      })

      // Refresh agent statuses after rebalancing
      await loadAgentStatuses()
    } catch (error) {
      toast({
        title: "Error rebalancing calls",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsRebalancing(false)
    }
  }

  const getStatusColor = (status: string) => {
    return status === "online" ? "text-green-500" : "text-gray-400"
  }

  const availableAgents = agents.filter((agent) => agent.status === "online")
  const totalAssignedCalls = agents.reduce((sum, agent) => sum + (agent.callsAssigned || 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Team Status
          <Button variant="ghost" size="sm" onClick={loadAgentStatuses}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>
          {availableAgents.length} of {agents.length} agents available
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-muted/20 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{availableAgents.length}</div>
              <div className="text-xs text-muted-foreground">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalAssignedCalls}</div>
              <div className="text-xs text-muted-foreground">Total Calls</div>
            </div>
          </div>

          {/* Agent List */}
          <div className="space-y-3">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Circle className={`h-3 w-3 fill-current ${getStatusColor(agent.status)}`} />
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {agent.name}
                      {currentAgent?.id === agent.id && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {agent.status === "online" ? "Available" : "Unavailable"}
                    </div>
                  </div>
                </div>
                <Badge variant={agent.status === "online" ? "default" : "outline"} className="text-xs">
                  {agent.callsAssigned || 0} calls
                </Badge>
              </div>
            ))}
          </div>

          {/* Rebalance Button */}
          <div className="pt-4 border-t">
            <Button onClick={handleRebalance} disabled={isRebalancing} className="w-full" size="sm">
              {isRebalancing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Rebalancing...
                </>
              ) : (
                "Rebalance Calls"
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Redistributes unassigned calls evenly among available agents
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
