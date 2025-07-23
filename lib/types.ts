export interface CallLogItem {
  id: string
  duration: number // in seconds
  phoneNumber: string
  contactName: string | null
  timestamp: string // ISO date string
  outcome: string
  checked: boolean
  checkedBy?: string | null
  checkedAt?: string | null
  assignedTo?: Agent | null
  assignmentHistory?: string
}

export interface Agent {
  id: string
  name: string
  status: "online" | "offline"
  callsAssigned?: number
  isCurrentUser?: boolean
  workload?: number
}
