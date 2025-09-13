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
import trendProducts from "@/app/data/trend_100_products.json";
import trendBrands from "@/app/data/trend_100_brands.json";
import { PieChart, Pie, Cell } from "recharts";
import { Building2 } from "lucide-react";

const emergingBrandsData = [
  { name: "Glossier", value: 18, color: "#FF1744", category: "Clean Beauty" },
  {
    name: "Fenty Beauty",
    value: 16,
    color: "#D4AF37",
    category: "Inclusive Beauty",
  },
  {
    name: "Rare Beauty",
    value: 14,
    color: "#FF6B9D",
    category: "Mental Health",
  },
  {
    name: "Drunk Elephant",
    value: 12,
    color: "#FFB74D",
    category: "Skincare Science",
  },
  {
    name: "The Ordinary",
    value: 10,
    color: "#9C27B0",
    category: "Affordable Actives",
  },
  { name: "Glow Recipe", value: 8, color: "#4CAF50", category: "K-Beauty" },
  {
    name: "Summer Fridays",
    value: 7,
    color: "#FF5722",
    category: "Lifestyle Beauty",
  },
  { name: "Tower 28", value: 6, color: "#795548", category: "Sensitive Skin" },
  { name: "Ilia Beauty", value: 5, color: "#607D8B", category: "Clean Makeup" },
  {
    name: "Youth to the People",
    value: 4,
    color: "#E91E63",
    category: "Vegan Skincare",
  },
];

function generateInsight(platformData: any) {
  if (!platformData) return "";

  let majoritySegment = "";
  let maxValue = 0;

  for (const [segment, value] of Object.entries(platformData)) {
    if ((value as number) > maxValue) {
      maxValue = value as number;
      majoritySegment = segment;
    }
  }

  return `${majoritySegment} is the dominant audience segment for this platform (${(
    maxValue * 100
  ).toFixed(1)}%).`;
}

export function BeautyInsights() {
  const [audiencePlatform, setAudiencePlatform] = useState("youtube");
  const [geographicPlatform, setGeographicPlatform] = useState("twitter");

  const [audienceData, setAudienceData] = useState<any>(null);
  const [geoData, setGeoData] = useState<any>(null);

  const [trendData, setTrendData] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const top10Products = trendProducts.slice(0, 10).map((item) => ({
    product: item.product.charAt(0).toUpperCase() + item.product.slice(1),
    mentions: item.count,
  }));

  // Extract top 10 brands from JSON
  const top10Brands = trendBrands.slice(0, 10).map((b) => ({
    name: b.brand,
    value: b.count,
  }));

  const totalTop10 = top10Brands.reduce((sum, b) => sum + b.value, 0);

  // Assign colors for the pie chart
  const PIE_COLORS = [
    "#FFD600",
    "#FFB300",
    "#FF8F00",
    "#F57C00",
    "#FF6F00",
    "#FFA000",
    "#FFC107",
    "#FFF350",
    "#FFE082",
    "#FFD54F",
  ];

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
      segment: segment.replace("_", " "), // optional: prettier labels
      percentage: Math.round((value as number) * 100), // convert to %
    }));
  };

  // --- transform geo data into list format ---
  const formatGeoData = (platform: string) => {
    const geo = geoData[platform] || {};
    return Object.entries(geo).map(([region, obj]: any) => ({
      region,
      trends: obj.active_trends,
      growth: `${obj.avg_growth.toFixed(1)}%`, // keep 1 decimal
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
            <div key={index} className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground">
                  {item.trend_id.replace(/^##?/, "#")}
                </h4>
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
                  <span className="text-primary">+{item.growth_rate_7d}%</span>
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
            Leading Predicted Beauty Products
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
                data={top10Products}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="oklch(0.769 0.188 70.08)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="oklch(0.769 0.188 70.08)"
                      stopOpacity={1}
                    />
                  </linearGradient>
                </defs>

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
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                  // barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Insight:</strong> Rare Beauty
            and Fenty Beauty dominate social mentions, with skincare products
            showing strong growth in the beauty conversation.
          </p>
        </div> */}
      </Card>

      <Card className="p-6 lg:col-span-2 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            Top 10 Emerging Brands for Collaboration
          </h3>
          <Badge variant="outline" className="text-xs">
            YouTube Only
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[300px]">
            <ChartContainer
              config={{
                collaboration: {
                  label: "Collaboration Potential",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={top10Brands}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) =>
                      `${name} (${(((value ?? 0) / totalTop10) * 100).toFixed(
                        1
                      )}%)`
                    }
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    height={400}
                  >
                    {top10Brands.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                        stroke={activeIndex === index ? "#000" : "none"}
                        strokeWidth={activeIndex === index ? 2 : 0}
                        style={{
                          filter:
                            activeIndex === index
                              ? "brightness(1.1)"
                              : "brightness(1)",
                          transform:
                            activeIndex === index ? "scale(1.05)" : "scale(1)",
                          transformOrigin: "center",
                          transition: "all 0.2s ease-in-out",
                        }}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-foreground">
                              {data.name}
                            </p>
                            <p className="text-sm font-medium text-primary">
                              {data.value} mentions
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {((data.value / totalTop10) * 100).toFixed(1)}% of
                              top 10
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-foreground mb-3">Brand Share</h4>
            <div className="space-y-2 max-h-[260px] overflow-y-auto">
              {top10Brands.map((brand, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    activeIndex === index
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                      }}
                    />
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {brand.name}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs text-foreground">
                    {(((brand.value ?? 0) / totalTop10) * 100).toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Insight:</strong>{" "}
            {top10Brands[0]?.name} and {top10Brands[1]?.name} show highest
            collaboration potential based on social mentions.
          </p>
        </div>
      </Card>
    </div>
  );
}
