"use client"

interface WebSocketStatusProps {
  txConnected: boolean
  txError: string | null
  networkConnected: boolean
  networkError: string | null
}

export function WebSocketStatus({ 
  txConnected, 
  txError, 
  networkConnected, 
  networkError 
}: WebSocketStatusProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs space-y-1 z-50">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${txConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span>Transactions: {txConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${networkConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span>Network Stats: {networkConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
      {(txError || networkError) && (
        <div className="text-red-400 text-xs mt-1">
          {txError || networkError}
        </div>
      )}
    </div>
  )
} 