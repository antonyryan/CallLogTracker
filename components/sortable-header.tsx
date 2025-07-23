"use client"
import { TableHead } from "@/components/ui/table"
import { ArrowUpDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface SortableHeaderProps {
  field: string
  label: string
  className?: string
}

export function SortableHeader({ field, label, className }: SortableHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get("sort")
  const currentOrder = searchParams.get("order")

  const isActive = currentSort === field
  const isAsc = isActive && currentOrder === "asc"
  const isDesc = isActive && currentOrder === "desc"

  const handleSort = () => {
    const params = new URLSearchParams(searchParams)

    if (isActive) {
      if (isAsc) {
        params.set("order", "desc")
      } else if (isDesc) {
        params.delete("sort")
        params.delete("order")
      }
    } else {
      params.set("sort", field)
      params.set("order", "asc")
    }

    router.push(`?${params.toString()}`)
  }

  return (
    <TableHead className={cn("cursor-pointer select-none", className)} onClick={handleSort}>
      <div className="flex items-center">
        {label}
        <ArrowUpDown
          className={cn(
            "ml-1 h-4 w-4",
            isActive ? "opacity-100" : "opacity-40",
            isAsc ? "text-primary" : "",
            isDesc ? "text-primary rotate-180" : "",
          )}
        />
      </div>
    </TableHead>
  )
}
