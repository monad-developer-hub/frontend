"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"

interface Transaction {
  id: string
  hash: string
  type: "transfer" | "swap" | "mint" | "burn" | "stake"
  from: string
  to: string
  value: number
  timestamp: number
}

interface VisualizationTransaction {
  id: string
  timestamp: number
  type: "transfer" | "swap" | "mint" | "burn" | "stake"
  value: number
  x: number
  y: number
  opacity: number
  glowIntensity: number
  age: number
  createdAt: number // Add creation timestamp for cleanup
}

interface TransactionContextType {
  transactions: Transaction[]
  visualizationTransactions: VisualizationTransaction[]
  addTransaction: (type: Transaction["type"], value: number, from?: string, to?: string) => void
  setVisualizationDimensions: (width: number, height: number) => void
  updateVisualizationTransactions: (updater: (prev: VisualizationTransaction[]) => VisualizationTransaction[]) => void
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

const MAX_TRANSACTIONS = 15 // Limit transaction log to 15 items
const DOT_LIFETIME_MS = 1500 // 1.5 seconds in milliseconds

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [visualizationTransactions, setVisualizationTransactions] = useState<VisualizationTransaction[]>([])
  const [dimensions, setDimensions] = useState({ width: 800, height: 300 })
  const intervalRef = useRef<NodeJS.Timeout>()
  const cleanupIntervalRef = useRef<NodeJS.Timeout>()
  const addTransactionRef = useRef<typeof addTransaction>()

  const setVisualizationDimensions = useCallback((width: number, height: number) => {
    setDimensions({ width, height })
  }, [])

  const updateVisualizationTransactions = useCallback(
    (updater: (prev: VisualizationTransaction[]) => VisualizationTransaction[]) => {
      setVisualizationTransactions(updater)
    },
    [],
  )

  // Cleanup old transactions based on timestamp (works even when tab is not visible)
  const cleanupOldTransactions = useCallback(() => {
    const now = Date.now()
    setVisualizationTransactions((prev) => prev.filter((tx) => now - tx.createdAt < DOT_LIFETIME_MS))
  }, [])

  const addTransaction = useCallback(
    (type: Transaction["type"], value: number, from?: string, to?: string) => {
      const now = Date.now()
      const hash = Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")
      const fromAddress =
        from || `0x${Array.from({ length: 40 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}`
      const toAddress =
        to || `0x${Array.from({ length: 40 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}`

      // Create transaction for log
      const logTransaction: Transaction = {
        id: `tx-${Math.random().toString(36).substring(2, 10)}`,
        hash,
        type,
        from: fromAddress,
        to: toAddress,
        value,
        timestamp: now,
      }

      // Safe positioning with proper margins for dot radius (6px) plus glow (15px) = 21px margin
      const margin = 25 // Extra margin for safety
      const safeWidth = Math.max(100, dimensions.width - margin * 2)
      const safeHeight = Math.max(100, dimensions.height - margin * 2)

      const x = Math.random() * safeWidth + margin
      const y = Math.random() * safeHeight + margin

      const vizTransaction: VisualizationTransaction = {
        id: `viz-${Math.random().toString(36).substring(2, 10)}`,
        timestamp: now,
        type,
        value,
        x,
        y,
        opacity: 0,
        glowIntensity: 0,
        age: 0,
        createdAt: now, // Store creation time for cleanup
      }

      // Add to transaction log with limit
      setTransactions((prev) => {
        const newTransactions = [logTransaction, ...prev]
        return newTransactions.slice(0, MAX_TRANSACTIONS)
      })

      // Add to visualization
      setVisualizationTransactions((prev) => [...prev, vizTransaction])
    },
    [dimensions.width, dimensions.height],
  )

  // Store the latest addTransaction function in a ref
  useEffect(() => {
    addTransactionRef.current = addTransaction
  }, [addTransaction])

  // Auto-generate transactions for simulation
  useEffect(() => {
    const types: Transaction["type"][] = ["transfer", "swap", "mint", "burn", "stake"]

    const generateTransaction = () => {
      if (!addTransactionRef.current) return

      const randomType = types[Math.floor(Math.random() * types.length)]
      const randomValue = Math.random() * 1000 + 10
      addTransactionRef.current(randomType, randomValue)
    }

    // Generate initial transactions
    for (let i = 0; i < 5; i++) {
      setTimeout(() => generateTransaction(), i * 200)
    }

    // Set up interval for ongoing transactions
    intervalRef.current = setInterval(generateTransaction, 800)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Set up cleanup interval that works regardless of tab visibility
  useEffect(() => {
    cleanupIntervalRef.current = setInterval(cleanupOldTransactions, 100) // Clean up every 100ms

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current)
      }
    }
  }, [cleanupOldTransactions])

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        visualizationTransactions,
        addTransaction,
        setVisualizationDimensions,
        updateVisualizationTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider")
  }
  return context
}
