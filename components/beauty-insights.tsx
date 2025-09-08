import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, MapPin, Package, TrendingUp } from "lucide-react";

const audienceData = [
  { segment: "Gen Z", percentage: 65, color: "bg-primary" },
  { segment: "Millennials", percentage: 28, color: "bg-accent" },
  { segment: "Gen X", percentage: 7, color: "bg-secondary" },
];

const geographicData = [
  { region: "North America", trends: 12, growth: "+23%" },
  { region: "Europe", trends: 8, growth: "+18%" },
  { region: "Asia Pacific", trends: 15, growth: "+45%" },
  { region: "Latin America", trends: 6, growth: "+31%" },
];

const productMapping = [
  {
    trend: "#SkinCycling",
    category: "Skincare",
    brands: ["CeraVe", "La Roche-Posay"],
    opportunity: "High",
    audience: "Gen Z",
  },
  {
    trend: "#GlassSkin",
    category: "Skincare",
    brands: ["Lancôme", "Kiehl's"],
    opportunity: "Medium",
    audience: "Millennials",
  },
  {
    trend: "#CleanGirl",
    category: "Makeup",
    brands: ["Maybelline", "Urban Decay"],
    opportunity: "Low",
    audience: "Gen Z",
  },
];

export function BeautyInsights() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Audience Segmentation */}
      <Card className="p-6 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Audience Breakdown</h3>
        </div>

        <div className="space-y-4">
          {audienceData.map((segment, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium">
                  {segment.segment}
                </span>
                <span className="text-muted-foreground">
                  {segment.percentage}%
                </span>
              </div>
              <Progress value={segment.percentage} className="h-2" />
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Insight:</strong> Gen Z drives
            65% of beauty trend adoption, with highest engagement on TikTok and
            Instagram Reels.
          </p>
        </div>
      </Card>

      {/* Geographic Distribution */}
      <Card className="p-6 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Geographic Trends</h3>
        </div>

        <div className="space-y-4">
          {geographicData.map((region, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-border"
            >
              <div>
                <div className="font-medium text-foreground">
                  {region.region}
                </div>
                <div className="text-sm text-muted-foreground">
                  {region.trends} active trends
                </div>
              </div>
              <Badge
                variant={
                  region.growth.startsWith("+") ? "default" : "secondary"
                }
              >
                {region.growth}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Product Category Mapping */}
      <Card className="p-6 lg:col-span-2 xl:col-span-1 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-secondary" />
          <h3 className="font-semibold text-foreground">
            L'Oréal Brand Mapping
          </h3>
        </div>

        <div className="space-y-4">
          {productMapping.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border bg-muted/30"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground">{item.trend}</h4>
                <Badge
                  variant={
                    item.opportunity === "High"
                      ? "default"
                      : item.opportunity === "Medium"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {item.opportunity}
                </Badge>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="text-foreground">{item.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Brands:</span>
                  <span className="text-foreground">
                    {item.brands.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Primary Audience:
                  </span>
                  <span className="text-foreground">{item.audience}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Competitive Intelligence */}
      <Card className="p-6 lg:col-span-2 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            Competitive Intelligence
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <h4 className="font-medium text-foreground mb-2">
              Trend Response Speed
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">L'Oréal Average:</span>
                <span className="text-foreground font-medium">5.2 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Industry Average:</span>
                <span className="text-muted-foreground">8.7 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best Competitor:</span>
                <span className="text-destructive">3.1 days</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <h4 className="font-medium text-foreground mb-2">
              Engagement Success Rate
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Early Adoption:</span>
                <span className="text-accent font-medium">78%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peak Timing:</span>
                <span className="text-accent font-medium">92%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Late Entry:</span>
                <span className="text-muted-foreground">34%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
