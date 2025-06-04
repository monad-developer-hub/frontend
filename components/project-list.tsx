"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, Github, Heart, PlayCircle, Twitter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const projects = [
  {
    id: 1,
    name: "MonadSwap",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Decentralized exchange built on Monad with lightning-fast transactions and minimal slippage.",
    categories: ["DeFi", "Infrastructure"],
    team: [
      { name: "Alex", image: "/placeholder.svg?height=40&width=40", twitter: "alex_dev" },
      { name: "Sarah", image: "/placeholder.svg?height=40&width=40", twitter: "sarah_blockchain" },
      { name: "Mike", image: "/placeholder.svg?height=40&width=40", twitter: "mike_monad" },
    ],
    likes: 145,
    comments: 32,
    howToPlay:
      "Connect your wallet, select tokens to swap, set slippage tolerance, and execute your trade. MonadSwap offers the best rates with minimal gas fees.",
    playUrl: "https://monadswap.example.com",
    github: "https://github.com/monadswap",
    website: "https://monadswap.example.com",
  },
  {
    id: 2,
    name: "MonadNFT",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Create, buy, and sell NFTs with zero gas fees. Featuring a marketplace with advanced search and filtering.",
    categories: ["NFT", "Consumer"],
    team: [
      { name: "Jessica", image: "/placeholder.svg?height=40&width=40", twitter: "jessica_nft" },
      { name: "David", image: "/placeholder.svg?height=40&width=40", twitter: "david_artist" },
    ],
    likes: 98,
    comments: 17,
    howToPlay:
      "Browse the marketplace, connect your wallet, and purchase NFTs with one click. Artists can mint NFTs directly on the platform with customizable royalties.",
    playUrl: "https://monadnft.example.com",
    github: "https://github.com/monadnft",
    website: "https://monadnft.example.com",
  },
  {
    id: 3,
    name: "MonadAI",
    logo: "/placeholder.svg?height=60&width=60",
    description: "On-chain AI inference engine that enables smart contracts to leverage machine learning models.",
    categories: ["AI", "Infrastructure"],
    team: [
      { name: "Robert", image: "/placeholder.svg?height=40&width=40", twitter: "robert_ai" },
      { name: "Emma", image: "/placeholder.svg?height=40&width=40", twitter: "emma_ml" },
      { name: "John", image: "/placeholder.svg?height=40&width=40", twitter: "john_blockchain" },
      { name: "Lisa", image: "/placeholder.svg?height=40&width=40", twitter: "lisa_dev" },
    ],
    likes: 203,
    comments: 45,
    howToPlay:
      "Integrate the MonadAI SDK into your dApp to access on-chain AI capabilities. Deploy your own models or use pre-trained ones from the marketplace.",
    playUrl: "https://monadai.example.com",
    github: "https://github.com/monadai",
    website: "https://monadai.example.com",
  },
  {
    id: 4,
    name: "MonadGame",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Fully on-chain gaming platform with true ownership of in-game assets and play-to-earn mechanics.",
    categories: ["Gaming", "Consumer"],
    team: [
      { name: "Chris", image: "/placeholder.svg?height=40&width=40", twitter: "chris_game" },
      { name: "Olivia", image: "/placeholder.svg?height=40&width=40", twitter: "olivia_designer" },
    ],
    likes: 167,
    comments: 29,
    howToPlay:
      "Create an account, customize your character, and jump into various game modes. Earn tokens by completing quests and competing in tournaments.",
    playUrl: "https://monadgame.example.com",
    github: "https://github.com/monadgame",
    website: "https://monadgame.example.com",
  },
]

export function ProjectList() {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden border-gray-800 bg-gray-950">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-800">
              <img src={project.logo || "/placeholder.svg"} alt={project.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{project.name}</h3>
              <div className="flex flex-wrap gap-2">
                {project.categories.map((category) => (
                  <Badge key={category} variant="outline" className="border-purple-500 text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <CardDescription className="mb-4 text-gray-400">{project.description}</CardDescription>
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-gray-400">Team</h4>
              <div className="flex -space-x-2">
                {project.team.map((member, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`https://twitter.com/${member.twitter}`}
                          target="_blank"
                          className="block transition-transform hover:scale-105"
                        >
                          <Avatar className="h-8 w-8 border-2 border-gray-950">
                            <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{member.name}</p>
                        <p className="text-xs text-gray-400">@{member.twitter}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {project.team.length > 3 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-950 bg-gray-800 text-xs">
                    +{project.team.length - 3}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-gray-800 pt-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-1 text-gray-400 hover:text-white">
                  <Heart className="h-4 w-4" />
                  <span>{project.likes}</span>
                </Button>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <span className="i-lucide-message-square h-4 w-4"></span>
                  <span>{project.comments}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {project.github && (
                  <Link href={project.github} target="_blank">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                      <Github className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                {project.website && (
                  <Link href={project.website} target="_blank">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link href={`https://twitter.com/search?q=${project.name}`} target="_blank">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex w-full gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1">
                    How to Play
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-gray-800 bg-gray-950 sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>How to Play {project.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-gray-400">{project.howToPlay}</p>
                  </div>
                </DialogContent>
              </Dialog>
              <Button asChild className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700">
                <Link href={project.playUrl} target="_blank">
                  <PlayCircle className="h-4 w-4" />
                  Play
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
