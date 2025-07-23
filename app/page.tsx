import { Suspense } from "react"
import CallLogTable from "@/components/call-log-table"
import { CallLogSkeleton } from "@/components/call-log-skeleton"
import SearchBar from "@/components/search-bar"
import BulkActionsToolbar from "@/components/bulk-actions-toolbar"
import AgentSelector from "@/components/agent-selector"
import CallFilters from "@/components/call-filters"
import AgentStatusHeader from "@/components/agent-status-header"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Call Log Tracker</h1>
            <p className="text-muted-foreground">Track and manage call logs for your team</p>
          </div>
          <div className="flex items-center gap-4">
            <AgentSelector />
            <AgentStatusHeader />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <SearchBar />
            <CallFilters />
          </div>

          <BulkActionsToolbar />

          <Suspense fallback={<CallLogSkeleton />}>
            <CallLogTable />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
