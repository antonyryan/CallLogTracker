import type { CallLogItem, Agent } from "./types"

// Predefined team members
const PREDEFINED_AGENTS = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Alice Johnson" },
  { id: "3", name: "Bob Williams" },
  { id: "4", name: "Sarah Davis" },
  { id: "5", name: "Michael Brown" },
  { id: "6", name: "Emily Wilson" },
]

// Mock agent statuses (in real app, this would come from database)
const agentStatuses: Record<string, { status: "online" | "offline"; callsAssigned: number }> = {
  "1": { status: "online", callsAssigned: 4 },
  "2": { status: "online", callsAssigned: 3 },
  "3": { status: "offline", callsAssigned: 0 },
  "4": { status: "online", callsAssigned: 2 },
  "5": { status: "online", callsAssigned: 3 },
  "6": { status: "offline", callsAssigned: 0 },
}

// Mock call assignments (in real app, this would be in database)
const callAssignments: Record<string, string | null> = {
  "1": "1", // John Smith
  "2": "2", // Alice Johnson
  "3": null, // Unassigned
  "4": "5", // Michael Brown
  "5": "1", // John Smith
  "6": null, // Unassigned
  "7": "2", // Alice Johnson
  "8": "4", // Sarah Davis
  "9": "1", // John Smith
  "10": "5", // Michael Brown
  "11": "2", // Alice Johnson
  "12": null, // Unassigned
  "13": "4", // Sarah Davis
  "14": "1", // John Smith
  "15": "5", // Michael Brown
}

// Mock call status tracking (in real app, this would be in database)
const callStatuses: Record<string, { checked: boolean; checkedBy?: string; checkedAt?: string }> = {
  "1": { checked: true, checkedBy: "John Smith", checkedAt: "2024-01-15T15:30:00Z" },
  "2": { checked: false },
  "3": { checked: false },
  "4": { checked: true, checkedBy: "Michael Brown", checkedAt: "2024-01-15T14:45:00Z" },
  "5": { checked: false },
  "6": { checked: false },
  "7": { checked: true, checkedBy: "Alice Johnson", checkedAt: "2024-01-15T13:20:00Z" },
  "8": { checked: false },
  "9": { checked: false },
  "10": { checked: true, checkedBy: "Michael Brown", checkedAt: "2024-01-15T12:15:00Z" },
  "11": { checked: false },
  "12": { checked: false },
  "13": { checked: true, checkedBy: "Sarah Davis", checkedAt: "2024-01-15T11:30:00Z" },
  "14": { checked: false },
  "15": { checked: false },
}

