"use client"

import { redirect } from "next/navigation"
import { ProjectFilters } from "@/components/project-filters"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

export default function Home() {
  redirect("/projects")
}

function ProjectFiltersToggle() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project List</h2>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {showFilters && (
        <div className="mb-6 rounded-lg border border-gray-800 bg-gray-950 p-4">
          <ProjectFilters />
        </div>
      )}
    </div>
  )
}
