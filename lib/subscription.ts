export type SubscriptionTier = "free" | "premium"

export function getSubscriptionTier(): SubscriptionTier {
  if (typeof window === "undefined") return "free"
  return (localStorage.getItem("subscriptionTier") as SubscriptionTier) || "free"
}

export function hasAccess(feature: "radar" | "lifecycle" | "demo"): boolean {
  const tier = getSubscriptionTier()

  if (tier === "premium") return true

  // Free tier restrictions
  const restrictedFeatures = ["radar", "lifecycle", "demo"]
  return !restrictedFeatures.includes(feature)
}

export function setSubscriptionTier(tier: SubscriptionTier): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("subscriptionTier", tier)
  }
}
