"use server"

import { revalidatePath } from "next/cache"
import { assignCallsRandomly, updateCallStatus } from "./data"

// Update agent status (online/offline)
export async function updateAgentStatus(agentId: string, status: "online" | "offline") {
  await new Promise((resolve) => setTimeout(resolve, 500))

  console.log(`Updating agent ${agentId} status to ${status}`)

  // In a real app, this would update the database
  // For now, we'll simulate it

  revalidatePath("/")
  return { success: true }
}

// Fetch current agent statuses
export async function fetchAgentStatuses() {
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, this would fetch from database
  // For now, return mock data
  return [
    { id: "1", name: "John Smith", status: "online" as const, callsAssigned: 2 },
    { id: "2", name: "Alice Johnson", status: "online" as const, callsAssigned: 3 },
    { id: "3", name: "Bob Williams", status: "offline" as const, callsAssigned: 0 },
    { id: "4", name: "Sarah Davis", status: "offline" as const, callsAssigned: 0 },
    { id: "5", name: "Michael Brown", status: "online" as const, callsAssigned: 1 },
    { id: "6", name: "Emily Wilson", status: "offline" as const, callsAssigned: 0 },
  ]
}

// Distribute calls to agents using random assignment
export async function distributeCallsToAgents() {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log("Running random assignment algorithm")

  // Run the assignment algorithm
  assignCallsRandomly()

  revalidatePath("/")

  return {
    success: true,
    distributed: 3, // Number of calls redistributed
    agents: 3, // Number of available agents
  }
}

// Update call status with conflict detection and tracking
export async function updateCallLogStatus(callId: string, checked: boolean, updatedBy?: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  console.log(`Updating call ${callId} to ${checked ? "checked" : "unchecked"} by ${updatedBy}`)

  // Simulate conflict detection (3% chance for demo)
  const hasConflict = Math.random() < 0.03

  if (hasConflict) {
    return {
      success: false,
      conflict: true,
      currentStatus: !checked,
      updatedBy: "Another Agent",
    }
  }

  // Update the call status in mock database
  updateCallStatus(callId, checked, updatedBy || "Unknown Agent")

  // In a real app, this would:
  // 1. Update the database
  // 2. Broadcast the change to all connected users via WebSocket
  // 3. Log the change for audit purposes

  revalidatePath("/")
  return { success: true, conflict: false }
}

// Bulk update multiple calls
export async function bulkUpdateCallStatus(callIds: string[], checked: boolean) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(`Bulk updating ${callIds.length} calls to ${checked ? "checked" : "unchecked"}`)

  // Get current agent info
  const currentAgent = "Current User" // In real app, get from session

  // Update each call
  callIds.forEach((callId) => {
    updateCallStatus(callId, checked, currentAgent)
  })

  revalidatePath("/")
  return { success: true, updated: callIds.length }
}

// Bulk assign multiple calls to an agent
export async function bulkAssignCalls(callIds: string[], agentId: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(`Bulk assigning ${callIds.length} calls to agent ${agentId}`)

  revalidatePath("/")
  return { success: true, assigned: callIds.length }
}

// Assign a single call to an agent
export async function assignCallToAgent(callId: string, agentId: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  console.log(`Assigning call ${callId} to agent ${agentId}`)

  revalidatePath("/")
  return { success: true }
}
