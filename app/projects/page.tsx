"use client"

import { ProjectTable } from "@/components/project-table"
import { ProjectFilters } from "@/components/project-filters"
import { Banner } from "@/components/banner"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

export default function ProjectsPage() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header activeTab="projects" />
      <Banner title="Monad Developer Hub" description="Discover and explore projects built by the Monad community" />

      <main className="container mx-auto px-4 py-6">
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
        <ProjectTable />
      </main>
    </div>
  )
}
