"use client"

import { Header } from "@/components/header"
import { Banner } from "@/components/banner"
import { TransactionVisualization } from "@/components/transaction-visualization"
import { TransactionLog } from "@/components/transaction-log"
import { TopContracts } from "@/components/top-contracts"
import { AnalyticsStats } from "@/components/analytics-stats"
import { useAnalyticsWebSocket } from "@/hooks/use-analytics-websocket"
import { useTransactions } from "@/contexts/transaction-context"
import { useEffect } from "react"

export default function AnalyzePage() {
  const { isConnected, error, subscribe, unsubscribe } = useAnalyticsWebSocket()
  const { addTransaction } = useTransactions()

  // Process WebSocket data when it arrives
  useEffect(() => {
    const handleWebSocketData = (data: any) => {
      if (data && data.type === "new_transaction" && data.data) {
        const txData = data.data
        
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

        // Add the transaction to our context
        addTransaction(
          transactionType,
          valueInMonad,
          txData.fromAddress,
          txData.toAddress,
          txData.hash
        )

        console.log(`🎯 Added real transaction: ${txData.hash.substring(0, 10)}... (${transactionType}) - Value: ${valueInMonad.toFixed(4)} MONAD`)
      }
    }

    // Subscribe to WebSocket data
    subscribe(handleWebSocketData)

    // Cleanup: unsubscribe when component unmounts
    return () => {
      unsubscribe(handleWebSocketData)
    }
  }, [subscribe, unsubscribe, addTransaction])

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header activeTab="analyze" />
      <Banner
        title="Monad Chain Analytics"
        description="Real-time visualization and analysis of the Monad blockchain"
      />

      <main className="container mx-auto px-4 py-6">
        <AnalyticsStats />

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-bold">Transaction Activity</h2>
          <TransactionVisualization />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold">Transaction Log</h2>
            <TransactionLog />
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-bold">Top Contracts</h2>
            <TopContracts />
          </div>
        </div>
      </main>
    </div>
  )
}
