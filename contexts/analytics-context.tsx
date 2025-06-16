"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"

interface AnalyticsStats {
  recentTransactions24h: number
  tps: number
  activeValidators: number
  blockHeight: number
}

interface AnalyticsContextType {
  stats: AnalyticsStats
  updateRecentTransactions24h: (value: number) => void
  updateTps: (value: number) => void
  updateActiveValidators: (value: number) => void
  updateBlockHeight: (value: number) => void
  incrementRecentTransactions24h: (increment?: number) => void
  incrementBlockHeight: (increment?: number) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

const initialStats: AnalyticsStats = {
  recentTransactions24h: 0,
  tps: 0,
  activeValidators: 99,
  blockHeight: 0,
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<AnalyticsStats>(initialStats)

  const updateRecentTransactions24h = useCallback((value: number) => {
    setStats((prev) => ({ ...prev, recentTransactions24h: value }))
  }, [])

  const updateTps = useCallback((value: number) => {
    setStats((prev) => ({ ...prev, tps: value }))
  }, [])

  const updateActiveValidators = useCallback((value: number) => {
    setStats((prev) => ({ ...prev, activeValidators: value }))
  }, [])

  const updateBlockHeight = useCallback((value: number) => {
    setStats((prev) => ({ ...prev, blockHeight: value }))
  }, [])

  const incrementRecentTransactions24h = useCallback((increment = 1) => {
    setStats((prev) => ({ ...prev, recentTransactions24h: prev.recentTransactions24h + increment }))
  }, [])

  const incrementBlockHeight = useCallback((increment = 1) => {
    setStats((prev) => ({ ...prev, blockHeight: prev.blockHeight + increment }))
  }, [])

  // No more automatic updates - TPS and block height come from WebSocket hook
  // Active validators is hardcoded to 99
  // Total transactions is blurred/hidden

  return (
    <AnalyticsContext.Provider
      value={{
        stats,
        updateRecentTransactions24h,
        updateTps,
        updateActiveValidators,
        updateBlockHeight,
        incrementRecentTransactions24h,
        incrementBlockHeight,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}
