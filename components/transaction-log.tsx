"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { useTransactions } from "@/contexts/transaction-context"

export function TransactionLog() {
  const { transactions } = useTransactions()

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "transfer":
        return <Badge className="bg-blue-500 text-xs px-1 py-0">Transfer</Badge>
      case "swap":
        return <Badge className="bg-green-500 text-xs px-1 py-0">Swap</Badge>
      case "mint":
        return <Badge className="bg-purple-500 text-xs px-1 py-0">Mint</Badge>
      case "burn":
        return <Badge className="bg-red-500 text-xs px-1 py-0">Burn</Badge>
      case "stake":
        return <Badge className="bg-amber-500 text-xs px-1 py-0">Stake</Badge>
      default:
        return <Badge className="bg-gray-500 text-xs px-1 py-0">{type}</Badge>
    }
  }

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <Card className="border-gray-800 bg-gray-950 h-[500px] flex flex-col">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-950">
              <TableRow className="hover:bg-gray-950 border-gray-800">
                <TableHead className="text-xs py-2">Hash</TableHead>
                <TableHead className="text-xs py-2">Type</TableHead>
                <TableHead className="text-xs py-2 hidden sm:table-cell">From</TableHead>
                <TableHead className="text-xs py-2 hidden sm:table-cell">To</TableHead>
                <TableHead className="text-xs py-2">Value</TableHead>
                <TableHead className="text-xs py-2 text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} className="border-gray-800 hover:bg-gray-900">
                  <TableCell className="font-mono text-xs py-2">
                    {tx.hash.substring(0, 6)}...{tx.hash.substring(tx.hash.length - 6)}
                  </TableCell>
                  <TableCell className="py-2">{getTypeBadge(tx.type)}</TableCell>
                  <TableCell className="font-mono text-xs py-2 hidden sm:table-cell">
                    {truncateAddress(tx.from)}
                  </TableCell>
                  <TableCell className="font-mono text-xs py-2 hidden sm:table-cell">
                    {truncateAddress(tx.to)}
                  </TableCell>
                  <TableCell className="text-xs py-2">{tx.value.toFixed(2)} MON</TableCell>
                  <TableCell className="text-right text-xs text-gray-400 py-2">
                    {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
}
