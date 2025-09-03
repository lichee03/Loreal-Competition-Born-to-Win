"use client"

import { useState, useEffect } from "react"
import { getSubscriptionTier, hasAccess, type SubscriptionTier } from "@/lib/subscription"

export function useSubscription() {
  const [tier, setTier] = useState<SubscriptionTier>("free")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentTier = getSubscriptionTier()
    setTier(currentTier)
    setIsLoading(false)
  }, [])

  const checkAccess = (feature: "radar" | "lifecycle" | "demo") => {
    return hasAccess(feature)
  }

  const isPremium = tier === "premium"
  const isFree = tier === "free"

  return {
    tier,
    isPremium,
    isFree,
    isLoading,
    checkAccess,
    hasAccess: (feature: "radar" | "lifecycle" | "demo") => hasAccess(feature),
  }
}
