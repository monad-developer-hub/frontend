// API client for Monad Developer Hub Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

// Types for API responses
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: string
  }
}

export interface Project {
  id: number
  name: string
  logo: string
  description: string
  categories: string[]
  event: string
  award: string
  team: TeamMember[]
  likes: number
  comments: number
  howToPlay: string
  playUrl: string
  github?: string
  website?: string
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: number
  name: string
  twitter: string
  image: string
}

export interface SubmissionRequest {
  photoLink: string
  projectName: string
  description: string
  event: string
  categories: string[]
  teamMembers: { name: string; twitter: string }[]
  githubLink?: string
  websiteLink?: string
  playLink: string
  howToPlay: string
  additionalNotes?: string
}

export interface SubmissionResponse {
  success: boolean
  submissionId: string
  message: string
  estimatedReviewTime: string
  nextSteps: string[]
}

export interface SubmissionStatus {
  submissionId: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_changes'
  projectName: string
  submittedAt: string
  reviewedAt?: string
  feedback?: string
  project?: Project
  timeline: {
    submitted: string
    review_started?: string
    review_completed?: string
    published?: string
  }
}

export interface ProjectsResponse {
  projects: Project[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    categories: string[]
    events: string[]
    awards: string[]
  }
}

export interface AnalyticsStats {
  totalTransactions: number
  tps: number
  activeValidators: number
  blockHeight: number
  timestamp: string
}

// Generic API client
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`)
      }

      return data
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }

  // Projects API
  async getProjects(params: {
    page?: number
    limit?: number
    category?: string[]
    event?: string
    award?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  } = {}): Promise<ProjectsResponse> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v))
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    return this.request<ProjectsResponse>(`/projects?${searchParams}`)
  }

  async getProject(id: number): Promise<{ success: boolean; project: Project }> {
    return this.request<{ success: boolean; project: Project }>(`/projects/${id}`)
  }

  async likeProject(id: number): Promise<{ success: boolean; likes: number; message: string }> {
    return this.request<{ success: boolean; likes: number; message: string }>(`/projects/${id}/like`, {
      method: 'POST',
    })
  }

  // Submissions API
  async submitProject(data: SubmissionRequest): Promise<SubmissionResponse> {
    return this.request<SubmissionResponse>('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getSubmissionStatus(submissionId: string): Promise<SubmissionStatus> {
    return this.request<SubmissionStatus>(`/submissions/${submissionId}`)
  }

  // Analytics API
  async getAnalyticsStats(): Promise<{ success: boolean; stats: AnalyticsStats }> {
    return this.request<{ success: boolean; stats: AnalyticsStats }>('/analytics/stats')
  }

  async getTransactions(params: {
    limit?: number
    type?: string
    from?: string
    to?: string
  } = {}): Promise<any> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })

    return this.request(`/analytics/transactions?${searchParams}`)
  }

  async getTopContracts(params: {
    period?: '1h' | '24h' | '7d' | '30d'
    limit?: number
    sortBy?: 'txCount' | 'uniqueWallets' | 'gasUsed'
  } = {}): Promise<any> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })

    return this.request(`/analytics/contracts/top?${searchParams}`)
  }
}

// Export singleton instance
export const api = new ApiClient()

// Export error handling utility
export const handleApiError = (error: any): string => {
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
} 