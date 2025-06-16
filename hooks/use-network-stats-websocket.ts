"use client"

import { useEffect, useRef, useState } from 'react'

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081'

interface NetworkStatsData {
  blockNumber: number
  tps: number
  gasPrice: string
  timestamp?: string
}

interface UseNetworkStatsWebSocketReturn {
  isConnected: boolean
  error: string | null
  latestStats: NetworkStatsData | null
  subscribe: (callback: (data: NetworkStatsData) => void) => void
  unsubscribe: (callback: (data: NetworkStatsData) => void) => void
}

export function useNetworkStatsWebSocket(): UseNetworkStatsWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [latestStats, setLatestStats] = useState<NetworkStatsData | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const hasConnected = useRef(false)
  const callbacksRef = useRef<Set<(data: NetworkStatsData) => void>>(new Set())

  const subscribe = (callback: (data: NetworkStatsData) => void) => {
    callbacksRef.current.add(callback)
  }

  const unsubscribe = (callback: (data: NetworkStatsData) => void) => {
    callbacksRef.current.delete(callback)
  }

  useEffect(() => {
    // Only connect once and prevent multiple connections
    if (hasConnected.current || wsRef.current) return

    const connectWebSocket = () => {
      try {
        console.log('Attempting to connect to network stats WebSocket...')
        const ws = new WebSocket(`${WS_BASE_URL}/ws/analytics`)
        wsRef.current = ws
        hasConnected.current = true

        ws.onopen = () => {
          console.log('Connected to network stats WebSocket')
          setIsConnected(true)
          setError(null)
          
          // Subscribe to network_stats events
          const subscriptionMessage = {
            type: "subscribe",
            topic: "network_stats"
          }
          ws.send(JSON.stringify(subscriptionMessage))
          console.log('Subscribed to network_stats events')
        }

        ws.onmessage = (event) => {
          console.log('Received network stats data:', event.data)
          try {
            const parsedData = JSON.parse(event.data)
            
            // Handle network_stats messages
            if (parsedData.type === 'network_stats' && parsedData.data) {
              const statsData: NetworkStatsData = {
                blockNumber: parsedData.data.blockNumber,
                tps: parsedData.data.tps,
                gasPrice: parsedData.data.gasPrice,
                timestamp: parsedData.data.timestamp || new Date().toISOString()
              }
              
              setLatestStats(statsData)
              
              // Call all registered callbacks
              callbacksRef.current.forEach(callback => {
                try {
                  callback(statsData)
                } catch (err) {
                  console.error('Error in network stats WebSocket callback:', err)
                }
              })
            }
          } catch (err) {
            console.error('Error parsing network stats WebSocket data:', err)
          }
        }

        ws.onclose = (event) => {
          console.log('Network stats WebSocket connection closed:', event.code, event.reason)
          setIsConnected(false)
          wsRef.current = null
        }

        ws.onerror = (err) => {
          console.error('Network stats WebSocket error:', err)
          setError('Network stats WebSocket connection failed')
          setIsConnected(false)
          wsRef.current = null
        }
      } catch (err) {
        console.error('Failed to create network stats WebSocket connection:', err)
        setError('Failed to create network stats WebSocket connection')
        hasConnected.current = false
      }
    }

    // Small delay to ensure component is fully mounted
    const timer = setTimeout(connectWebSocket, 200)

    // Cleanup function
    return () => {
      clearTimeout(timer)
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
      wsRef.current = null
    }
  }, [])

  return { isConnected, error, latestStats, subscribe, unsubscribe }
} 