import { TrendRadar } from "@/components/trend-radar"
import { TrendLifecycle } from "@/components/trend-lifecycle"
import { BeautyInsights } from "@/components/beauty-insights"
import { StorytellingDemo } from "@/components/storytelling-demo"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { AccessControl } from "@/components/access-control"

export default function Home() {
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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Success Story: #SkinCycling</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how TrendLens spotted this viral skincare trend 2 weeks before peak
            </p>
          </div>
          <AccessControl feature="demo">
            <StorytellingDemo />
          </AccessControl>
        </section>
      </main>
    </div>
  )
}
