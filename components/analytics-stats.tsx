"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedCounter } from "./animated-counter"
import { useAnalytics } from "@/contexts/analytics-context"

export function AnalyticsStats() {
  const { stats } = useAnalytics()

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

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="border-gray-800 bg-gray-950">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <AnimatedCounter
              value={stat.value}
              formatValue={stat.formatter}
              className="text-lg sm:text-2xl font-bold"
              duration={600}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
