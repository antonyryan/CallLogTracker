"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, Clock, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const SEARCH_HISTORY_KEY = "call-log-search-history"
const MAX_HISTORY_ITEMS = 5

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // Real-time filtering as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams)

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim())
      } else {
        params.delete("search")
      }

      router.push(`?${params.toString()}`)
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchTerm, searchParams, router])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setShowHistory(false)

    // Add to search history if it's a meaningful search
    if (term.trim() && term.length > 2) {
      const newHistory = [term, ...searchHistory.filter((h) => h !== term)].slice(0, MAX_HISTORY_ITEMS)
      setSearchHistory(newHistory)
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    const params = new URLSearchParams(searchParams)
    params.delete("search")
    router.push(`?${params.toString()}`)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      clearSearch()
    }
  }

  return (
    <TooltipProvider>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search by contact name, phone number, or outcome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowHistory(true)}
            className="pl-10 pr-20"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <HelpCircle className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search across contact names, phone numbers, and call outcomes</p>
                <p className="text-xs text-muted-foreground mt-1">Press Escape to clear</p>
              </TooltipContent>
            </Tooltip>
            {searchTerm && (
              <Button variant="ghost" size="sm" onClick={clearSearch} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Search History Dropdown */}
        {showHistory && searchHistory.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50">
            <div className="p-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Clock className="h-3 w-3" />
                Recent searches
              </div>
              <div className="space-y-1">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(term)}
                    className="w-full text-left px-2 py-1 text-sm hover:bg-muted rounded text-foreground"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active search indicator */}
        {searchTerm && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              Searching for: "{searchTerm}"
              <button onClick={clearSearch} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
