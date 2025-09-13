"use client";

import { TrendRadar } from "@/components/trend-radar"
import { TrendLifecycle } from "@/components/trend-lifecycle"
import { BeautyInsights } from "@/components/beauty-insights"
import { StorytellingDemo } from "@/components/storytelling-demo"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { AccessControl } from "@/components/access-control"
import { useState ,useEffect} from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Home() {
  const [trendData, setTrendData] = useState<any[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<string>("");

  useEffect(() => {
    fetch("/trend_with_loreal_mapping.json")
      .then((res) => res.json())
      .then((data) => {
        const youtubeTrends = data
          .filter(
            (t: any) => t.platform === "youtube" && t.growth_rate_7d != null
          )
          .sort((a: any, b: any) => b.growth_rate_7d - a.growth_rate_7d)
          .slice(0, 5);
        setTrendData(youtubeTrends);
        if (youtubeTrends.length > 0) setSelectedTrend(youtubeTrends[0].trend_id);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Interactive Trend Radar */}
        <section id="radar" className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Live Trend Radar</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Watch beauty trends emerge, peak, and fade in real-time across social platforms
            </p>
          </div>
          <AccessControl feature="radar">
            <TrendRadar />
          </AccessControl>
        </section>

        {/* Trend Lifecycle Visualization */}
        <section id="lifecycle" className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Trend Lifecycle Prediction</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              AI-powered analysis of trend momentum and optimal engagement timing
            </p>
          </div>
          <AccessControl feature="lifecycle">
            <TrendLifecycle />
          </AccessControl>
        </section>

        {/* Beauty-Specific Insights */}
        <section id="insights" className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Beauty Intelligence Dashboard</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Segment-specific insights and product category mapping for L'Oréal brands
            </p>
          </div>
          <BeautyInsights />
        </section>

        {/* Storytelling Demo */}
       <section id="demo" className="py-12">
          <div className="text-center mb-8 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-4">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Success Story:
              </h2>
              <Select
                value={selectedTrend}
                onValueChange={setSelectedTrend}
              >
                <SelectTrigger className="min-w-max text-3xl font-bold text-foreground mb-4">
                  <SelectValue placeholder="Select Trend" />
                </SelectTrigger>
                
                
              
                <SelectContent>
                  {trendData.map((trend) => (
                    <SelectItem key={trend.trend_id} value={trend.trend_id}>
                      {trend.trend_id.replace(/^##?/, "#")}
                    </SelectItem>
                  ))}
                </SelectContent>
                
              </Select>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how TrendLens spotted this viral skincare trend 2 weeks before peak
            </p>
          </div>
          <AccessControl feature="demo">
            <StorytellingDemo selectedTrend={selectedTrend} />
          </AccessControl>
        </section>
      </main>
    </div>
  )
}