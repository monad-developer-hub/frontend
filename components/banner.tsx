"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Share2 } from "lucide-react"

interface BannerProps {
  title: string
  description: string
}

export function Banner({ title, description }: BannerProps) {
  const handleShare = async () => {
    const url = window.location.href
    const text = `Check out the ${title}! ${description}`

    // Try to use Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        })
        return
      } catch (err) {
        // Fall back to Twitter if share is cancelled or fails
      }
    }

    // Fallback to Twitter share
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, "_blank", "width=550,height=420")
  }

  return (
    <div className="relative overflow-hidden border-b border-gray-800 bg-black py-6">
      {/* Wavy line pattern background */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wave" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path
                d="M0,100 C40,80 60,120 100,100 C140,80 160,120 200,100 L200,200 L0,200 Z"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
              />
              <path d="M0,50 C40,30 60,70 100,50 C140,30 160,70 200,50" fill="none" stroke="white" strokeWidth="1.5" />
              <path
                d="M0,150 C40,130 60,170 100,150 C140,130 160,170 200,150"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave)" />
        </svg>
      </div>

      <div className="container relative mx-auto flex flex-col sm:flex-row items-center justify-between px-4 gap-4">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="mb-2 text-2xl sm:text-3xl font-bold">{title}</h1>
          <p className="text-gray-400">{description}</p>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-white bg-transparent text-white hover:bg-white/10"
            asChild
          >
            <a href="https://monad.xyz" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              MONAD
            </a>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 border-white bg-transparent text-white hover:bg-white/10"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            SHARE
          </Button>
        </div>
      </div>
    </div>
  )
}
