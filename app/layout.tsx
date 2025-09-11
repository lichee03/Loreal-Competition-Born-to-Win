import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { FloatingChatbot } from "@/components/floating-chatbot"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "TrendLens - AI-Powered Beauty Trend Detection",
  description: "Advanced trend detection platform for L'Oréal with predictive analytics and competitive intelligence",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/trendlens.png" type="image/png" />
      </head>
      <body className="antialiased">
        {children}
        <FloatingChatbot />
      </body>
    </html>
  )
}
