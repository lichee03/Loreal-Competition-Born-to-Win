"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface TrendData {
  id: string
  name: string
  stage: "emerging" | "peak" | "declining"
  audience: string
  platform: string
  growth: number
  daysToSaturation: number
  suggestedProduct: string
  x: number
  y: number
  size: number
}

const mockTrends: TrendData[] = [
  {
    id: "1",
    name: "#SkinCycling",
    stage: "emerging",
    audience: "Gen Z",
    platform: "TikTok",
    growth: 340,
    daysToSaturation: 14,
    suggestedProduct: "L'Oréal Paris Revitalift Clinical Vitamin C Serum",
    x: 30,
    y: 25,
    size: 60,
  },
  {
    id: "2",
    name: "#GlassSkin",
    stage: "peak",
    audience: "Millennials",
    platform: "Instagram",
    growth: 120,
    daysToSaturation: 3,
    suggestedProduct: "Lancôme Advanced Génifique Youth Activating Serum",
    x: 70,
    y: 40,
    size: 80,
  },
  {
    id: "3",
    name: "#CleanGirl",
    stage: "declining",
    audience: "Gen Z",
    platform: "TikTok",
    growth: -45,
    daysToSaturation: 0,
    suggestedProduct: "Maybelline Instant Age Rewind Concealer",
    x: 45,
    y: 70,
    size: 50,
  },
  {
    id: "4",
    name: "#KBeauty",
    stage: "emerging",
    audience: "All Ages",
    platform: "YouTube",
    growth: 280,
    daysToSaturation: 21,
    suggestedProduct: "YSL Beauty Pure Shots Night Reboot Resurfacing Serum",
    x: 60,
    y: 20,
    size: 65,
  },
]

export function TrendRadar() {
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null)
  const [isScanning, setIsScanning] = useState(true)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsScanning((prev) => !prev)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "emerging":
        return "bg-accent"
      case "peak":
        return "bg-primary"
      case "declining":
        return "bg-destructive"
      default:
        return "bg-muted"
    }
  }

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "emerging":
        return "Emerging"
      case "peak":
        return "Peak"
      case "declining":
        return "Declining"
      default:
        return "Unknown"
    }
  }

  const handleTrendClick = (trend: TrendData) => {
    setSelectedTrend(trend)
    setShowPopup(true)
  }

  const closePopup = () => {
    setShowPopup(false)
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Display */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-card">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Radar Background */}
              <div className="absolute inset-0 rounded-full border-2 border-border">
                <div className="absolute inset-4 rounded-full border border-border/50"></div>
                <div className="absolute inset-8 rounded-full border border-border/30"></div>
                <div className="absolute inset-12 rounded-full border border-border/20"></div>

                {/* Radar Lines */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-border/30"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border/30"></div>

                {/* Radar Sweep */}
                {isScanning && (
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="radar-sweep absolute top-1/2 left-1/2 w-1/2 h-px bg-gradient-to-r from-primary/80 to-transparent origin-left"></div>
                  </div>
                )}
              </div>

              {/* Trend Dots */}
              {mockTrends.map((trend) => (
                <button
                  key={trend.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full ${getStageColor(trend.stage)} trend-wave cursor-pointer hover:scale-110 transition-transform`}
                  style={{
                    left: `${trend.x}%`,
                    top: `${trend.y}%`,
                    width: `${trend.size}px`,
                    height: `${trend.size}px`,
                  }}
                  onClick={() => handleTrendClick(trend)}
                >
                  <span className="sr-only">{trend.name}</span>
                </button>
              ))}

              {/* Center Label */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-xs font-medium text-muted-foreground">TREND</div>
                <div className="text-xs font-medium text-muted-foreground">RADAR</div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-sm text-muted-foreground">Emerging</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">Peak</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <span className="text-sm text-muted-foreground">Declining</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Trend Details */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Trend Details</h3>
            {selectedTrend ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground">{selectedTrend.name}</h4>
                  <Badge variant="secondary" className="mt-1">
                    {getStageLabel(selectedTrend.stage)}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform:</span>
                    <span className="text-foreground">{selectedTrend.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Audience:</span>
                    <span className="text-foreground">{selectedTrend.audience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Growth:</span>
                    <span className={selectedTrend.growth > 0 ? "text-accent" : "text-destructive"}>
                      {selectedTrend.growth > 0 ? "+" : ""}
                      {selectedTrend.growth}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days to Peak:</span>
                    <span className="text-foreground">{selectedTrend.daysToSaturation}</span>
                  </div>
                </div>

                <Button size="sm" className="w-full">
                  View Full Analysis
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Click on a trend dot to view detailed insights</p>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Live Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <span className="text-sm text-muted-foreground">New trend detected: #MinimalMakeup</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">#GlassSkin reaching peak engagement</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive"></div>
                <span className="text-sm text-muted-foreground">#CleanGirl showing decline signals</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {showPopup && selectedTrend && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-card border shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Trend Analysis</h3>
                <Button variant="ghost" size="sm" onClick={closePopup}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">{selectedTrend.name}</h4>
                  <Badge variant="secondary" className={`${getStageColor(selectedTrend.stage)} text-white`}>
                    {getStageLabel(selectedTrend.stage)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Audience Driving It:</span>
                    <span className="text-sm font-semibold text-foreground">{selectedTrend.audience}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Days Before Saturation:</span>
                    <span className="text-sm font-semibold text-foreground">
                      {selectedTrend.daysToSaturation === 0 ? "Saturated" : `${selectedTrend.daysToSaturation} days`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Platform:</span>
                    <span className="text-sm font-semibold text-foreground">{selectedTrend.platform}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Growth Rate:</span>
                    <span
                      className={`text-sm font-semibold ${selectedTrend.growth > 0 ? "text-accent" : "text-destructive"}`}
                    >
                      {selectedTrend.growth > 0 ? "+" : ""}
                      {selectedTrend.growth}%
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-muted-foreground mb-2">Suggested L'Oréal Product:</h5>
                  <p className="text-sm font-semibold text-foreground bg-muted p-3 rounded-lg">
                    {selectedTrend.suggestedProduct}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Campaign Ideas
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Export Report
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
