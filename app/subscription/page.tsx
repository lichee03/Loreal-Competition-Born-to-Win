"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, ArrowLeft, Crown, Zap } from "lucide-react"
import Link from "next/link"
import { setSubscriptionTier } from "@/lib/subscription"

export default function Subscription() {
  const handleSelectPlan = (plan: "free" | "premium") => {
    setSubscriptionTier(plan)
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/signin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select the perfect tier to unlock L'Oréal's trend intelligence platform
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <Card className="border-border/50 shadow-lg relative">
            <CardHeader className="text-center pb-8">
              <div className="w-12 h-12 bg-muted/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for exploring trend insights</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Beauty Intelligence Dashboard</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Basic Trend Analytics</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">AI Chatbot Support</span>
                </div>
                <div className="flex items-center opacity-50">
                  <X className="w-5 h-5 text-muted-foreground mr-3" />
                  <span className="text-sm">Live Trend Radar</span>
                </div>
                <div className="flex items-center opacity-50">
                  <X className="w-5 h-5 text-muted-foreground mr-3" />
                  <span className="text-sm">Trend Lifecycle Prediction</span>
                </div>
                <div className="flex items-center opacity-50">
                  <X className="w-5 h-5 text-muted-foreground mr-3" />
                  <span className="text-sm">Success Story Demos</span>
                </div>
              </div>
              <Button onClick={() => handleSelectPlan("free")} variant="outline" className="w-full">
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="border-primary/50 shadow-lg relative">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
              Most Popular
            </Badge>
            <CardHeader className="text-center pb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription>Full access to trend intelligence</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Everything in Free</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Live Trend Radar</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">AI Lifecycle Prediction</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Success Story Demos</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Advanced Analytics</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Priority Support</span>
                </div>
              </div>
              <Button onClick={() => handleSelectPlan("premium")} className="w-full pulse-glow">
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          Need a custom enterprise solution?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact our sales team
          </Link>
        </div>
      </div>
    </div>
  )
}
