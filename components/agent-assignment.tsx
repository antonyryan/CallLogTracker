"use client"

import { useState } from "react"
import type { CallLogItem } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, User, Circle } from "lucide-react"
import { assignCallToAgent } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data - in a real app, this would come from your backend
const agents = [
  { id: "1", name: "John Smith", status: "online", workload: 3 },
  { id: "2", name: "Alice Johnson", status: "online", workload: 2 },
  { id: "3", name: "Bob Williams", status: "offline", workload: 0 },
  { id: "4", name: "Current User", status: "online", workload: 2, isCurrentUser: true },
]

export function AgentAssignment({ call }: { call: CallLogItem }) {
  const [assignedAgent, setAssignedAgent] = useState(call.assignedTo)
  const [isAssigning, setIsAssigning] = useState(false)
  const { toast } = useToast()

  const handleAssign = async (agentId: string) => {
    setIsAssigning(true)

    try {
      await assignCallToAgent(call.id, agentId)
      const agent = agents.find((a) => a.id === agentId)
      setAssignedAgent(agent)

      toast({
        title: "Call assigned",
        description: `Call has been assigned to ${agent?.name}.`,
      })
    } catch (error) {
      toast({
        title: "Error assigning call",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsAssigning(false)
    }
  }

  const getStatusColor = (status: string) => {
    return status === "online" ? "text-green-500" : "text-gray-400"
  }

  if (!assignedAgent) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isAssigning}>
          <Button variant="outline" size="sm" className="text-muted-foreground bg-transparent">
            {isAssigning ? "Assigning..." : "Unassigned"}
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {agents.map((agent) => (
            <DropdownMenuItem
              key={agent.id}
              onClick={() => handleAssign(agent.id)}
              disabled={agent.status === "offline"}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Circle className={`mr-2 h-2 w-2 fill-current ${getStatusColor(agent.status)}`} />
                  <span>
                    {agent.name} {agent.isCurrentUser ? "(You)" : ""}
                  </span>
                </div>
                <Badge variant="outline" className="ml-2 text-xs">
                  {agent.workload}
                </Badge>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleAssign("pool")}>
            <User className="mr-2 h-4 w-4" />
            Team Pool
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isAssigning}>
              <Button variant="ghost" size="sm" className="px-2">
                <div className="flex items-center">
                  <Circle
                    className={`mr-1 h-2 w-2 fill-current ${getStatusColor(assignedAgent.status || "offline")}`}
                  />
                  <Badge variant="outline" className="font-normal">
                    {assignedAgent.name} {assignedAgent.isCurrentUser ? "(You)" : ""}
                  </Badge>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {agents.map((agent) => (
                <DropdownMenuItem
                  key={agent.id}
                  onClick={() => handleAssign(agent.id)}
                  disabled={agent.id === assignedAgent.id || agent.status === "offline"}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Circle className={`mr-2 h-2 w-2 fill-current ${getStatusColor(agent.status)}`} />
                      <span>
                        {agent.name} {agent.isCurrentUser ? "(You)" : ""}
                      </span>
                    </div>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {agent.workload}
                    </Badge>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAssign("pool")}>
                <User className="mr-2 h-4 w-4" />
                Team Pool
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p>Assigned: {new Date().toLocaleDateString()}</p>
            {call.assignmentHistory && <p className="text-muted-foreground">Previously: {call.assignmentHistory}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
