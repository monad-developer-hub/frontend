import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { TransactionProvider } from "@/contexts/transaction-context"
import { AnalyticsProvider } from "@/contexts/analytics-context"
import { AuthProvider } from "@/contexts/AuthContext"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Monad Developer Hub",
  description: "Discover and explore projects built by the Monad community",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AnalyticsProvider>
              <Suspense fallback={null}>
                <TransactionProvider>{children}</TransactionProvider>
              </Suspense>
            </AnalyticsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
