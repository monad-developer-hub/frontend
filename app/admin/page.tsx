"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { LoginPopup } from "@/components/LoginPopup"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Clock, CheckCircle, XCircle, AlertCircle, Plus, X, Loader2, Award, Camera, Search, ExternalLink, Image as ImageIcon } from "lucide-react"

interface TeamMember {
  name: string
  twitter: string
}

interface Submission {
  submissionId: string
  projectName: string
  description: string
  photoLink: string
  event: string
  categories: string[]
  teamMembers: TeamMember[]
  githubLink?: string
  websiteLink?: string
  playLink: string
  howToPlay: string
  additionalNotes?: string
  status: string
  reviewerId?: number
  feedback?: string
  changesRequested?: string[]
  submittedAt: string
  reviewStartedAt?: string
  reviewedAt?: string
  publishedAt?: string
  approvedProjectId?: number
  project?: any
}

interface ProjectExtras {
  award: string
  teamPhotos: { memberName: string; photoUrl: string }[]
}

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-500", bgColor: "bg-yellow-500/10", label: "Pending" },
  under_review: { icon: Clock, color: "text-blue-500", bgColor: "bg-blue-500/10", label: "Under Review" },
  approved: { icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-500/10", label: "Approved" },
  rejected: { icon: XCircle, color: "text-red-500", bgColor: "bg-red-500/10", label: "Rejected" },
  requires_changes: { icon: AlertCircle, color: "text-orange-500", bgColor: "bg-orange-500/10", label: "Requires Changes" }
}

