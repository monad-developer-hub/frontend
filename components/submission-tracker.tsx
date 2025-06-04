"use client"

import { useState } from "react"
import { Search, CheckCircle, Clock, AlertCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { api, handleApiError, type SubmissionStatus } from "@/lib/api"

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    label: "Pending Review"
  },
  under_review: {
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    label: "Under Review"
  },
  approved: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    label: "Approved"
  },
  rejected: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    label: "Rejected"
  },
  requires_changes: {
    icon: AlertCircle,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    label: "Requires Changes"
  }
}

export function SubmissionTracker() {
  const [open, setOpen] = useState(false)
  const [submissionId, setSubmissionId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus | null>(null)

  const handleTrack = async () => {
    if (!submissionId.trim()) {
      setError("Please enter a submission ID")
      return
    }

    setIsLoading(true)
    setError("")
    setSubmissionStatus(null)

    try {
      const status = await api.getSubmissionStatus(submissionId.trim())
      setSubmissionStatus(status)
    } catch (error) {
      console.error("Error tracking submission:", error)
      setError(handleApiError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderTimeline = (timeline: SubmissionStatus['timeline']) => {
    const steps = [
      { key: 'submitted', label: 'Submitted', date: timeline.submitted },
      { key: 'review_started', label: 'Review Started', date: timeline.review_started },
      { key: 'review_completed', label: 'Review Completed', date: timeline.review_completed },
      { key: 'published', label: 'Published', date: timeline.published }
    ]

    return (
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              step.date ? 'bg-purple-500' : 'bg-gray-600'
            }`} />
            <div className="flex-1">
              <p className={`text-sm ${step.date ? 'text-gray-300' : 'text-gray-500'}`}>
                {step.label}
              </p>
              {step.date && (
                <p className="text-xs text-gray-400">{formatDate(step.date)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-gray-400 hover:text-white">
          <Search className="h-4 w-4 mr-2" />
          Track Submission
        </Button>
      </DialogTrigger>
      <DialogContent className="border-gray-800 bg-gray-950 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Track Submission Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="submissionId">Submission ID</Label>
            <div className="flex gap-2">
              <Input
                id="submissionId"
                value={submissionId}
                onChange={(e) => setSubmissionId(e.target.value)}
                placeholder="SUB-1234567890-ABCDEF"
                className="border-gray-800 bg-gray-900"
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              />
              <Button 
                onClick={handleTrack} 
                disabled={isLoading || !submissionId.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {submissionStatus && (
            <div className="space-y-4 border-t border-gray-800 pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-200">{submissionStatus.projectName}</h3>
                  {(() => {
                    const config = statusConfig[submissionStatus.status]
                    const IconComponent = config.icon
                    return (
                      <Badge 
                        variant="outline" 
                        className={`${config.borderColor} ${config.bgColor} ${config.color}`}
                      >
                        <IconComponent className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                    )
                  })()}
                </div>

                <div className="text-sm text-gray-400">
                  <p>Submitted: {formatDate(submissionStatus.submittedAt)}</p>
                  {submissionStatus.reviewedAt && (
                    <p>Reviewed: {formatDate(submissionStatus.reviewedAt)}</p>
                  )}
                </div>

                {submissionStatus.feedback && (
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-400 mb-1">Feedback:</p>
                    <p className="text-sm text-gray-300">{submissionStatus.feedback}</p>
                  </div>
                )}

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-400 mb-3">Timeline:</p>
                  {renderTimeline(submissionStatus.timeline)}
                </div>

                {submissionStatus.project && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium mb-1">✅ Project Published!</p>
                    <p className="text-sm text-gray-300">
                      Your project is now live in the developer hub.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 