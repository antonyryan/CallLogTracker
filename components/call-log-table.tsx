import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Circle, Phone, Clock, User, Check } from "lucide-react"

// Mock call data
const mockCalls = [
  {
    id: "1",
    duration: "4:25",
    phoneNumber: "(555) 123-4567",
    contactName: "Jennifer Martinez",
    dateTime: "Jan 15, 3:30 PM",
    outcome: "Completed",
    assignedTo: "John Smith",
    agentStatus: "online",
    checked: true,
  },
  {
    id: "2",
    duration: "0:00",
    phoneNumber: "(555) 987-6543",
    contactName: "Robert Chen",
    dateTime: "Jan 15, 3:15 PM",
    outcome: "Missed",
    assignedTo: "Alice Johnson",
    agentStatus: "online",
    checked: false,
  },
  {
    id: "3",
    duration: "1:07",
    phoneNumber: "(555) 222-3333",
    contactName: "Unknown Contact",
    dateTime: "Jan 15, 3:00 PM",
    outcome: "Voicemail",
    assignedTo: null,
    agentStatus: null,
    checked: false,
  },
  {
    id: "4",
    duration: "6:52",
    phoneNumber: "(555) 444-5555",
    contactName: "Maria Rodriguez",
    dateTime: "Jan 15, 2:45 PM",
    outcome: "Completed",
    assignedTo: "Michael Brown",
    agentStatus: "online",
    checked: true,
  },
  {
    id: "5",
    duration: "0:00",
    phoneNumber: "(555) 666-7777",
    contactName: "David Thompson",
    dateTime: "Jan 15, 2:30 PM",
    outcome: "No Answer",
    assignedTo: "John Smith",
    agentStatus: "online",
    checked: false,
  },
  {
    id: "6",
    duration: "0:15",
    phoneNumber: "(555) 888-9999",
    contactName: "Lisa Wang",
    dateTime: "Jan 15, 2:15 PM",
    outcome: "Busy",
    assignedTo: null,
    agentStatus: null,
    checked: false,
  },
  {
    id: "7",
    duration: "3:09",
    phoneNumber: "(555) 111-2222",
    contactName: "James Wilson",
    dateTime: "Jan 15, 2:00 PM",
    outcome: "Completed",
    assignedTo: "Alice Johnson",
    agentStatus: "online",
    checked: true,
  },
  {
    id: "8",
    duration: "0:00",
    phoneNumber: "(555) 333-4444",
    contactName: "Amanda Foster",
    dateTime: "Jan 15, 1:45 PM",
    outcome: "Missed",
    assignedTo: "Sarah Davis",
    agentStatus: "offline",
    checked: false,
  },
]

export default function CallLogTable() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Showing {mockCalls.length} calls
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox />
              </TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="hidden md:table-cell">Date/Time</TableHead>
              <TableHead className="hidden md:table-cell">Outcome</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCalls.map((call) => (
              <TableRow
                key={call.id}
                className={`${call.checked ? "bg-muted/50" : ""} hover:bg-muted/30 transition-colors`}
              >
                <TableCell>
                  <Checkbox checked={false} />
                </TableCell>
                <TableCell className="font-mono">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {call.duration}
                  </div>
                </TableCell>
                <TableCell className="font-mono">{call.phoneNumber}</TableCell>
                <TableCell className={call.checked ? "line-through text-muted-foreground" : ""}>
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-muted-foreground" />
                    {call.contactName}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{call.dateTime}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <CallOutcomeBadge outcome={call.outcome} />
                </TableCell>
                <TableCell>
                  <AssignmentDisplay call={call} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={call.checked ? "outline" : "default"}
                    size="sm"
                    className={call.checked ? "text-muted-foreground" : ""}
                  >
                    {call.checked ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Checked
                      </>
                    ) : (
                      "Mark as Checked"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function AssignmentDisplay({ call }: { call: any }) {
  if (!call.assignedTo) {
    return (
      <Badge variant="outline" className="text-muted-foreground bg-transparent">
        <Circle className="h-2 w-2 mr-1 fill-current text-gray-400" />
        Unassigned
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="font-normal">
      <Circle
        className={`h-2 w-2 mr-1 fill-current ${call.agentStatus === "online" ? "text-green-500" : "text-gray-400"}`}
      />
      {call.assignedTo}
    </Badge>
  )
}

function CallOutcomeBadge({ outcome }: { outcome: string }) {
  const getOutcomeStyle = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "missed":
        return "bg-red-100 text-red-800 border-red-200"
      case "voicemail":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "busy":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "no answer":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Badge variant="outline" className={`${getOutcomeStyle(outcome)} font-medium`}>
      {outcome}
    </Badge>
  )
}
