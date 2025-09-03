"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, CheckCircle } from "lucide-react"

const storySteps = [
  {
    id: 1,
    title: "Trend Detection",
    description: "TrendLens AI spots #SkinCycling mentions growing 340% week-over-week",
    timestamp: "Day 0",
    status: "detected",
    data: {
      mentions: 120,
      growth: "+340%",
      platforms: ["TikTok", "Instagram"],
      confidence: 89,
    },
  },
  {
    id: 2,
    title: "Audience Analysis",
    description: "AI identifies 80% Gen Z adoption with high engagement in skincare community",
    timestamp: "Day 3",
    status: "analyzing",
    data: {
      audience: "Gen Z (80%)",
      engagement: "High",
      category: "Skincare",
      sentiment: "Positive",
    },
  },
  {
    id: 3,
    title: "Sweet Spot Alert",
    description: "System predicts optimal engagement window: 10-14 days before peak saturation",
    timestamp: "Day 7",
    status: "alert",
    data: {
      peakPrediction: "14 days",
      confidence: "92%",
      recommendation: "Act Now",
      brands: ["CeraVe", "La Roche-Posay"],
    },
  },
  {
    id: 4,
    title: "L'Oréal Action",
    description: "CeraVe launches #SkinCycling content series, capturing 2.3M views in first week",
    timestamp: "Day 10",
    status: "success",
    data: {
      views: "2.3M",
      engagement: "+156%",
      brandMentions: "+89%",
      roi: "340%",
    },
  },
]

export function StorytellingDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const nextStep = () => {
    if (currentStep < storySteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setCurrentStep(0)
    }
  }

  const resetDemo = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < storySteps.length - 1) {
            return prev + 1
          } else {
            setIsPlaying(false)
            clearInterval(interval)
            return prev
          }
        })
      }, 3000)
    }
  }

  const step = storySteps[currentStep]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Story Visualization */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Success Story Timeline</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
                className="flex items-center gap-2 bg-transparent"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetDemo}
                className="flex items-center gap-2 bg-transparent"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border"></div>

            <div className="space-y-8">
              {storySteps.map((timelineStep, index) => (
                <div
                  key={timelineStep.id}
                  className={`relative flex items-start gap-4 transition-all duration-500 ${
                    index <= currentStep ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <div
                    className={`relative z-10 w-4 h-4 rounded-full border-2 ${
                      index < currentStep
                        ? "bg-accent border-accent"
                        : index === currentStep
                          ? "bg-primary border-primary animate-pulse"
                          : "bg-background border-border"
                    }`}
                  >
                    {index < currentStep && <CheckCircle className="w-3 h-3 text-white absolute -top-px -left-px" />}
                  </div>

                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {timelineStep.timestamp}
                      </Badge>
                      <h4 className="font-medium text-foreground">{timelineStep.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{timelineStep.description}</p>

                    {index === currentStep && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(timelineStep.data).map(([key, value]) => (
                          <div key={key} className="flex justify-between p-2 bg-muted/50 rounded">
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span className="text-foreground font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Current Step Details */}
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Current Step</h3>
          <div className="space-y-4">
            <div>
              <Badge className="mb-2">{step.timestamp}</Badge>
              <h4 className="font-medium text-foreground">{step.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
            </div>

            <div className="space-y-2">
              {Object.entries(step.data).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Impact Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time to Market:</span>
              <span className="text-accent font-medium">2 weeks faster</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Engagement Lift:</span>
              <span className="text-accent font-medium">+156%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ROI:</span>
              <span className="text-accent font-medium">340%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Brand Mentions:</span>
              <span className="text-accent font-medium">+89%</span>
            </div>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button onClick={nextStep} disabled={isPlaying} className="flex-1">
            Next Step
          </Button>
        </div>
      </div>
    </div>
  )
}
