"use client"

import { type ReactNode, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Crown, ArrowRight } from "lucide-react"
import Link from "next/link"
import { hasAccess, getSubscriptionTier, type SubscriptionTier } from "@/lib/subscription"

interface AccessControlProps {
  feature: "radar" | "lifecycle" | "demo"
  children: ReactNode
  fallbackTitle?: string
  fallbackDescription?: string
}

export function AccessControl({ feature, children, fallbackTitle, fallbackDescription }: AccessControlProps) {
  const [tier, setTier] = useState<SubscriptionTier>("free")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTier(getSubscriptionTier())
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="animate-pulse bg-muted/20 rounded-lg h-64" />
  }

  if (hasAccess(feature)) {
    return <>{children}</>
  }

  const featureNames = {
    radar: "Live Trend Radar",
    lifecycle: "Trend Lifecycle Prediction",
    demo: "Success Story Demos",
  }

  const featureDescriptions = {
    radar: "Real-time trend detection and analysis across social platforms",
    lifecycle: "AI-powered prediction of trend momentum and optimal timing",
    demo: "Interactive case studies showing successful trend predictions",
  }

  return (
    <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/5">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <Badge variant="outline" className="w-fit mx-auto mb-2">
          <Crown className="w-3 h-3 mr-1" />
          Premium Feature
        </Badge>
        <CardTitle className="text-xl">{fallbackTitle || featureNames[feature]}</CardTitle>
        <CardDescription className="max-w-md mx-auto">
          {fallbackDescription || featureDescriptions[feature]}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-6">
          Upgrade to Premium to unlock this powerful feature and gain full access to TrendLens intelligence.
        </p>
        <Button asChild className="pulse-glow">
          <Link href="/subscription">
            Upgrade to Premium
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