export default function AdminPage() {
  const { isAuthenticated, checkAuth, logout } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [extrasDialogOpen, setExtrasDialogOpen] = useState(false)
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Review form state
  const [reviewStatus, setReviewStatus] = useState("")
  const [feedback, setFeedback] = useState("")
  const [changesRequested, setChangesRequested] = useState<string[]>([])
  const [newChange, setNewChange] = useState("")

  // Project extras form state
  const [projectExtras, setProjectExtras] = useState<ProjectExtras>({
    award: "",
    teamPhotos: []
  })

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    checkAuthentication()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions()
    }
  }, [selectedStatus, isAuthenticated])

  useEffect(() => {
    // Filter submissions based on search query
    if (!searchQuery.trim()) {
      setFilteredSubmissions(submissions)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = submissions.filter(submission => 
        submission.projectName.toLowerCase().includes(query) ||
        submission.submissionId.toLowerCase().includes(query)
      )
      setFilteredSubmissions(filtered)
    }
  }, [submissions, searchQuery])

  const checkAuthentication = async () => {
    if (!isAuthenticated) {
      const isValid = await checkAuth()
      if (!isValid) {
        setShowLoginPopup(true)
        setLoading(false)
        return
      }
    }
    setLoading(false)
  }

  // Auto-check authentication every 5 minutes when on admin page
  useEffect(() => {
    const interval = setInterval(async () => {
      const isValid = await checkAuth()
      if (!isValid && window.location.pathname === '/admin') {
        setShowLoginPopup(true)
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [checkAuth])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const { api } = await import("@/lib/api")
      const data = await api.getSubmissions(selectedStatus)
      
      if (data.success) {
        setSubmissions(data.submissions || [])
      } else {
        setError("Failed to fetch submissions")
      }
    } catch (err) {
      setError("Error fetching submissions")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openReviewDialog = (submission: Submission) => {
    setSelectedSubmission(submission)
    setReviewStatus(submission.status)
    setFeedback(submission.feedback || "")
    setChangesRequested(submission.changesRequested || [])
    setReviewDialogOpen(true)
  }

  const openExtrasDialog = (submission: Submission) => {
    setSelectedSubmission(submission)
    setProjectExtras({
      award: submission.project?.award || "",
      teamPhotos: submission.teamMembers.map(member => ({
        memberName: member.name,
        photoUrl: submission.project?.teamMembers?.find((tm: any) => tm.name === member.name)?.image || ""
      }))
    })
    setExtrasDialogOpen(true)
  }

  const handleReviewSubmit = async () => {
    if (!selectedSubmission) return

    setIsSubmitting(true)
    try {
      const { api } = await import("@/lib/api")
      const data = await api.reviewSubmission(selectedSubmission.submissionId, {
        status: reviewStatus as any,
        feedback: feedback || undefined,
        changesRequested: changesRequested.length > 0 ? changesRequested : undefined,
        reviewerId: 1 // TODO: Get from auth context
      })

      if (data.success) {
        setReviewDialogOpen(false)
        fetchSubmissions()
        
        // If approved, automatically open the project extras dialog
        if (reviewStatus === "approved") {
          setTimeout(() => openExtrasDialog(selectedSubmission), 500)
        }
      } else {
        setError("Failed to submit review")
      }
    } catch (err) {
      setError("Error submitting review")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExtrasSubmit = async () => {
    if (!selectedSubmission) return

    setIsSubmitting(true)
    try {
      const { api } = await import("@/lib/api")
      const data = await api.updateProjectExtras(
        selectedSubmission.submissionId,
        {
          award: projectExtras.award || undefined,
          teamPhotos: projectExtras.teamPhotos.filter(tp => tp.photoUrl)
        }
      )

      if (data.success) {
        setExtrasDialogOpen(false)
        fetchSubmissions()
      } else {
        setError("Failed to update project extras")
      }
    } catch (err) {
      setError("Error updating project extras")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addChangeRequest = () => {
    if (newChange.trim()) {
      setChangesRequested([...changesRequested, newChange.trim()])
      setNewChange("")
    }
  }

  const removeChangeRequest = (index: number) => {
    setChangesRequested(changesRequested.filter((_, i) => i !== index))
  }

  const updateTeamPhoto = (memberName: string, photoUrl: string) => {
    setProjectExtras(prev => ({
      ...prev,
      teamPhotos: prev.teamPhotos.map(tp => 
        tp.memberName === memberName ? { ...tp, photoUrl } : tp
      )
    }))
  }

  const handleChangePassword = async () => {
    setPasswordError("")
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required")
      return
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }
    
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters")
      return
    }
    
    if (newPassword === currentPassword.split('-')[1]) {
      setPasswordError("New password must be different from current password")
      return
    }
    
    setIsChangingPassword(true)
    try {
      const { api } = await import("@/lib/api")
      const data = await api.changePassword({
        currentPassword,
        newPassword
      })

      if (data.success) {
        setChangePasswordDialogOpen(false)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        alert("Password changed successfully!")
      } else {
        setPasswordError(data.error?.message || "Failed to change password")
      }
    } catch (err) {
      setPasswordError("Error changing password")
      console.error(err)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const generateRandomFeedback = () => {
    const positiveFeedbacks = [
      "Great work! Looking forward to seeing this live.",
      "Solid implementation. Nice job on the execution!",
      "Well done! The concept is interesting and well-executed.",
      "Impressive work. The attention to detail shows.",
      "Nice project! Good use of the tech stack.",
      "Clean implementation. Approved and excited to feature this!",
      "Strong execution. Well done on bringing this idea to life!",
      "Good work! The functionality looks solid.",
      "Nice build! The user experience flows well.",
      "Well executed project. Good job on the development!",
      "Solid work! The technical implementation is sound.",
      "Great job! Looking good for publication.",
      "Nice execution on this concept. Well done!",
      "Good technical approach. Approved!",
      "Well built! The project meets all requirements.",
      "Clean code and good UX. Nice work!",
      "Solid project. Good job on the implementation details.",
      "Well done! The functionality works as expected.",
      "Nice work on this build. Ready for showcase!",
      "Good execution. The project has good potential!"
    ]
    
    const randomFeedback = positiveFeedbacks[Math.floor(Math.random() * positiveFeedbacks.length)]
    setFeedback(randomFeedback)
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement
    target.style.display = 'none'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
            <p className="text-gray-400 mb-6">Please authenticate to access the admin panel.</p>
            <Button onClick={() => setShowLoginPopup(true)} className="bg-purple-600 hover:bg-purple-700">
              Login
            </Button>
          </div>
        </div>
        <LoginPopup 
          open={showLoginPopup} 
          onOpenChange={setShowLoginPopup}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden w-full">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-full w-full">
        <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-6 sm:mb-8 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">Admin - Submission Review</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64 border-gray-800 bg-gray-900"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48 border-gray-800 bg-gray-900">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="border-gray-800 bg-gray-900">
                  <SelectItem value="all">All Submissions</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="requires_changes">Requires Changes</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1 sm:gap-3 min-w-0">
                <Button onClick={fetchSubmissions} variant="outline" className="flex-1 sm:flex-none px-2 sm:px-4 text-xs sm:text-sm">
                  Refresh
                </Button>
                <Button onClick={() => setChangePasswordDialogOpen(true)} variant="outline" className="flex-1 sm:flex-none px-1 sm:px-4 text-blue-400 border-blue-400 hover:bg-blue-400/10 text-xs sm:text-sm">
                  <span className="hidden sm:inline">Change Password</span>
                  <span className="sm:hidden">Change</span>
                </Button>
                <Button onClick={logout} variant="outline" className="flex-1 sm:flex-none px-2 sm:px-4 text-red-400 border-red-400 hover:bg-red-400/10 text-xs sm:text-sm">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid gap-4 sm:gap-6 w-full max-w-full overflow-hidden">
          {filteredSubmissions.map((submission) => {
            const config = statusConfig[submission.status as keyof typeof statusConfig]
            const IconComponent = config.icon

            return (
              <Card key={submission.submissionId} className="border-gray-800 bg-gray-950 w-full">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <CardTitle className="text-lg sm:text-xl mb-1 truncate">{submission.projectName}</CardTitle>
                      <p className="text-sm text-gray-400 truncate">ID: {submission.submissionId}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <Badge variant="outline" className={`${config.bgColor} ${config.color} justify-center sm:justify-start`}>
                        <IconComponent className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openReviewDialog(submission)}
                          className="flex-1 sm:flex-none h-10 sm:h-8 text-sm sm:text-xs"
                        >
                          Review
                        </Button>
                        {submission.status === "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openExtrasDialog(submission)}
                            className="text-purple-400 border-purple-400 hover:bg-purple-400/10 flex-1 sm:flex-none h-10 sm:h-8 text-sm sm:text-xs"
                          >
                            <Award className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Extras</span>
                            <span className="sm:hidden">Award</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6 w-full overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                    {/* Project Image */}
                    <div className="space-y-4 min-w-0 overflow-hidden">
                      <div>
                        <h4 className="font-medium text-gray-300 mb-2 text-sm sm:text-base">Project Image</h4>
                        <div className="relative bg-gray-900 rounded-lg border border-gray-700 aspect-video flex items-center justify-center overflow-hidden">
                          {submission.photoLink ? (
                            <img
                              src={submission.photoLink}
                              alt={submission.projectName}
                              className="w-full h-full object-cover"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                              <span className="text-xs sm:text-sm">No image provided</span>
                            </div>
                          )}
                        </div>
                        {submission.photoLink && (
                          <div className="mt-2 w-full overflow-hidden">
                            <a
                              href={submission.photoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:underline text-xs flex items-center gap-1 w-full overflow-hidden"
                            >
                              <span className="truncate max-w-full block">{submission.photoLink}</span> 
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-300 mb-2 text-sm sm:text-base">Team Members</h4>
                        <div className="space-y-2">
                          {submission.teamMembers.map((member, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <span className="text-gray-400 text-sm font-medium">{member.name}</span>
                              <a
                                href={`https://x.com/${member.twitter.replace('@', '')}/photo`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 w-fit"
                              >
                                @{member.twitter.replace('@', '')}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-4 min-w-0 overflow-hidden">
                      <div>
                        <h4 className="font-medium text-gray-300 mb-2 text-sm sm:text-base">Description</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{submission.description}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-300 mb-1 text-sm sm:text-base">Event</h4>
                          <p className="text-gray-400 text-sm">{submission.event}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-300 mb-1 text-sm sm:text-base">Categories</h4>
                          <div className="flex flex-wrap gap-1">
                            {submission.categories.map((cat) => (
                              <Badge key={cat} variant="secondary" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-300 mb-2 text-sm sm:text-base">How to Play</h4>
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{submission.howToPlay}</p>
                      </div>
                    </div>

                    {/* Links and Status */}
                    <div className="space-y-4 min-w-0 overflow-hidden">
                      <div>
                        <h4 className="font-medium text-gray-300 mb-2 text-sm sm:text-base">Links</h4>
                        <div className="space-y-3 text-sm">
                          <div className="w-full overflow-hidden">
                            <span className="text-gray-500 block sm:inline">Play:</span>{" "}
                            <a href={submission.playLink} className="text-purple-400 hover:underline flex items-start sm:items-center gap-1 mt-1 sm:mt-0 w-full overflow-hidden" target="_blank">
                              <span className="truncate max-w-full block">{submission.playLink}</span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                            </a>
                          </div>
                          {submission.githubLink && (
                            <div className="w-full overflow-hidden">
                              <span className="text-gray-500 block sm:inline">GitHub:</span>{" "}
                              <a href={submission.githubLink} className="text-purple-400 hover:underline flex items-start sm:items-center gap-1 mt-1 sm:mt-0 w-full overflow-hidden" target="_blank">
                                <span className="truncate max-w-full block">{submission.githubLink}</span>
                                <ExternalLink className="h-3 w-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                              </a>
                            </div>
                          )}
                          {submission.websiteLink && (
                            <div className="w-full overflow-hidden">
                              <span className="text-gray-500 block sm:inline">Website:</span>{" "}
                              <a href={submission.websiteLink} className="text-purple-400 hover:underline flex items-start sm:items-center gap-1 mt-1 sm:mt-0 w-full overflow-hidden" target="_blank">
                                <span className="truncate max-w-full block">{submission.websiteLink}</span>
                                <ExternalLink className="h-3 w-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-300 mb-2 text-sm sm:text-base">Submitted</h4>
                        <p className="text-gray-400 text-sm">
                          {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      {submission.additionalNotes && (
                        <div>
                          <h4 className="font-medium text-gray-300 mb-2 text-sm sm:text-base">Additional Notes</h4>
                          <p className="text-gray-400 text-sm leading-relaxed">{submission.additionalNotes}</p>
                        </div>
                      )}
                      {submission.feedback && (
                        <div>
                          <h4 className="font-medium text-gray-300 mb-2 text-sm sm:text-base">Feedback</h4>
                          <p className="text-gray-400 text-sm leading-relaxed">{submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredSubmissions.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {searchQuery ? "No submissions found matching your search." : "No submissions found."}
            </p>
          </div>
        )}

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="border-gray-800 bg-gray-950 max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Review Submission</DialogTitle>
            </DialogHeader>
            {selectedSubmission && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">{selectedSubmission.projectName}</h3>
                  <p className="text-gray-400 text-sm">ID: {selectedSubmission.submissionId}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Review Status</Label>
                    <Select value={reviewStatus} onValueChange={setReviewStatus}>
                      <SelectTrigger className="border-gray-800 bg-gray-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-gray-800 bg-gray-900">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="requires_changes">Requires Changes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="feedback">Feedback</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={generateRandomFeedback}
                        className="text-xs h-7 px-2 text-green-400 border-green-400 hover:bg-green-400/10"
                      >
                        ✨ Quick Positive
                      </Button>
                    </div>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide feedback for the submission..."
                      className="border-gray-800 bg-gray-900"
                    />
                  </div>

                  <div>
                    <Label>Changes Requested</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={newChange}
                          onChange={(e) => setNewChange(e.target.value)}
                          placeholder="Add a change request..."
                          className="border-gray-800 bg-gray-900"
                          onKeyDown={(e) => e.key === "Enter" && addChangeRequest()}
                        />
                        <Button size="sm" onClick={addChangeRequest}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {changesRequested.map((change, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-900 rounded">
                          <span className="flex-1 text-sm">{change}</span>
                          <Button size="sm" variant="ghost" onClick={() => removeChangeRequest(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Button variant="outline" onClick={() => setReviewDialogOpen(false)} className="order-2 sm:order-1">
                    Cancel
                  </Button>
                  <Button onClick={handleReviewSubmit} disabled={isSubmitting} className="order-1 sm:order-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Project Extras Dialog */}
        <Dialog open={extrasDialogOpen} onOpenChange={setExtrasDialogOpen}>
          <DialogContent className="border-gray-800 bg-gray-950 max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Award className="h-5 w-5 text-purple-400" />
                Project Extras
              </DialogTitle>
            </DialogHeader>
            {selectedSubmission && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">{selectedSubmission.projectName}</h3>
                  <p className="text-gray-400 text-sm">Add award and team member photos</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="award">Project Award (Optional)</Label>
                    <div className="space-y-2">
                      <Select 
                        value={projectExtras.award || "none"} 
                        onValueChange={(value) => setProjectExtras(prev => ({ ...prev, award: value === "none" ? "" : value }))}
                      >
                        <SelectTrigger className="border-gray-800 bg-gray-900">
                          <SelectValue placeholder="Select a predefined award or use custom below" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-800 bg-gray-900">
                          <SelectItem value="none">No Award</SelectItem>
                          <SelectItem value="Winner">🏆 Winner</SelectItem>
                          <SelectItem value="Runner-up">🥈 Runner-up</SelectItem>
                          <SelectItem value="Finalist">🏅 Finalist</SelectItem>
                          <SelectItem value="Best UI/UX">🎨 Best UI/UX</SelectItem>
                          <SelectItem value="Most Innovative">💡 Most Innovative</SelectItem>
                          <SelectItem value="Best Technical Implementation">⚙️ Best Technical Implementation</SelectItem>
                          <SelectItem value="People's Choice">❤️ People's Choice</SelectItem>
                          <SelectItem value="Best Game Design">🎮 Best Game Design</SelectItem>
                          <SelectItem value="Most Creative">✨ Most Creative</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-sm text-gray-400">Or enter a custom award:</div>
                      <Input
                        id="award"
                        value={projectExtras.award}
                        onChange={(e) => setProjectExtras(prev => ({ ...prev, award: e.target.value }))}
                        placeholder="Enter custom award (e.g. Best DeFi Solution, Community Favorite...)"
                        className="border-gray-800 bg-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Team Member Photos (Optional)</Label>
                    <div className="space-y-3">
                      {projectExtras.teamPhotos.map((teamPhoto, index) => {
                        const twitterHandle = selectedSubmission?.teamMembers.find(m => m.name === teamPhoto.memberName)?.twitter
                        return (
                          <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-900 rounded">
                            <div className="flex items-center gap-3 sm:gap-2">
                              <Camera className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium text-sm">{teamPhoto.memberName}</p>
                                {twitterHandle && (
                                  <a
                                    href={`https://x.com/${twitterHandle.replace('@', '')}/photo`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1"
                                  >
                                    @{twitterHandle.replace('@', '')}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <Input
                                value={teamPhoto.photoUrl}
                                onChange={(e) => updateTeamPhoto(teamPhoto.memberName, e.target.value)}
                                placeholder="https://example.com/photo.jpg"
                                className="border-gray-700 bg-gray-800"
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Button variant="outline" onClick={() => setExtrasDialogOpen(false)} className="order-2 sm:order-1">
                    Cancel
                  </Button>
                  <Button onClick={handleExtrasSubmit} disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 order-1 sm:order-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Extras"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={changePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen}>
          <DialogContent className="border-gray-800 bg-gray-950 max-w-md max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Change Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="username-password"
                  className="border-gray-800 bg-gray-900"
                />
                <p className="text-xs text-gray-400 mt-1">Format: username-password (e.g., admin-mypassword123)</p>
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="username-newpassword"
                  className="border-gray-800 bg-gray-900"
                />
                <p className="text-xs text-gray-400 mt-1">Format: username-password (e.g., admin-newsecretpassword456)</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="username-newpassword (repeat)"
                  className="border-gray-800 bg-gray-900"
                />
              </div>

              {passwordError && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{passwordError}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button variant="outline" onClick={() => {
                  setChangePasswordDialogOpen(false)
                  setCurrentPassword("")
                  setNewPassword("")
                  setConfirmPassword("")
                  setPasswordError("")
                }} className="order-2 sm:order-1">
                  Cancel
                </Button>
                <Button onClick={handleChangePassword} disabled={isChangingPassword} className="order-1 sm:order-2">
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Login Popup */}
        <LoginPopup 
          open={showLoginPopup} 
          onOpenChange={setShowLoginPopup}
        />
      </div>
    </div>
  )
} 