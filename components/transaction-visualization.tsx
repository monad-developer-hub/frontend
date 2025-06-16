"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { useTransactions } from "@/contexts/transaction-context"

export function TransactionVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const lastUpdateTimeRef = useRef<number>(0)
  const { visualizationTransactions, setVisualizationDimensions, updateVisualizationTransactions } = useTransactions()

  // Handle resize and set dimensions
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const width = containerRect.width
        const height = containerRect.height
        const dpr = window.devicePixelRatio || 1

        canvasRef.current.width = width * dpr
        canvasRef.current.height = height * dpr
        canvasRef.current.style.width = width + "px"
        canvasRef.current.style.height = height + "px"

        const ctx = canvasRef.current.getContext("2d")
        if (ctx) {
          ctx.scale(dpr, dpr)
        }

        setVisualizationDimensions(width, height)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [setVisualizationDimensions])

  // Animation loop with timestamp-based aging
  useEffect(() => {
    const updateRate = 1000 / 60 // Target 60 FPS

    const animate = (timestamp: number) => {
      // Only update at the target frame rate
      if (timestamp - lastUpdateTimeRef.current >= updateRate) {
        lastUpdateTimeRef.current = timestamp

        const now = Date.now()

        updateVisualizationTransactions((prev) =>
          prev
            .map((tx) => {
              // Calculate age based on actual time elapsed, not frame count
              const ageMs = now - tx.createdAt
              const progress = Math.min(ageMs / 1500, 1) // 1.5 seconds total lifetime

              let newOpacity = tx.opacity
              let newGlowIntensity = tx.glowIntensity

              if (progress <= 1) {
                // Fade in phase (first 20% of lifecycle)
                if (progress <= 0.2) {
                  const fadeInProgress = progress / 0.2
                  newOpacity = fadeInProgress
                  newGlowIntensity = fadeInProgress * 0.8
                }
                // Full visibility phase (20% to 60% of lifecycle)
                else if (progress <= 0.6) {
                  newOpacity = 1
                  // Pulse effect during full visibility
                  const pulseProgress = Math.sin((progress - 0.2) * Math.PI * 4)
                  newGlowIntensity = 0.6 + pulseProgress * 0.4
                }
                // Fade out phase (60% to 100% of lifecycle)
                else {
                  const fadeOutProgress = (progress - 0.6) / 0.4
                  newOpacity = 1 - fadeOutProgress
                  newGlowIntensity = (1 - fadeOutProgress) * 0.8
                }
              }

              return {
                ...tx,
                opacity: newOpacity,
                glowIntensity: newGlowIntensity,
                age: Math.floor(progress * 90), // Convert to frame-like age for compatibility
              }
            })
            .filter((tx) => {
              const ageMs = now - tx.createdAt
              return ageMs < 1500 // Remove after 1.5 seconds
            }),
        )
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [updateVisualizationTransactions])

  // Handle visibility change to clean up when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became visible, clean up any old transactions immediately
        const now = Date.now()
        updateVisualizationTransactions((prev) => prev.filter((tx) => now - tx.createdAt < 1500))
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [updateVisualizationTransactions])

  // Draw visualization
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const width = containerRect.width
    const height = containerRect.height

    ctx.clearRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
    ctx.lineWidth = 1

    for (let y = 0; y < height; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    for (let x = 0; x < width; x += 80) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Draw transactions
    visualizationTransactions.forEach((tx) => {
      if (tx.opacity <= 0) return

      if (tx.x < 0 || tx.x > width || tx.y < 0 || tx.y > height) return

      let color
      switch (tx.type) {
        case "transfer":
          color = "#3b82f6"
          break
        case "swap":
          color = "#10b981"
          break
        case "mint":
          color = "#8b5cf6"
          break
        case "burn":
          color = "#ef4444"
          break
        case "stake":
          color = "#f59e0b"
          break
        default:
          color = "#6b7280"
      }

      const radius = 6

      ctx.save()

      if (tx.glowIntensity > 0) {
        ctx.globalAlpha = tx.opacity * tx.glowIntensity
        const glowRadius = radius + 15 * tx.glowIntensity

        const glowOpacity = Math.floor(tx.glowIntensity * 80)
          .toString(16)
          .padStart(2, "0")

        ctx.shadowBlur = 20 * tx.glowIntensity
        ctx.shadowColor = color
        ctx.beginPath()
        ctx.arc(tx.x, tx.y, glowRadius, 0, Math.PI * 2)
        ctx.fillStyle = color + glowOpacity
        ctx.fill()

        ctx.shadowBlur = 0
        ctx.shadowColor = "transparent"
      }

      ctx.globalAlpha = tx.opacity
      ctx.beginPath()
      ctx.arc(tx.x, tx.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()

      if (tx.opacity > 0.3) {
        ctx.beginPath()
        ctx.arc(tx.x - radius * 0.3, tx.y - radius * 0.3, radius * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * tx.opacity})`
        ctx.fill()
      }

      ctx.restore()
    })
  }, [visualizationTransactions])

  return (
    <Card className="border-gray-800 bg-gray-950 p-4">
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium">Live Transaction Activity</h3>
            <p className="text-sm text-gray-400">Real-time visualization of transactions on the Monad blockchain</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-400">Transfer</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-400">Swap</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-purple-500"></div>
              <span className="text-xs text-gray-400">Mint</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-400">Burn</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-gray-400">Stake</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-gray-500"></div>
              <span className="text-xs text-gray-400">Other</span>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative h-[250px] sm:h-[300px] w-full overflow-hidden rounded-lg border border-gray-800"
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </div>
    </Card>
  )
}
