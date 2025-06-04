"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"

interface AnalyticsStats {
  totalTransactions: number
  tps: number
  activeValidators: number
  blockHeight: number
}

interface AnalyticsContextType {
  stats: AnalyticsStats
  updateTotalTransactions: (value: number) => void
  updateTps: (value: number) => void
  updateActiveValidators: (value: number) => void
  updateBlockHeight: (value: number) => void
  incrementTotalTransactions: (increment?: number) => void
  incrementBlockHeight: (increment?: number) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

const initialStats: AnalyticsStats = {
  totalTransactions: 1245678,
  tps: 2450,
  activeValidators: 128,
  blockHeight: 3456789,
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<AnalyticsStats>(initialStats)
  const intervalRef = useRef<NodeJS.Timeout>()
  const fastUpdateRef = useRef<NodeJS.Timeout>()

  const updateTotalTransactions = useCallback((value: number) => {
    setStats((prev) => ({ ...prev, totalTransactions: value }))
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

  const incrementTotalTransactions = useCallback((increment = 1) => {
    setStats((prev) => ({ ...prev, totalTransactions: prev.totalTransactions + increment }))
  }, [])

  const incrementBlockHeight = useCallback((increment = 1) => {
    setStats((prev) => ({ ...prev, blockHeight: prev.blockHeight + increment }))
  }, [])

  // Fast updates for TPS and transactions
  useEffect(() => {
    fastUpdateRef.current = setInterval(() => {
      setStats((prev) => {
        // Simulate TPS fluctuation (1500-3500)
        const newTps = Math.floor(Math.random() * 2000) + 1500

        // Increment transactions by TPS amount (scaled for update frequency)
        const txIncrement = Math.floor(newTps / 4) // Adjusted for 500ms interval

        return {
          ...prev,
          tps: newTps,
          totalTransactions: prev.totalTransactions + txIncrement,
        }
      })
    }, 500) // Update TPS and transactions every 500ms

    return () => {
      if (fastUpdateRef.current) {
        clearInterval(fastUpdateRef.current)
      }
    }
  }, [])

  // Slower updates for validators and block height
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStats((prev) => {
        // Simulate validator changes occasionally (120-135)
        const validatorChange = Math.random() < 0.1 ? (Math.random() < 0.5 ? -1 : 1) : 0
        const newValidators = Math.max(120, Math.min(135, prev.activeValidators + validatorChange))

        // Increment block height (new block every ~1 second)
        const blockIncrement = Math.random() < 0.7 ? 1 : 0

        return {
          ...prev,
          activeValidators: newValidators,
          blockHeight: prev.blockHeight + blockIncrement,
        }
      })
    }, 1000) // Update validators and blocks every 1 second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <AnalyticsContext.Provider
      value={{
        stats,
        updateTotalTransactions,
        updateTps,
        updateActiveValidators,
        updateBlockHeight,
        incrementTotalTransactions,
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
