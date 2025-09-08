import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto text-center">
        <Badge variant="secondary" className="mb-6 text-sm font-medium">
          <Zap className="w-4 h-4 mr-2" />
          Powered by Multi-Modal AI
        </Badge>

        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Predict Beauty Trends
          <span className="bg-gradient-to-br from-background via-primary/60 to-background bg-clip-text text-transparent font-bold block">
            Before They Peak
          </span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
          TrendLens analyzes hashtags, audio snippets, and visual content across
          TikTok, Instagram, Twitter and YouTube to give L'Oréal the perfect timing for
          trend engagement.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="pulse-glow bg-gradient-to-br from-background via-primary/80 to-background"
            asChild
          >
            <Link href="/signin">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg">
            Watch Success Story
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Sweet Spot Detection
            </h3>
            <p className="text-sm text-muted-foreground">
              Know exactly when to engage with trends for maximum impact
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary/90" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Lifecycle Prediction
            </h3>
            <p className="text-sm text-muted-foreground">
              AI models predict trend momentum and saturation timing
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Beauty Intelligence
            </h3>
            <p className="text-sm text-muted-foreground">
              Segment-specific insights mapped to L'Oréal product categories
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
