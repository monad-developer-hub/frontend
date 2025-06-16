"use client"

import { useEffect, useState, useRef } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  formatValue?: (value: number) => string
  className?: string
  animationThreshold?: number
}

export function AnimatedCounter({ value, duration = 400, formatValue, className = "", animationThreshold = 2 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)
  const prevValueRef = useRef(value)
  const animationRef = useRef<number>()

  useEffect(() => {
    // Skip animation on first render
    if (prevValueRef.current === value) return

    // Only animate if the difference is significant
    const difference = value - prevValueRef.current
    if (Math.abs(difference) < animationThreshold) {
      setDisplayValue(value)
      prevValueRef.current = value
      return
    }

    setIsAnimating(true)
    const startValue = prevValueRef.current
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)

      const currentValue = Math.round(startValue + difference * easeOutCubic)
      setDisplayValue(currentValue)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
        setIsAnimating(false)
        prevValueRef.current = value
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration, animationThreshold])

  const formattedValue = formatValue ? formatValue(displayValue) : displayValue.toLocaleString()

  return (
    <span
      className={`transition-all duration-200 ${isAnimating ? "text-purple-400 scale-105" : ""} ${className}`}
      style={{
        textShadow: isAnimating ? "0 0 10px rgba(139, 92, 246, 0.5)" : "none",
      }}
    >
      {formattedValue}
    </span>
  )
}
