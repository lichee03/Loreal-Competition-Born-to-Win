"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, MapPin, Package, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const topBeautyProducts = [
  { product: "Rare Beauty Blush", mentions: 2840 },
  { product: "Fenty Beauty Foundation", mentions: 2650 },
  { product: "Charlotte Tilbury Lipstick", mentions: 2420 },
  { product: "Glossier Cloud Paint", mentions: 2180 },
  { product: "Drunk Elephant Serum", mentions: 1950 },
  { product: "The Ordinary Niacinamide", mentions: 1820 },
  { product: "Maybelline Sky High Mascara", mentions: 1680 },
  { product: "Sol de Janeiro Cream", mentions: 1540 },
  { product: "Laneige Lip Mask", mentions: 1420 },
  { product: "Glow Recipe Cleanser", mentions: 1280 },
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

// audienceInsight.tsx (or inside your existing component file)

function generateInsight(platformData: any) {
  if (!platformData) return "";

  let majoritySegment = "";
  let maxPercentage = 0;

  for (const [segment, value] of Object.entries(platformData)) {
    if ((value as number) > maxPercentage) {
      maxPercentage = value as number;
      majoritySegment = segment;
    }
  }

  return `${majoritySegment} is the dominant audience segment for this platform (${maxPercentage.toFixed(
    1
  )}%).`;
}

export function BeautyInsights() {
  const [audiencePlatform, setAudiencePlatform] = useState("youtube");
  const [geographicPlatform, setGeographicPlatform] = useState("twitter");

  const [audienceData, setAudienceData] = useState<any>(null);
  const [geoData, setGeoData] = useState<any>(null);

  // Load JSON file
  useEffect(() => {
    fetch("/extended_trend_aggregated.json")
      .then((res) => res.json())
      .then((data) => {
        setAudienceData(data.audience_breakdown);
        setGeoData(data.geo_trends);
      });
  }, []);

  if (!audienceData || !geoData) {
    return <div className="p-6">Loading insights...</div>;
  }

  // --- transform audience data into progress bar format ---
  const formatAudienceData = (platform: string) => {
    const platformData = audienceData[platform] || {};
    return Object.entries(platformData).map(([segment, value]) => ({
      segment,
      percentage: Math.round(value as number),
    }));
  };

  // --- transform geo data into list format ---
  const formatGeoData = (platform: string) => {
    const geo = geoData[platform] || {};
    return Object.entries(geo).map(([region, obj]: any) => ({
      region,
      trends: obj.active_trends,
      growth: `${obj.avg_growth}%`,
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Audience Segmentation */}
      <Card className="p-6 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              Audience Breakdown
            </h3>
          </div>
          <Select value={audiencePlatform} onValueChange={setAudiencePlatform}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(audienceData).map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {formatAudienceData(audiencePlatform).map((segment, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{segment.segment}</span>
                <span>{segment.percentage}%</span>
              </div>
              <Progress value={segment.percentage} className="h-2" />
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">🧿Insight:</strong>{" "}
            {generateInsight(audienceData[audiencePlatform])}
          </p>
        </div>
      </Card>

      {/* Geographic Distribution */}
      <Card className="p-6 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Geographic Trends</h3>
          </div>
          <Select
            value={geographicPlatform}
            onValueChange={setGeographicPlatform}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(geoData).map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {formatGeoData(geographicPlatform).map((region, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div>
                <div className="font-medium">{region.region}</div>
                <div className="text-sm text-muted-foreground">
                  {region.trends} active trends
                </div>
              </div>
              <Badge>{region.growth}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Product Category Mapping - YouTube Only */}
      <Card className="p-6 lg:col-span-2 xl:col-span-1 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-secondary" />
          <h3 className="font-semibold text-foreground">
            L'Oréal Brand Mapping
          </h3>
          <Badge variant="outline" className="text-xs">
            YouTube Only
          </Badge>
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

      <Card className="p-6 lg:col-span-2 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            Top 10 Beauty Products Mentioned
          </h3>
        </div>

        <div className="h-[300px] w-full">
          <ChartContainer
            config={{
              mentions: {
                label: "Mentions",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topBeautyProducts}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="product"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={11}
                  stroke="hsl(var(--foreground))"
                />
                <YAxis stroke="hsl(var(--foreground))" fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="mentions"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Insight:</strong> Rare Beauty
            and Fenty Beauty dominate social mentions, with skincare products
            showing strong growth in the beauty conversation.
          </p>
        </div>
      </Card>
    </div>
  );
}
