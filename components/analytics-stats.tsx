"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedCounter } from "./animated-counter"
import { Loader2 } from "lucide-react"
import { api, handleApiError, type AnalyticsStats as StatsType } from "@/lib/api"

export function AnalyticsStats() {
  const [stats, setStats] = useState<StatsType>({
    totalTransactions: 0,
    tps: 0,
    activeValidators: 0,
    blockHeight: 0,
    timestamp: ""
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadStats()
    
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    try {
      const response = await api.getAnalyticsStats()
      setStats(response.stats)
      setError("")
    } catch (error) {
      console.error("Error loading analytics stats:", error)
      setError(handleApiError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const statsData = [
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      formatter: formatNumber,
    },
    {
      title: "TPS (Current)",
      value: stats.tps,
      formatter: (value: number) => value.toLocaleString(),
    },
    {
      title: "Active Validators",
      value: stats.activeValidators,
      formatter: (value: number) => value.toString(),
    },
    {
      title: "Block Height",
      value: stats.blockHeight,
      formatter: formatNumber,
    },
  ]

  if (error) {
    return (
      <div className="mb-6">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-center">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="border-gray-800 bg-gray-950">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-8">
                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
              </div>
            ) : (
              <AnimatedCounter
                value={stat.value}
                formatValue={stat.formatter}
                className="text-lg sm:text-2xl font-bold"
                duration={600}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
