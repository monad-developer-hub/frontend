"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Crown,
  ExternalLink,
  Github,
  Heart,
  Info,
  MessageSquare,
  PlayCircle,
  Trophy,
  Twitter,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api, handleApiError, type Project, type ProjectsResponse } from "@/lib/api"

const projects = [
  {
    id: 1,
    name: "MonadSwap",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Decentralized exchange built on Monad with lightning-fast transactions and minimal slippage.",
    categories: ["DeFi", "Infrastructure"],
    event: "Mission: 1 Crazy Contract",
    award: "Winner",
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
    logo: "/placeholder.svg?height=40&width=40",
    description:
      "Create, buy, and sell NFTs with zero gas fees. Featuring a marketplace with advanced search and filtering.",
    categories: ["NFT", "Consumer"],
    event: "Mission: 2 Smart Wallet",
    award: "Runner-up",
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
    logo: "/placeholder.svg?height=40&width=40",
    description: "On-chain AI inference engine that enables smart contracts to leverage machine learning models.",
    categories: ["AI", "Infrastructure"],
    event: "Mission: 3 DeFi Integration",
    award: "Winner",
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
    logo: "/placeholder.svg?height=40&width=40",
    description: "Fully on-chain gaming platform with true ownership of in-game assets and play-to-earn mechanics.",
    categories: ["Gaming", "Consumer"],
    event: "Mission: 4 NFT Marketplace",
    award: "Finalist",
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
  {
    id: 5,
    name: "MonadDAO",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Governance platform for Monad ecosystem projects with proposal creation and voting mechanisms.",
    categories: ["Infrastructure", "DeFi"],
    event: "Hackathon",
    award: "Winner",
    team: [
      { name: "James", image: "/placeholder.svg?height=40&width=40", twitter: "james_dao" },
      { name: "Elena", image: "/placeholder.svg?height=40&width=40", twitter: "elena_gov" },
    ],
    likes: 132,
    comments: 41,
    howToPlay:
      "Stake MONAD tokens to participate in governance. Create proposals, vote on existing ones, and help shape the future of the ecosystem.",
    playUrl: "https://monaddao.example.com",
    github: "https://github.com/monaddao",
    website: "https://monaddao.example.com",
  },
  {
    id: 6,
    name: "MonadBridge",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Cross-chain bridge for seamless asset transfers between Monad and other blockchains.",
    categories: ["Infrastructure", "DeFi"],
    event: "Mission: 1 Crazy Contract",
    award: "Honorable Mention",
    team: [
      { name: "Thomas", image: "/placeholder.svg?height=40&width=40", twitter: "thomas_bridge" },
      { name: "Sophia", image: "/placeholder.svg?height=40&width=40", twitter: "sophia_dev" },
    ],
    likes: 87,
    comments: 23,
    howToPlay:
      "Select the source and destination chains, connect your wallets, and transfer assets with minimal fees and fast confirmation times.",
    playUrl: "https://monadbridge.example.com",
    github: "https://github.com/monadbridge",
    website: "https://monadbridge.example.com",
  },
  {
    id: 7,
    name: "MonadLend",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Lending and borrowing protocol with dynamic interest rates and multi-collateral support.",
    categories: ["DeFi"],
    event: "Hackathon",
    award: "Winner",
    team: [
      { name: "Daniel", image: "/placeholder.svg?height=40&width=40", twitter: "daniel_defi" },
      { name: "Natalie", image: "/placeholder.svg?height=40&width=40", twitter: "natalie_finance" },
    ],
    likes: 156,
    comments: 37,
    howToPlay:
      "Deposit assets to earn interest or use them as collateral to borrow other assets. Monitor health factor to avoid liquidation.",
    playUrl: "https://monadlend.example.com",
    github: "https://github.com/monadlend",
    website: "https://monadlend.example.com",
  },
  {
    id: 8,
    name: "MonadPay",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Payment solution for merchants to accept crypto payments with instant settlement and low fees.",
    categories: ["Consumer", "Infrastructure"],
    event: "Mission: 2 Smart Wallet",
    award: "Winner",
    team: [
      { name: "Kevin", image: "/placeholder.svg?height=40&width=40", twitter: "kevin_pay" },
      { name: "Rachel", image: "/placeholder.svg?height=40&width=40", twitter: "rachel_crypto" },
    ],
    likes: 112,
    comments: 28,
    howToPlay:
      "Integrate the MonadPay API into your e-commerce platform or use the provided plugins for popular platforms like Shopify and WooCommerce.",
    playUrl: "https://monadpay.example.com",
    github: "https://github.com/monadpay",
    website: "https://monadpay.example.com",
  },
  {
    id: 9,
    name: "MonadVault",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Secure multi-signature wallet with advanced recovery options and spending limits.",
    categories: ["Infrastructure", "Consumer"],
    event: "Mission: 3 DeFi Integration",
    award: "Runner-up",
    team: [
      { name: "Michael", image: "/placeholder.svg?height=40&width=40", twitter: "michael_security" },
      { name: "Jennifer", image: "/placeholder.svg?height=40&width=40", twitter: "jennifer_wallet" },
    ],
    likes: 94,
    comments: 19,
    howToPlay:
      "Create a vault, add co-signers, and set up spending policies. Transactions require the specified number of signatures before execution.",
    playUrl: "https://monadvault.example.com",
    github: "https://github.com/monadvault",
    website: "https://monadvault.example.com",
  },
  {
    id: 10,
    name: "MonadStats",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Analytics dashboard for tracking on-chain metrics and project performance.",
    categories: ["Infrastructure", "DeFi"],
    event: "Hackathon",
    award: "Runner-up",
    team: [
      { name: "Andrew", image: "/placeholder.svg?height=40&width=40", twitter: "andrew_data" },
      { name: "Michelle", image: "/placeholder.svg?height=40&width=40", twitter: "michelle_analytics" },
    ],
    likes: 78,
    comments: 15,
    howToPlay:
      "Connect your wallet to view personalized analytics or explore public dashboards for various Monad ecosystem projects.",
    playUrl: "https://monadstats.example.com",
    github: "https://github.com/monadstats",
    website: "https://monadstats.example.com",
  },
]

export function ProjectTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [projectsPerPage, setProjectsPerPage] = useState(10)
  const [apiProjects, setApiProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [totalProjects, setTotalProjects] = useState(0)
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set())

  const totalPages = Math.ceil(totalProjects / projectsPerPage)

  useEffect(() => {
    loadProjects()
  }, [currentPage, projectsPerPage])

  const loadProjects = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const response = await api.getProjects({
        page: currentPage || 1,
        limit: projectsPerPage || 10,
        sortBy: 'likes',
        sortOrder: 'desc'
      })
      
      setApiProjects(response.projects)
      setTotalProjects(response.pagination.total)
    } catch (error) {
      console.error("Error loading projects:", error)
      setError(handleApiError(error))
      setApiProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async (projectId: number) => {
    try {
      const response = await api.likeProject(projectId)
      
      // Update local state
      setLikedProjects(prev => new Set([...prev, projectId]))
      
      // Update project likes count
      setApiProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, likes: response.likes }
          : project
      ))
    } catch (error) {
      console.error("Error liking project:", error)
    }
  }

  // Use API projects if loaded successfully, otherwise fall back to mock data
  const usingApiData = !isLoading && !error && apiProjects !== null
  const currentProjects = usingApiData ? apiProjects : projects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage)
  const actualTotalPages = usingApiData ? totalPages : Math.ceil(projects.length / projectsPerPage)

  const handlePageSizeChange = (value: string) => {
    const newSize = Number.parseInt(value)
    setProjectsPerPage(newSize)
    // Reset to first page when changing page size
    setCurrentPage(1)
  }

  const renderAwardBadge = (award: string) => {
    switch (award) {
      case "Winner":
        return (
          <div className="flex items-center gap-1">
            <Crown className="h-3 w-3 text-yellow-500" />
            <span className="font-medium text-yellow-500 text-xs">Winner</span>
          </div>
        )
      case "Runner-up":
        return (
          <div className="flex items-center gap-1">
            <Trophy className="h-3 w-3 text-gray-400" />
            <span className="font-medium text-gray-400 text-xs">Runner-up</span>
          </div>
        )
      case "Finalist":
        return <Badge className="bg-purple-600 text-xs px-1 py-0">Finalist</Badge>
      default:
        return <span className="text-gray-400 text-xs">{award}</span>
    }
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
            <span className="text-gray-400">Loading projects...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 max-w-md">
            <p className="text-red-400 mb-2">Failed to load projects</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <Button onClick={loadProjects} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentProjects.length === 0 && !isLoading) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md">
            <p className="text-gray-300 mb-2">No projects found</p>
            <p className="text-gray-400 text-sm">
              {usingApiData 
                ? "No projects have been approved yet. Submit your project to be the first!"
                : "No projects match your current filters. Try adjusting them or check back later."}
            </p>
            {usingApiData && (
              <p className="text-gray-500 text-xs mt-2">
                Note: Projects are shown after admin approval. Demo data is displayed when API is unavailable.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Data Source Indicator */}
      {!usingApiData && currentProjects.length > 0 && (
        <div className="mb-4 bg-blue-900/20 border border-blue-500/50 rounded-lg p-3">
          <p className="text-blue-400 text-sm">
            📊 Showing demo data - API returned no approved projects yet. Submit your project to see it here!
          </p>
        </div>
      )}
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {currentProjects.map((project) => (
          <div key={project.id} className="border border-gray-800 rounded-lg bg-gray-950 p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-800 flex-shrink-0">
                <img
                  src={project.logo || "/placeholder.svg"}
                  alt={project.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{project.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.categories.slice(0, 2).map((category) => (
                    <Badge key={category} variant="outline" className="border-purple-500/50 text-xs px-1 py-0">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0">{renderAwardBadge(project.award)}</div>
            </div>

            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>

            <div className="flex items-center justify-between mb-3">
              <div className="relative">
                <div className="flex items-center gap-4 blur-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{project.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{project.comments}</span>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white bg-gray-900/80 px-2 py-1 rounded">?</span>
                </div>
              </div>
              <div className="flex -space-x-1">
                {project.team.slice(0, 3).map((member, index) => (
                  <Avatar key={index} className="h-6 w-6 border-2 border-gray-950">
                    <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
                {project.team.length > 3 && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-950 bg-gray-800 text-xs">
                    +{project.team.length - 3}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <Info className="h-3 w-3 mr-1" />
                    Info
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-gray-800 bg-gray-950 w-[95vw] max-w-md">
                  <DialogHeader>
                    <DialogTitle>How to Play {project.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-gray-400 text-sm">{project.howToPlay}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.github && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={project.github} target="_blank" className="flex items-center gap-2">
                          <Github className="h-3 w-3" />
                          GitHub
                        </Link>
                      </Button>
                    )}
                    {project.website && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={project.website} target="_blank" className="flex items-center gap-2">
                          <ExternalLink className="h-3 w-3" />
                          Website
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`https://twitter.com/search?q=${project.name}`}
                        target="_blank"
                        className="flex items-center gap-2"
                      >
                        <Twitter className="h-3 w-3" />
                        Twitter
                      </Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button asChild size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs">
                <Link href={project.playUrl} target="_blank">
                  <PlayCircle className="h-3 w-3 mr-1" />
                  Play
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border border-gray-800">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-950 hover:bg-gray-950">
                <TableHead className="w-[200px]">Project</TableHead>
                <TableHead className="hidden lg:table-cell">Description</TableHead>
                <TableHead className="w-[120px]">Categories</TableHead>
                <TableHead className="w-[120px]">Event</TableHead>
                <TableHead className="w-[100px]">Award</TableHead>
                <TableHead className="w-[100px]">Team</TableHead>
                <TableHead className="w-[80px] text-center">Feedback</TableHead>
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProjects.map((project) => (
                <TableRow key={project.id} className="border-gray-800 hover:bg-gray-950">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 overflow-hidden rounded-lg bg-gray-800 flex-shrink-0">
                        <img
                          src={project.logo || "/placeholder.svg"}
                          alt={project.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="truncate">{project.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell max-w-xs">
                    <div className="truncate text-gray-400 text-sm">{project.description}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.categories.slice(0, 2).map((category) => (
                        <Badge key={category} variant="outline" className="border-purple-500/50 text-xs px-1 py-0">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm truncate block">{project.event}</span>
                  </TableCell>
                  <TableCell>{renderAwardBadge(project.award)}</TableCell>
                  <TableCell>
                    <div className="flex -space-x-1">
                      {project.team.slice(0, 2).map((member, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`https://twitter.com/${member.twitter}`}
                                target="_blank"
                                className="block transition-transform hover:scale-105"
                              >
                                <Avatar className="h-6 w-6 border-2 border-black">
                                  <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                                  <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
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
                      {project.team.length > 2 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-gray-800 text-xs">
                          +{project.team.length - 2}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                      <div className="flex items-center justify-center gap-1 blur-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{project.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{project.comments}</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-white bg-gray-900/80 px-2 py-1 rounded">?</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Info className="h-3 w-3" />
                            <span className="sr-only">How to play</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="border-gray-800 bg-gray-950 sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>How to Play {project.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <p className="text-gray-400">{project.howToPlay}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.github && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={project.github} target="_blank" className="flex items-center gap-2">
                                  <Github className="h-4 w-4" />
                                  GitHub
                                </Link>
                              </Button>
                            )}
                            {project.website && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={project.website} target="_blank" className="flex items-center gap-2">
                                  <ExternalLink className="h-4 w-4" />
                                  Website
                                </Link>
                              </Button>
                            )}
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`https://twitter.com/search?q=${project.name}`}
                                target="_blank"
                                className="flex items-center gap-2"
                              >
                                <Twitter className="h-4 w-4" />
                                Twitter
                              </Link>
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button asChild size="icon" className="h-6 w-6 bg-purple-600 hover:bg-purple-700">
                        <Link href={project.playUrl} target="_blank">
                          <PlayCircle className="h-3 w-3" />
                          <span className="sr-only">Play</span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Improved Pagination */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Show</span>
            <Select value={projectsPerPage.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-16 h-8 border-gray-800 bg-gray-900 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-gray-800 bg-gray-900">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-400">per page</span>
          </div>

          {/* Page Info */}
                      <div className="text-sm text-gray-400 text-center">
              {usingApiData ? (
                <>
                  Showing <span className="font-medium">{Math.min((currentPage - 1) * projectsPerPage + 1, totalProjects)}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * projectsPerPage, totalProjects)}</span> of{" "}
                  <span className="font-medium">{totalProjects}</span> projects
                </>
              ) : (
                <>
                  Showing <span className="font-medium">{(currentPage - 1) * projectsPerPage + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * projectsPerPage, projects.length)}</span> of{" "}
                  <span className="font-medium">{projects.length}</span> projects (demo data)
                </>
              )}
            </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-3 w-3" />
              <span className="sr-only">First page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-3 w-3" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="flex items-center px-3 py-1 text-sm">
              Page {currentPage} of {actualTotalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === actualTotalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-3 w-3" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(actualTotalPages)}
              disabled={currentPage === actualTotalPages}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-3 w-3" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
