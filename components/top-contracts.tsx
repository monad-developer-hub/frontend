"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Activity, Users, Crown, Trophy, Medal, RefreshCw, Construction } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ContractData {
  id: string
  name: string
  logo: string
  address: string
  category: string
  txCount: number
  uniqueWallets: number
  change24h: number
  gasUsed: number
  lastUpdated: number
}

// Generate contract data based on our projects
const generateContractData = (): ContractData[] => {
  const projects = [
    { name: "MonadSwap", logo: "/placeholder.svg?height=40&width=40", category: "DeFi" },
    { name: "MonadNFT", logo: "/placeholder.svg?height=40&width=40", category: "NFT" },
    { name: "MonadAI", logo: "/placeholder.svg?height=40&width=40", category: "AI" },
    { name: "MonadGame", logo: "/placeholder.svg?height=40&width=40", category: "Gaming" },
    { name: "MonadDAO", logo: "/placeholder.svg?height=40&width=40", category: "Infrastructure" },
    { name: "MonadBridge", logo: "/placeholder.svg?height=40&width=40", category: "Infrastructure" },
    { name: "MonadLend", logo: "/placeholder.svg?height=40&width=40", category: "DeFi" },
    { name: "MonadPay", logo: "/placeholder.svg?height=40&width=40", category: "Consumer" },
    { name: "MonadVault", logo: "/placeholder.svg?height=40&width=40", category: "Infrastructure" },
    { name: "MonadStats", logo: "/placeholder.svg?height=40&width=40", category: "Infrastructure" },
  ]

  const now = Date.now()

  return projects
    .map((project, index) => {
      const address = `0x${Array.from({ length: 40 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}`

      return {
        id: `contract-${index}`,
        name: project.name,
        logo: project.logo,
        address,
        category: project.category,
        txCount: Math.floor(Math.random() * 10000) + 1000,
        uniqueWallets: Math.floor(Math.random() * 5000) + 500,
        change24h: (Math.random() - 0.5) * 50, // -25% to +25%
        gasUsed: Math.floor(Math.random() * 50000000) + 10000000,
        lastUpdated: now - Math.floor(Math.random() * 300000), // Random time within last 5 minutes
      }
    })
    .sort((a, b) => b.txCount - a.txCount) // Sort by transaction count
}

export function TopContracts() {
  const [contracts, setContracts] = useState<ContractData[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setContracts(generateContractData())
      setIsRefreshing(false)
    }, 500) // Small delay to show loading state
  }

  useEffect(() => {
    setContracts(generateContractData())

    // Update data every 30 seconds
    const interval = setInterval(() => {
      setContracts(generateContractData())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const getRankNumberStyle = (index: number) => {
    switch (index) {
      case 0: // 1st place
        return {
          background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)", // Gold gradient
          icon: <Crown className="h-3 w-3 text-yellow-800" />,
          textColor: "text-yellow-900",
        }
      case 1: // 2nd place
        return {
          background: "linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)", // Silver gradient
          icon: <Trophy className="h-3 w-3 text-gray-700" />,
          textColor: "text-gray-800",
        }
      case 2: // 3rd place
        return {
          background: "linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)", // Bronze gradient
          icon: <Medal className="h-3 w-3 text-orange-800" />,
          textColor: "text-orange-900",
        }
      case 3: // 4th place
        return {
          background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)", // Purple gradient
          icon: null,
          textColor: "text-purple-100",
        }
      default: // 5th-10th place
        return {
          background: "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)", // Gray gradient
          icon: null,
          textColor: "text-gray-100",
        }
    }
  }

  return (
    <Card className="border-gray-800 bg-gray-950 h-[500px] flex flex-col relative overflow-hidden">
      {/* Under Development Overlay */}
      <div className="absolute top-3 right-3 z-20">
        <Badge variant="outline" className="bg-orange-500/20 border-orange-500 text-orange-400 text-[10px] px-1.5 py-0.5 flex items-center gap-1">
          <Construction className="h-2.5 w-2.5" />
          Under Development
        </Badge>
      </div>

      {/* Blurred Content */}
      <div className="blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-4 w-4" />
              Most Active Contracts (24h)
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={refreshData}
              disabled={isRefreshing}
              className="h-8 w-8 text-gray-400 hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh data</span>
            </Button>
          </div>
          {contracts.length > 0 && (
            <p className="text-xs text-gray-400">
              Last updated: {formatDistanceToNow(contracts[0].lastUpdated, { addSuffix: true })}
            </p>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-2 px-4 pb-4">
          {contracts.slice(0, 10).map((contract, index) => {
            const rankStyle = getRankNumberStyle(index)

            return (
              <div
                key={contract.id}
                className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-900 p-2 transition-colors hover:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${rankStyle.textColor}`}
                    style={{
                      background: rankStyle.background,
                    }}
                  >
                    {rankStyle.icon || index + 1}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contract.logo || "/placeholder.svg"} alt={contract.name} />
                    <AvatarFallback className="text-xs">{contract.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex flex-wrap items-center gap-1">
                      <h4 className="text-sm font-medium text-white">{contract.name}</h4>
                      <Badge variant="outline" className="text-xs px-1 py-0 hidden sm:inline-flex">
                        {contract.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 font-mono hidden sm:block">{truncateAddress(contract.address)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs">
                      <Activity className="h-3 w-3" />
                      <span className="font-medium">{formatNumber(contract.txCount)}</span>
                    </div>
                    <p className="text-xs text-gray-400">txs</p>
                  </div>

                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-1 text-xs">
                      <Users className="h-3 w-3" />
                      <span className="font-medium">{formatNumber(contract.uniqueWallets)}</span>
                    </div>
                    <p className="text-xs text-gray-400">wallets</p>
                  </div>

                  <div className="text-right">
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        contract.change24h >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {contract.change24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="font-medium">{Math.abs(contract.change24h).toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-gray-400">24h</p>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </div>
    </Card>
  )
}
