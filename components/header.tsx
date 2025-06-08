"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Menu } from "lucide-react"
import { RegistrationDialog } from "./registration-dialog"
import { SubmissionTracker } from "./submission-tracker"
import { useState } from "react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

interface HeaderProps {
  activeTab?: "projects" | "analyze"
}

export function Header({ activeTab }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              {/* Monad Diamond Logo */}
              {/* <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M50 10C65 10 78 23 78 38C78 45 75 51 70 55L50 90L30 55C25 51 22 45 22 38C22 23 35 10 50 10Z"
                  fill="url(#gradient)"
                />
                <path
                  d="M50 25C58 25 65 32 65 40C65 48 58 55 50 55C42 55 35 48 35 40C35 32 42 25 50 25Z"
                  fill="#000000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg> */}
              <img src="/MonadDevHub.png" alt="Monad Logo" className="h-full w-full" />
            </div>
            <span className="text-xl font-bold">Monad DevHub</span>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex gap-8">
              <li>
                <Link
                  href="/projects"
                  className={`border-b-2 pb-5 font-medium ${
                    activeTab === "projects"
                      ? "border-purple-500 text-white"
                      : "border-transparent text-gray-400 transition-colors hover:text-white"
                  }`}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/analyze"
                  className={`border-b-2 pb-5 font-medium ${
                    activeTab === "analyze"
                      ? "border-purple-500 text-white"
                      : "border-transparent text-gray-400 transition-colors hover:text-white"
                  }`}
                >
                  Analyze
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <Button onClick={() => window.open("https://docs.monad.xyz", "_blank")} variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 8h7" />
                <path d="M8 12h8" />
                <path d="M11 16h5" />
              </svg>
            </Button>

            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
            
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <SubmissionTracker />
            <RegistrationDialog />
          </div>

          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400">
            <span>Made by</span>
            <span onClick={() => window.open("https://x.com/0xkadzu", "_blank")} className="cursor-pointer font-medium text-white">
              kadzu
            </span>
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
              <img
                onClick={() => window.open("https://x.com/0xkadzu", "_blank")}
                src="/kadzu.jpeg"
                alt="kadzu"
                className="h-full w-full rounded-full cursor-pointer"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px] border-gray-800 bg-gray-950 p-0">
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden>
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8">
                      {/* Monad Diamond Logo */}
                      <svg
                        viewBox="0 0 100 100"
                        className="h-full w-full"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M50 10C65 10 78 23 78 38C78 45 75 51 70 55L50 90L30 55C25 51 22 45 22 38C22 23 35 10 50 10Z"
                          fill="url(#gradient)"
                        />
                        <path
                          d="M50 25C58 25 65 32 65 40C65 48 58 55 50 55C42 55 35 48 35 40C35 32 42 25 50 25Z"
                          fill="#000000"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#A855F7" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <span className="text-xl font-bold">Monad</span>
                  </div>
                </div>

                <nav className="p-4">
                  <ul className="space-y-4">
                    <li>
                      <Link
                        href="/projects"
                        className={`block py-2 px-4 rounded-md ${
                          activeTab === "projects"
                            ? "bg-purple-900/20 text-purple-400"
                            : "text-gray-300 hover:bg-gray-900"
                        }`}
                      >
                        Projects
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/analyze"
                        className={`block py-2 px-4 rounded-md ${
                          activeTab === "analyze"
                            ? "bg-purple-900/20 text-purple-400"
                            : "text-gray-300 hover:bg-gray-900"
                        }`}
                      >
                        Analyze
                      </Link>
                    </li>
                    <li className="pt-4 border-t border-gray-800">
                      <Link href="#" className="block py-2 px-4 rounded-md text-gray-300 hover:bg-gray-900">
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://github.com"
                        target="_blank"
                        className="block py-2 px-4 rounded-md text-gray-300 hover:bg-gray-900"
                      >
                        GitHub
                      </Link>
                    </li>
                  </ul>
                </nav>

                <div className="mt-auto p-4 border-t border-gray-800">
                  <RegistrationDialog />
                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                    <span>Made by</span>
                    <button onClick={() => window.open("https://x.com/0xkadzu", "_blank")}>
                      <span className="cursor-pointer font-medium text-white">kadzu</span>
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                        <img src="/kadzu.jpeg" alt="kadzu" className="cursor-pointer h-full w-full rounded-full" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
