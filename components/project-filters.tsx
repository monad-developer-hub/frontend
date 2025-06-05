"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

export function ProjectFilters() {
  const categories = [
    { id: "defi", label: "DeFi" },
    { id: "gaming", label: "Gaming" },
    { id: "ai", label: "AI" },
    { id: "infrastructure", label: "Infrastructure" },
    { id: "consumer", label: "Consumer" },
    { id: "stablecoins", label: "Stablecoins" },
  ]

  const events = [
    { id: "mission-1", label: "Mission: 1 Crazy Contract" },
    { id: "mission-2", label: "Mission: 2 MCP Madness" },
    { id: "mission-3", label: "Mission: 3 Break Monad V2" },
    { id: "mission-4", label: "Mission: 4 Visualizer & Dashboard" },
    { id: "hackathon", label: "Hackathon" },
    { id: "free-will", label: "Passion Project" },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-400">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search projects..."
            className="border-gray-800 bg-gray-900 pl-9 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-400">Categories</h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox id={category.id} />
              <Label htmlFor={category.id} className="text-sm font-medium text-gray-300">
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-400">Events</h3>
        <div className="grid grid-cols-1 gap-2">
          {events.map((event) => (
            <div key={event.id} className="flex items-center space-x-2">
              <Checkbox id={event.id} />
              <Label htmlFor={event.id} className="text-sm font-medium text-gray-300">
                {event.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
