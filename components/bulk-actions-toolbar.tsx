"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Check, X, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { bulkUpdateCallStatus, bulkAssignCalls } from "@/lib/actions"

export default function BulkActionsToolbar() {
  const [selectedCalls, setSelectedCalls] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // In a real app, you'd get all visible call IDs
      setSelectedCalls(["1", "2", "3", "4", "5", "6", "7"])
    } else {
      setSelectedCalls([])
    }
  }

  const handleBulkCheck = async () => {
    setIsProcessing(true)
    try {
      await bulkUpdateCallStatus(selectedCalls, true)
      toast({
        title: "Calls marked as checked",
        description: `${selectedCalls.length} calls have been marked as checked.`,
      })
      setSelectedCalls([])
    } catch (error) {
      toast({
        title: "Error updating calls",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkAssign = async (agentId: string, agentName: string) => {
    setIsProcessing(true)
    try {
      await bulkAssignCalls(selectedCalls, agentId)
      toast({
        title: "Calls assigned",
        description: `${selectedCalls.length} calls have been assigned to ${agentName}.`,
      })
      setSelectedCalls([])
    } catch (error) {
      toast({
        title: "Error assigning calls",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (selectedCalls.length === 0) {
    return (
      <div className="mb-4 p-3 border rounded-lg bg-muted/20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox checked={false} onCheckedChange={handleSelectAll} aria-label="Select all calls" />
          <span>Select calls to perform bulk actions</span>
          <Badge variant="outline" className="text-xs">
            Tip: Use Ctrl+Click to select multiple calls
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4 p-3 border rounded-lg bg-primary/5 border-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox checked={true} onCheckedChange={() => setSelectedCalls([])} aria-label="Deselect all calls" />
          <Badge variant="default" className="font-medium">
            {selectedCalls.length} call{selectedCalls.length !== 1 ? "s" : ""} selected
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleBulkCheck}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-1" />
            Mark as Checked
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isProcessing}>
                <Users className="h-4 w-4 mr-1" />
                Assign to Agent
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleBulkAssign("1", "John Smith")}>John Smith</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAssign("2", "Alice Johnson")}>Alice Johnson</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAssign("4", "Current User")}>
                Current User (You)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" onClick={() => setSelectedCalls([])}>
            <X className="h-4 w-4 mr-1" />
            Clear Selection
          </Button>
        </div>
      </div>
    </div>
  )
}
