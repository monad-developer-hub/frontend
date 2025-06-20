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
  generator: '-',
  metadataBase: new URL('https://devhub.kadzu.dev'),
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: "Monad Developer Hub",
    description: "Discover and explore projects built by the Monad community",
    url: 'https://devhub.kadzu.dev',
    siteName: 'Monad Developer Hub',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Monad Developer Hub - Build on Monad',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Monad Developer Hub",
    description: "Discover and explore projects built by the Monad community",
    images: ['/api/og'],
    creator: '@0xKadzu',
  },
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
