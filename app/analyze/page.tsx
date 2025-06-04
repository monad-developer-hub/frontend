"use client"

import { Header } from "@/components/header"
import { Banner } from "@/components/banner"
import { TransactionVisualization } from "@/components/transaction-visualization"
import { TransactionLog } from "@/components/transaction-log"
import { TopContracts } from "@/components/top-contracts"
import { AnalyticsStats } from "@/components/analytics-stats"

export default function AnalyzePage() {
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
