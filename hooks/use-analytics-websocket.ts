"use client"

import { useEffect, useRef, useState } from 'react'

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081'

interface UseAnalyticsWebSocketReturn {
  isConnected: boolean
  error: string | null
  subscribe: (callback: (data: any) => void) => void
  unsubscribe: (callback: (data: any) => void) => void
}

export function useAnalyticsWebSocket(): UseAnalyticsWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const hasConnected = useRef(false)
  const callbacksRef = useRef<Set<(data: any) => void>>(new Set())

  const subscribe = (callback: (data: any) => void) => {
    callbacksRef.current.add(callback)
  }

  const unsubscribe = (callback: (data: any) => void) => {
    callbacksRef.current.delete(callback)
  }

  useEffect(() => {
    // Only connect once and prevent multiple connections
    if (hasConnected.current || wsRef.current) return

    const connectWebSocket = () => {
      try {
        console.log('Attempting to connect to analytics WebSocket...')
        const ws = new WebSocket(`${WS_BASE_URL}/ws/analytics`)
        wsRef.current = ws
        hasConnected.current = true

        ws.onopen = () => {
          console.log('Connected to analytics WebSocket')
          setIsConnected(true)
          setError(null)
          
          // Subscribe to new_transaction events
          const subscriptionMessage = {
            type: "subscribe",
            topic: "new_transaction"
          }
          ws.send(JSON.stringify(subscriptionMessage))
          console.log('Subscribed to new_transaction events')
        }

        ws.onmessage = (event) => {
          console.log('Received data from analytics WebSocket:', event.data)
          try {
            const parsedData = JSON.parse(event.data)
            // Call all registered callbacks immediately
            callbacksRef.current.forEach(callback => {
              try {
                callback(parsedData)
              } catch (err) {
                console.error('Error in WebSocket callback:', err)
              }
            })
          } catch (err) {
            console.error('Error parsing WebSocket data:', err)
          }
        }

        ws.onclose = (event) => {
          console.log('Analytics WebSocket connection closed:', event.code, event.reason)
          setIsConnected(false)
          wsRef.current = null
        }

        ws.onerror = (err) => {
          console.error('Analytics WebSocket error:', err)
          setError('WebSocket connection failed')
          setIsConnected(false)
          wsRef.current = null
        }
      } catch (err) {
        console.error('Failed to create WebSocket connection:', err)
        setError('Failed to create WebSocket connection')
        hasConnected.current = false
      }
    }

    // Small delay to ensure component is fully mounted
    const timer = setTimeout(connectWebSocket, 100)

    // Cleanup function
    return () => {
      clearTimeout(timer)
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
      wsRef.current = null
    }
  }, [])

  return { isConnected, error, subscribe, unsubscribe }
} 