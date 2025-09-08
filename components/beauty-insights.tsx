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
import topBeautyProducts from "@/app/data/top_10_products.json";


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

  const [trendData, setTrendData] = useState<any[]>([]);

  // Load JSON file -- for Audience and Geo data
  useEffect(() => {
    fetch("/extended_trend_aggregated.json")
      .then((res) => res.json())
      .then((data) => {
        setAudienceData(data.audience_breakdown);
        setGeoData(data.geo_trends);
      });
  }, []);

  // Load JSON file -- for Product Category Mapping
  useEffect(() => {
    fetch("/trend_with_loreal_mapping.json")
      .then((res) => res.json())
      .then((data) => {
        // keep only youtube trends with numeric growth rate
        const youtubeTrends = data
          .filter(
            (t: any) => t.platform === "youtube" && t.growth_rate_7d != null
          )
          .sort((a: any, b: any) => b.growth_rate_7d - a.growth_rate_7d)
          .slice(0, 6);

        setTrendData(youtubeTrends);
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      <Card className="p-6 lg:col-span-2 bg-gradient-to-br from-background via-muted/20 to-background h-[555px] flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-secondary" />
          <h3 className="font-semibold text-foreground">
            L'Oréal Brand Mapping
          </h3>
          <Badge variant="outline" className="text-xs">
            YouTube Only
          </Badge>
        </div>

        <div className="space-y-4  overflow-y-auto">
          {trendData.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border bg-muted/12"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground">{item.trend_id}</h4>
                <Badge
                  variant={
                    item.current_stage === "emerging"
                      ? "default"
                      : item.current_stage === "peak"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {item.current_stage}
                </Badge>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Growth (7d):</span>
                  <span className="text-primary">
                    +{(item.growth_rate_7d * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Best L'Oréal Product:
                  </span>
                  <span className="text-foreground">
                    {item.best_loreal_product}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best Brands:</span>
                  <span className="text-foreground">
                    {item.best_brands?.replace(/[\[\]']/g, "")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Beauty Products Mentioned */}
      <Card className="p-6 lg:col-span-2 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            Top 10 Beauty Products Mentioned
          </h3>
          <Badge variant="outline" className="text-xs">
            YouTube Only
          </Badge>
        </div>

        <div className="h-[360px] w-full">
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
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.769 0.188 70.08)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.769 0.188 70.08)" stopOpacity={1} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="product"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={11}
                  stroke="hsl(var(--foreground))"
                />
                <YAxis stroke="hsl(var(--foreground))" fontSize={11} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="mentions"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                  barSize={50}
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
