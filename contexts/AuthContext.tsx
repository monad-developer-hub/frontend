"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<boolean>
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token')
    if (savedToken) {
      setToken(savedToken)
      // Verify token with backend
      verifyToken(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async (tokenToVerify: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setToken(tokenToVerify)
        localStorage.setItem('admin_token', tokenToVerify)
        setIsLoading(false)
        return true
      } else {
        // Token is invalid, remove it
        logout()
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      logout()
      setIsLoading(false)
      return false
    }
  }

  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const newToken = data.token
        setToken(newToken)
        setIsAuthenticated(true)
        localStorage.setItem('admin_token', newToken)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem('admin_token')
  }

  const checkAuth = async (): Promise<boolean> => {
    const currentToken = token || localStorage.getItem('admin_token')
    if (!currentToken) {
      return false
    }
    return await verifyToken(currentToken)
  }

  const value = {
    isAuthenticated,
    login,
    logout,
    checkAuth,
    token,
  }

  // Don't render children until we've checked for existing auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 