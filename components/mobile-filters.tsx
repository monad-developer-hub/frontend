"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ProjectFilters } from "./project-filters"
import { SlidersHorizontal } from "lucide-react"

export function MobileFilters() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="sr-only">Filter projects</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] bg-gray-950 p-0">
        <SheetHeader className="border-b border-gray-800 p-4">
          <SheetTitle>Filter Projects</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <ProjectFilters />
        </div>
      </SheetContent>
    </Sheet>
  )
}
