"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, X, ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import { api, handleApiError, type SubmissionRequest, type SubmissionResponse } from "@/lib/api"

interface RegistrationData {
  // Phase 1: Basic Info
  photoLink: string
  projectName: string
  description: string

  // Phase 2: Event & Categories
  event: string
  categories: string[]

  // Phase 3: Team & Links
  teamMembers: Array<{ name: string; twitter: string }>
  githubLink: string
  websiteLink: string
  playLink: string

  // Phase 4: Additional Info
  howToPlay: string
  additionalNotes: string
}

const initialData: RegistrationData = {
  photoLink: "",
  projectName: "",
  description: "",
  event: "",
  categories: [],
  teamMembers: [{ name: "", twitter: "" }],
  githubLink: "",
  websiteLink: "",
  playLink: "",
  howToPlay: "",
  additionalNotes: "",
}

const events = [
  "Mission: 1 Crazy Contract",
  "Mission: 2 MCP Madness",
  "Mission: 3 Break Monad V2",
  "Mission: 4 Visualizer & Dashboard",
  "Hackathon",
  "Free Will!!!",
]

const availableCategories = ["DeFi", "Gaming", "AI", "Infrastructure", "Consumer", "NFT", "Stablecoins"]

export function RegistrationDialog() {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState(1)
  const [data, setData] = useState<RegistrationData>(initialData)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionId, setSubmissionId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null)

  const updateData = (field: keyof RegistrationData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const addTeamMember = () => {
    setData((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: "", twitter: "" }],
    }))
  }

  const removeTeamMember = (index: number) => {
    setData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }))
  }

  const updateTeamMember = (index: number, field: "name" | "twitter", value: string) => {
    setData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => (i === index ? { ...member, [field]: value } : member)),
    }))
  }

  const toggleCategory = (category: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Prepare submission data
      const submissionData: SubmissionRequest = {
        photoLink: data.photoLink,
        projectName: data.projectName,
        description: data.description,
        event: data.event,
        categories: data.categories,
        teamMembers: data.teamMembers.filter(member => member.name && member.twitter),
        githubLink: data.githubLink || undefined,
        websiteLink: data.websiteLink || undefined,
        playLink: data.playLink,
        howToPlay: data.howToPlay,
        additionalNotes: data.additionalNotes || undefined,
      }

      // Submit to backend API
      const result = await api.submitProject(submissionData)
      
      setSubmissionResult(result)
      setSubmissionId(result.submissionId)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitError(handleApiError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setData(initialData)
    setPhase(1)
    setIsSubmitted(false)
    setSubmissionId("")
    setSubmitError("")
    setSubmissionResult(null)
    setOpen(false)
  }

  const canProceed = () => {
    switch (phase) {
      case 1:
        return data.photoLink && data.projectName && data.description
      case 2:
        return data.event && data.categories.length > 0
      case 3:
        return data.teamMembers.some((m) => m.name && m.twitter) && data.playLink
      case 4:
        return data.howToPlay
      default:
        return false
    }
  }

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-gray-400 hover:text-white">
            Submit Project
          </Button>
        </DialogTrigger>
        <DialogContent className="border-gray-800 bg-gray-950 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Submission Received
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-gray-300 mb-2">{submissionResult?.message || "Your project has been submitted for review!"}</p>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                <p className="text-sm text-gray-400 mb-1">Submission ID:</p>
                <p className="font-mono text-purple-400 font-medium">{submissionId}</p>
              </div>
              <p className="text-sm text-gray-400 mt-3">
                {submissionResult?.estimatedReviewTime || "We'll review your submission and get back to you within 2-3 business days."}
              </p>
              {submissionResult?.nextSteps && submissionResult.nextSteps.length > 0 && (
                <div className="mt-4 text-left">
                  <p className="text-sm text-gray-400 mb-2">Next steps:</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {submissionResult.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <Button onClick={resetForm} className="w-full">
            Submit Another Project
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-gray-400 hover:text-white">
          Submit Project
        </Button>
      </DialogTrigger>
      <DialogContent className="border-gray-800 bg-gray-950 sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Your Project - Phase {phase} of 4</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((p) => (
              <div key={p} className={`h-2 flex-1 rounded ${p <= phase ? "bg-purple-500" : "bg-gray-700"}`} />
            ))}
          </div>

          {/* Phase 1: Basic Info */}
          {phase === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div>
                <Label htmlFor="photoLink">Project Logo URL</Label>
                <Input
                  id="photoLink"
                  value={data.photoLink}
                  onChange={(e) => updateData("photoLink", e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="border-gray-800 bg-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={data.projectName}
                  onChange={(e) => updateData("projectName", e.target.value)}
                  placeholder="MonadAwesome"
                  className="border-gray-800 bg-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => updateData("description", e.target.value)}
                  placeholder="Describe what your project does..."
                  className="border-gray-800 bg-gray-900"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Phase 2: Event & Categories */}
          {phase === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Event & Categories</h3>

              <div>
                <Label>Event</Label>
                <Select value={data.event} onValueChange={(value) => updateData("event", value)}>
                  <SelectTrigger className="border-gray-800 bg-gray-900">
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-800 bg-gray-900">
                    {events.map((event) => (
                      <SelectItem key={event} value={event}>
                        {event}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Categories</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={data.categories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={category} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {data.categories.map((category) => (
                    <Badge key={category} variant="outline" className="border-purple-500">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phase 3: Team & Links */}
          {phase === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Team & Links</h3>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Team Members</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {data.teamMembers.map((member, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                      className="border-gray-800 bg-gray-900"
                    />
                    <Input
                      placeholder="Twitter handle"
                      value={member.twitter}
                      onChange={(e) => updateTeamMember(index, "twitter", e.target.value)}
                      className="border-gray-800 bg-gray-900"
                    />
                    {data.teamMembers.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeTeamMember(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="playLink">Play/Demo Link *</Label>
                <Input
                  id="playLink"
                  value={data.playLink}
                  onChange={(e) => updateData("playLink", e.target.value)}
                  placeholder="https://yourproject.com"
                  className="border-gray-800 bg-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="githubLink">GitHub Link</Label>
                <Input
                  id="githubLink"
                  value={data.githubLink}
                  onChange={(e) => updateData("githubLink", e.target.value)}
                  placeholder="https://github.com/yourproject"
                  className="border-gray-800 bg-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="websiteLink">Website Link</Label>
                <Input
                  id="websiteLink"
                  value={data.websiteLink}
                  onChange={(e) => updateData("websiteLink", e.target.value)}
                  placeholder="https://yourproject.com"
                  className="border-gray-800 bg-gray-900"
                />
              </div>
            </div>
          )}

          {/* Phase 4: Additional Info */}
          {phase === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>

              <div>
                <Label htmlFor="howToPlay">How to Play/Use *</Label>
                <Textarea
                  id="howToPlay"
                  value={data.howToPlay}
                  onChange={(e) => updateData("howToPlay", e.target.value)}
                  placeholder="Explain how users can interact with your project..."
                  className="border-gray-800 bg-gray-900"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  value={data.additionalNotes}
                  onChange={(e) => updateData("additionalNotes", e.target.value)}
                  placeholder="Any additional information you'd like to share..."
                  className="border-gray-800 bg-gray-900"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Error display */}
          {submitError && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{submitError}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setPhase(phase - 1)} disabled={phase === 1}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {phase < 4 ? (
              <Button onClick={() => setPhase(phase + 1)} disabled={!canProceed()}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={!canProceed() || isSubmitting} 
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Project"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
