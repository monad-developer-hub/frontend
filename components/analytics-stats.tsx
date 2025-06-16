"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedCounter } from "./animated-counter"
import { useAnalytics } from "@/contexts/analytics-context"
import { TrendingUp, Clock, Activity } from "lucide-react"

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

  const formatBlockHeight = (num: number) => {
    return `#${num.toLocaleString()}`
  }

  const statsData = [
    {
      title: "Recent Activity",
      value: stats.recentTransactions24h,
      formatter: formatNumber,
      isBlurred: false,
      animationThreshold: 1,
      icon: <Activity className="h-4 w-4 text-blue-400" />,
      description: "Live transactions"
    },
    {
      title: "TPS (Last 100 Blocks)",
      value: stats.tps,
      formatter: (value: number) => value.toLocaleString(),
      isBlurred: false,
      animationThreshold: 1,
      icon: <TrendingUp className="h-4 w-4 text-green-400" />,
      description: "Transactions per second"
    },
    {
      title: "Active Validators",
      value: stats.activeValidators,
      formatter: (value: number) => value.toString(),
      isBlurred: false,
      animationThreshold: 2,
      icon: <Clock className="h-4 w-4 text-purple-400" />,
      description: "Network validators"
    },
    {
      title: "Block Height",
      value: stats.blockHeight,
      formatter: formatBlockHeight,
      isBlurred: false,
      animationThreshold: 2,
      icon: <TrendingUp className="h-4 w-4 text-orange-400" />,
      description: "Latest block number"
    },
  ]

  return (
    <div className="mb-8">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="border-gray-800 bg-gray-950 relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-400 leading-tight">
                {stat.title}
              </CardTitle>
              <div className="shrink-0">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className={`text-lg sm:text-2xl font-bold ${stat.isBlurred ? 'blur-sm' : ''}`}>
                <AnimatedCounter
                  value={stat.value}
                  formatValue={stat.formatter}
                  animationThreshold={stat.animationThreshold}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-tight">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