export async function fetchCallLogs(searchParams?: {
  search?: string
  sort?: string
  order?: string
  filter?: string
  assignee?: string
}): Promise<CallLogItem[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Realistic call log data
  let callLogs: CallLogItem[] = [
    {
      id: "1",
      duration: 245,
      phoneNumber: "5551234567",
      contactName: "Jennifer Martinez",
      timestamp: "2024-01-15T15:30:00Z",
      outcome: "Completed",
      checked: callStatuses["1"].checked,
      checkedBy: callStatuses["1"].checkedBy,
      checkedAt: callStatuses["1"].checkedAt,
      assignedTo: getAgentById(callAssignments["1"]),
    },
    {
      id: "2",
      duration: 0,
      phoneNumber: "5559876543",
      contactName: "Robert Chen",
      timestamp: "2024-01-15T15:15:00Z",
      outcome: "Missed",
      checked: callStatuses["2"].checked,
      assignedTo: getAgentById(callAssignments["2"]),
    },
    {
      id: "3",
      duration: 67,
      phoneNumber: "5552223333",
      contactName: null,
      timestamp: "2024-01-15T15:00:00Z",
      outcome: "Voicemail",
      checked: callStatuses["3"].checked,
      assignedTo: getAgentById(callAssignments["3"]),
    },
    {
      id: "4",
      duration: 412,
      phoneNumber: "5554445555",
      contactName: "Maria Rodriguez",
      timestamp: "2024-01-15T14:45:00Z",
      outcome: "Completed",
      checked: callStatuses["4"].checked,
      checkedBy: callStatuses["4"].checkedBy,
      checkedAt: callStatuses["4"].checkedAt,
      assignedTo: getAgentById(callAssignments["4"]),
    },
    {
      id: "5",
      duration: 0,
      phoneNumber: "5556667777",
      contactName: "David Thompson",
      timestamp: "2024-01-15T14:30:00Z",
      outcome: "No Answer",
      checked: callStatuses["5"].checked,
      assignedTo: getAgentById(callAssignments["5"]),
    },
    {
      id: "6",
      duration: 15,
      phoneNumber: "5558889999",
      contactName: "Lisa Wang",
      timestamp: "2024-01-15T14:15:00Z",
      outcome: "Busy",
      checked: callStatuses["6"].checked,
      assignedTo: getAgentById(callAssignments["6"]),
    },
    {
      id: "7",
      duration: 189,
      phoneNumber: "5551112222",
      contactName: "James Wilson",
      timestamp: "2024-01-15T14:00:00Z",
      outcome: "Completed",
      checked: callStatuses["7"].checked,
      checkedBy: callStatuses["7"].checkedBy,
      checkedAt: callStatuses["7"].checkedAt,
      assignedTo: getAgentById(callAssignments["7"]),
    },
    {
      id: "8",
      duration: 0,
      phoneNumber: "5553334444",
      contactName: "Amanda Foster",
      timestamp: "2024-01-15T13:45:00Z",
      outcome: "Missed",
      checked: callStatuses["8"].checked,
      assignedTo: getAgentById(callAssignments["8"]),
    },
    {
      id: "9",
      duration: 298,
      phoneNumber: "5557778888",
      contactName: "Kevin Park",
      timestamp: "2024-01-15T13:30:00Z",
      outcome: "Completed",
      checked: callStatuses["9"].checked,
      assignedTo: getAgentById(callAssignments["9"]),
    },
    {
      id: "10",
      duration: 156,
      phoneNumber: "5559990000",
      contactName: "Sarah Mitchell",
      timestamp: "2024-01-15T13:15:00Z",
      outcome: "Completed",
      checked: callStatuses["10"].checked,
      checkedBy: callStatuses["10"].checkedBy,
      checkedAt: callStatuses["10"].checkedAt,
      assignedTo: getAgentById(callAssignments["10"]),
    },
    {
      id: "11",
      duration: 0,
      phoneNumber: "5551239876",
      contactName: "Michael Davis",
      timestamp: "2024-01-15T13:00:00Z",
      outcome: "No Answer",
      checked: callStatuses["11"].checked,
      assignedTo: getAgentById(callAssignments["11"]),
    },
    {
      id: "12",
      duration: 89,
      phoneNumber: "5554567890",
      contactName: "Rachel Green",
      timestamp: "2024-01-15T12:45:00Z",
      outcome: "Voicemail",
      checked: callStatuses["12"].checked,
      assignedTo: getAgentById(callAssignments["12"]),
    },
    {
      id: "13",
      duration: 234,
      phoneNumber: "5557891234",
      contactName: "Thomas Anderson",
      timestamp: "2024-01-15T12:30:00Z",
      outcome: "Completed",
      checked: callStatuses["13"].checked,
      checkedBy: callStatuses["13"].checkedBy,
      checkedAt: callStatuses["13"].checkedAt,
      assignedTo: getAgentById(callAssignments["13"]),
    },
    {
      id: "14",
      duration: 45,
      phoneNumber: "5552468135",
      contactName: "Nicole Brown",
      timestamp: "2024-01-15T12:15:00Z",
      outcome: "Busy",
      checked: callStatuses["14"].checked,
      assignedTo: getAgentById(callAssignments["14"]),
    },
    {
      id: "15",
      duration: 0,
      phoneNumber: "5559753186",
      contactName: "Christopher Lee",
      timestamp: "2024-01-15T12:00:00Z",
      outcome: "Missed",
      checked: callStatuses["15"].checked,
      assignedTo: getAgentById(callAssignments["15"]),
    },
  ]

  // Apply search filter
  if (searchParams?.search) {
    const searchTerm = searchParams.search.toLowerCase()
    callLogs = callLogs.filter(
      (call) =>
        call.contactName?.toLowerCase().includes(searchTerm) ||
        call.phoneNumber.includes(searchTerm) ||
        call.outcome.toLowerCase().includes(searchTerm),
    )
  }

  // Apply status and assignment filters
  if (searchParams?.filter) {
    switch (searchParams.filter) {
      case "unassigned":
        callLogs = callLogs.filter((call) => !call.assignedTo)
        break
      case "unchecked":
        callLogs = callLogs.filter((call) => !call.checked)
        break
      case "checked":
        callLogs = callLogs.filter((call) => call.checked)
        break
      case "assigned":
        if (searchParams.assignee) {
          callLogs = callLogs.filter((call) => call.assignedTo?.id === searchParams.assignee)
        } else {
          callLogs = callLogs.filter((call) => call.assignedTo)
        }
        break
    }
  }

  // Apply sorting
  if (searchParams?.sort && searchParams?.order) {
    const { sort, order } = searchParams
    callLogs.sort((a, b) => {
      let aValue: any = a[sort as keyof CallLogItem]
      let bValue: any = b[sort as keyof CallLogItem]

      if (sort === "timestamp") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (order === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  return callLogs
}

function getAgentById(agentId: string | null): Agent | null {
  if (!agentId) return null

  const agent = PREDEFINED_AGENTS.find((a) => a.id === agentId)
  if (!agent) return null

  const status = agentStatuses[agentId]
  return {
    ...agent,
    status: status?.status || "offline",
    callsAssigned: status?.callsAssigned || 0,
  }
}

// Function to get agent statuses for the status panel
export async function fetchAgentStatuses(): Promise<Agent[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return PREDEFINED_AGENTS.map((agent) => ({
    ...agent,
    status: agentStatuses[agent.id]?.status || "offline",
    callsAssigned: agentStatuses[agent.id]?.callsAssigned || 0,
  }))
}

// Function to simulate random assignment algorithm
export function assignCallsRandomly() {
  // Get available agents (online status)
  const availableAgents = PREDEFINED_AGENTS.filter((agent) => agentStatuses[agent.id]?.status === "online")

  if (availableAgents.length === 0) return

  // Get unassigned calls
  const unassignedCalls = Object.keys(callAssignments).filter((callId) => !callAssignments[callId])

  // Assign calls to agents with least workload
  unassignedCalls.forEach((callId) => {
    // Find agent with minimum calls assigned
    const agentWorkloads = availableAgents.map((agent) => ({
      agent,
      workload: agentStatuses[agent.id]?.callsAssigned || 0,
    }))

    agentWorkloads.sort((a, b) => a.workload - b.workload)

    // If there are ties, pick randomly among agents with minimum workload
    const minWorkload = agentWorkloads[0].workload
    const candidateAgents = agentWorkloads.filter((a) => a.workload === minWorkload)
    const selectedAgent = candidateAgents[Math.floor(Math.random() * candidateAgents.length)]

    // Assign the call
    callAssignments[callId] = selectedAgent.agent.id
    agentStatuses[selectedAgent.agent.id].callsAssigned++
  })
}

// Function to get call statistics
export async function getCallStatistics() {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const totalCalls = Object.keys(callStatuses).length
  const checkedCalls = Object.values(callStatuses).filter((status) => status.checked).length
  const uncheckedCalls = totalCalls - checkedCalls
  const assignedCalls = Object.values(callAssignments).filter((assignment) => assignment !== null).length
  const unassignedCalls = totalCalls - assignedCalls

  return {
    total: totalCalls,
    checked: checkedCalls,
    unchecked: uncheckedCalls,
    assigned: assignedCalls,
    unassigned: unassignedCalls,
  }
}

// Function to update call status in mock database
export function updateCallStatus(callId: string, checked: boolean, updatedBy: string) {
  callStatuses[callId] = {
    checked,
    checkedBy: checked ? updatedBy : undefined,
    checkedAt: checked ? new Date().toISOString() : undefined,
  }
}
