"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { User, Circle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updateAgentStatus } from "@/lib/actions"
import type { Agent } from "@/lib/types"

const PREDEFINED_AGENTS = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Alice Johnson" },
  { id: "3", name: "Bob Williams" },
  { id: "4", name: "Sarah Davis" },
  { id: "5", name: "Michael Brown" },
  { id: "6", name: "Emily Wilson" },
]

const CURRENT_AGENT_KEY = "call-log-current-agent"
const AGENT_STATUS_KEY = "call-log-agent-status"

export default function AgentSelector() {
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null)
  const [isAvailable, setIsAvailable] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const { toast } = useToast()

  // Load saved agent and status from localStorage
  useEffect(() => {
    const savedAgent = localStorage.getItem(CURRENT_AGENT_KEY)
    const savedStatus = localStorage.getItem(AGENT_STATUS_KEY)

    if (savedAgent) {
      const agent = JSON.parse(savedAgent)
      setCurrentAgent(agent)
      setIsAvailable(savedStatus === "available")
    } else {
      setShowWelcome(true)
    }
  }, [])

  const handleAgentSelect = (agentId: string) => {
    const selectedAgent = PREDEFINED_AGENTS.find((agent) => agent.id === agentId)
    if (selectedAgent) {
      const agentWithStatus: Agent = {
        ...selectedAgent,
        status: "offline",
        isCurrentUser: true,
      }

      setCurrentAgent(agentWithStatus)
      setIsAvailable(false)
      setShowWelcome(false)

      // Save to localStorage
      localStorage.setItem(CURRENT_AGENT_KEY, JSON.stringify(agentWithStatus))
      localStorage.setItem(AGENT_STATUS_KEY, "unavailable")

      toast({
        title: "Welcome!",
        description: `You're now logged in as ${selectedAgent.name}. Toggle your availability to start receiving calls.`,
      })
    }
  }

  const handleAvailabilityToggle = async (available: boolean) => {
    if (!currentAgent) return

    try {
      await updateAgentStatus(currentAgent.id, available ? "online" : "offline")

      setIsAvailable(available)
      localStorage.setItem(AGENT_STATUS_KEY, available ? "available" : "unavailable")

      const updatedAgent = { ...currentAgent, status: available ? "online" : "offline" }
      setCurrentAgent(updatedAgent)
      localStorage.setItem(CURRENT_AGENT_KEY, JSON.stringify(updatedAgent))

      toast({
        title: available ? "You're now available" : "You're now unavailable",
        description: available
          ? "You'll receive new call assignments automatically."
          : "You won't receive new calls until you become available again.",
      })
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_AGENT_KEY)
    localStorage.removeItem(AGENT_STATUS_KEY)
    setCurrentAgent(null)
    setIsAvailable(false)
    setShowWelcome(true)

    toast({
      title: "Logged out",
      description: "Select your name to continue using the app.",
    })
  }

  // Welcome screen for first-time users
  if (showWelcome || !currentAgent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Welcome to Call Log Tracker
          </CardTitle>
          <CardDescription>Select your name to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleAgentSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select your name" />
            </SelectTrigger>
            <SelectContent>
              {PREDEFINED_AGENTS.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    )
  }

  // Compact header display for logged-in users
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Circle className={`h-3 w-3 fill-current ${isAvailable ? "text-green-500" : "text-gray-400"}`} />
        <Badge variant="outline" className="font-medium">
          {currentAgent.name}
        </Badge>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="availability" checked={isAvailable} onCheckedChange={handleAvailabilityToggle} />
        <Label htmlFor="availability" className="text-sm">
          {isAvailable ? "Available" : "Unavailable"}
        </Label>
      </div>

      <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs">
        Switch User
      </Button>
    </div>
  )
}
