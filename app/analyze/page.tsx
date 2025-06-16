"use client"

import { Header } from "@/components/header"
import { Banner } from "@/components/banner"
import { TransactionVisualization } from "@/components/transaction-visualization"
import { TransactionLog } from "@/components/transaction-log"
import { TopContracts } from "@/components/top-contracts"
import { AnalyticsStats } from "@/components/analytics-stats"
import { WebSocketStatus } from "@/components/websocket-status"
import { useAnalyticsWebSocket } from "@/hooks/use-analytics-websocket"
import { useNetworkStatsWebSocket } from "@/hooks/use-network-stats-websocket"
import { useTransactions } from "@/contexts/transaction-context"
import { useAnalytics } from "@/contexts/analytics-context"
import { useEffect, useRef } from "react"

export default function AnalyzePage() {
  const { addTransaction } = useTransactions()
  const { isConnected, error, subscribe, unsubscribe } = useAnalyticsWebSocket()
  const { 
    isConnected: networkStatsConnected, 
    error: networkStatsError, 
    subscribe: subscribeNetworkStats, 
    unsubscribe: unsubscribeNetworkStats 
  } = useNetworkStatsWebSocket()
  
  const { updateRecentTransactions24h, updateTps, updateBlockHeight, incrementRecentTransactions24h } = useAnalytics()

  // Track last transaction time to manage visualization smoothness
  const lastTxTimeRef = useRef<number>(Date.now())
  const pendingTxCountRef = useRef<number>(0)
  const BASE_DELAY_MS = 15 // Base delay between transactions
  const MAX_DELAY_MS = 20 // Maximum delay when many transactions are pending
  const MIN_DELAY_MS = 10 // Minimum delay when few transactions are pending
  const PENDING_TX_THRESHOLD = 10 // Number of pending transactions that triggers delay adjustment

  // Process WebSocket data when it arrives
  useEffect(() => {
    const handleWebSocketData = (data: any) => {
      if (data.type === 'new_transaction' && data.data) {
        const txData = data.data
        
        // Increment 24h transaction counter for real tracking
        incrementRecentTransactions24h(1)
        
        // Convert value from wei to MONAD (divide by 1e18)
        const valueInMonad = parseFloat(txData.value) / 1e18
        
        // Map transaction type from WebSocket to our expected types
        let transactionType: "transfer" | "swap" | "mint" | "burn" | "stake" | "other"
        switch (txData.transactionType?.toLowerCase()) {
          case "swap":
            transactionType = "swap"
            break
          case "mint":
            transactionType = "mint"
            break
          case "burn":
            transactionType = "burn"
            break
          case "stake":
            transactionType = "stake"
            break
          case "other":
            transactionType = "other"
            break
          default:
            transactionType = "transfer"
        }

        // Calculate dynamic delay based on pending transactions
        const now = Date.now()
        const timeSinceLastTx = now - lastTxTimeRef.current
        const pendingTxCount = pendingTxCountRef.current

        // Adjust delay based on number of pending transactions
        let dynamicDelay = BASE_DELAY_MS
        if (pendingTxCount > PENDING_TX_THRESHOLD) {
          // When high load (many pending transactions) -> LOWER delay
          // As pendingTxCount increases, delay decreases
          dynamicDelay = Math.max(MIN_DELAY_MS, BASE_DELAY_MS * (PENDING_TX_THRESHOLD / pendingTxCount))
        } else if (pendingTxCount < PENDING_TX_THRESHOLD / 2) {
          // When low load (few pending transactions) -> HIGHER delay
          // As pendingTxCount decreases, delay increases
          dynamicDelay = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * (PENDING_TX_THRESHOLD / pendingTxCount))
        }

        const delayNeeded = Math.max(0, dynamicDelay - timeSinceLastTx)
        lastTxTimeRef.current = now + delayNeeded

        // Increment pending transaction count
        pendingTxCountRef.current++

        // Add the transaction with delay
        setTimeout(() => {
          addTransaction(
            transactionType,
            valueInMonad,
            txData.fromAddress,
            txData.toAddress,
            txData.hash
          )
          // Decrement pending transaction count after adding
          pendingTxCountRef.current = Math.max(0, pendingTxCountRef.current - 1)
        }, delayNeeded)
      }
    }

    // Subscribe to WebSocket data
    subscribe(handleWebSocketData)

    // Cleanup: unsubscribe when component unmounts
    return () => {
      unsubscribe(handleWebSocketData)
    }
  }, [subscribe, unsubscribe, addTransaction])

  // Process Network Stats WebSocket data when it arrives
  useEffect(() => {
    const handleNetworkStatsData = (data: any) => {
      console.log('Network stats received:', data)
      
      if (data.blockNumber) {
        updateBlockHeight(data.blockNumber)
      }
      
      if (data.tps) {
        updateTps(Math.round(data.tps))
      }
    }

    // Subscribe to network stats WebSocket data
    subscribeNetworkStats(handleNetworkStatsData)

    // Cleanup: unsubscribe when component unmounts
    return () => {
      unsubscribeNetworkStats(handleNetworkStatsData)
    }
  }, [subscribeNetworkStats, unsubscribeNetworkStats, updateTps, updateBlockHeight])

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header activeTab="analyze" />
      <Banner
        title="Monad Chain Analytics"
        description="Real-time visualization and analysis of the Monad blockchain"
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <AnalyticsStats />

        <div className="space-y-6">
          <div>
            <h2 className="mb-6 text-xl sm:text-2xl font-bold">Transaction Activity</h2>
            <TransactionVisualization />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <h2 className="mb-4 text-xl sm:text-2xl font-bold">Transaction Log</h2>
              <TransactionLog />
            </div>
            <div>
              <h2 className="mb-4 text-xl sm:text-2xl font-bold">Top Contracts</h2>
              <TopContracts />
            </div>
          </div>
        </div>
      </main>
      
      <WebSocketStatus 
        txConnected={isConnected}
        txError={error}
        networkConnected={networkStatsConnected}
        networkError={networkStatsError}
      />
    </div>
  )
}
