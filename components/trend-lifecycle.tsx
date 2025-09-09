

"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { se } from "date-fns/locale";

export function TrendLifecycle() {
  const primaryColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--primary");
  const accentColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--accent");

  const [predictionPlatform, setPredictionPlatform] = useState("youtube");
  const [trendData, setTrendData] = useState<any[]>([]);
  const [timeseries, setTimeseries] = useState<any>({});
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [platformTimeseries, setPlatformTimeseries] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // predictions (aggregated)
        const resPred = await fetch("trend_aggregated.json");
        const predData = await resPred.json();
        setTrendData(Array.isArray(predData) ? predData : [predData]);
        //if wan choose top 5
//         const sortedTrends = Array.isArray(predData)
//   ? predData
//       .filter((t: any) => t.growth_rate_7d != null)
//       .sort((a: any, b: any) => b.growth_rate_7d - a.growth_rate_7d)
//   : [];
// setTrendData(sortedTrends);
        // lifecycle timeseries
        const resTs = await fetch("first5_hashtags_timeseries.json");
        const tsData = await resTs.json();
        setTimeseries(tsData);
        
        const platformsTs = await fetch("platform_timeseries.json");
        const platformsData = await platformsTs.json();
        setPlatformTimeseries(platformsData);

        // default hashtag = first one
        const first = Object.keys(tsData)[0];
        setSelectedHashtag(first);
      } catch (err) {
        console.error("Failed to load trend data:", err);
      }
    };

    fetchData();
  }, []);
  
const handlePlatformChange = (platform: string) => {
    setPredictionPlatform(platform);
    if (platform === "youtube") {
      const first = Object.keys(timeseries)[0];
      setSelectedHashtag(first);
    } else {
      const first = Object.keys(platformTimeseries[platform] || {})[0];
      setSelectedHashtag(first);
      console.log("First hashtag for", platform, ":", first);
    }
  };

  const currentTimeseries =
    predictionPlatform === "youtube"
      ? timeseries
      : platformTimeseries[predictionPlatform] || {};

    const lifecycleData = selectedHashtag
    ? currentTimeseries[selectedHashtag]?.filter((d: any) => {
      console.log("selected hashtag",selectedHashtag);
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(today.getDate() - 90);
        return new Date(d.day) >= oneMonthAgo;
      })
    : [];


  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Lifecycle Chart */}
      <Card className="p-6 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Trend Lifecycle: #{selectedHashtag}
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time analysis of trend momentum and engagement patterns
          </p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lifecycleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="day"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: primaryColor + "EE",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="mentions"
                stroke={primaryColor}
                fill={primaryColor + "33"}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="engagement"
                stroke={accentColor}
                fill={accentColor + "33"}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Predictive Analysis */}
      <Card className="p-6 bg-gradient-to-br from-background via-muted/20 to-background h-[550px] flex flex-col">
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              AI Predictions
            </h3>
            <Select
              value={predictionPlatform}
              onValueChange={handlePlatformChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Machine learning models predict optimal engagement timing
          </p>
        </div>

        <div className="overflow-y-auto flex-1 pr-2 space-y-4">
          {trendData
            .filter((item) => item.platform === predictionPlatform)
            .slice(0, 5) // first 5 predictions
            .map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border cursor-pointer"
                onClick={() =>
                  setSelectedHashtag(item.trend_id.replace("##", ""))
                }
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{item.trend_id.replace(/^##?/, "#")}</h4>
                  <Badge
                    variant={
                      item.current_stage?.toLowerCase() === "peak"
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {item.current_stage}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Peak in:</span>
                    <div className="font-medium text-foreground">
                      {item.sweet_spot_days_left > 0
                        ? `${item.sweet_spot_days_left} days`
                        : "Now"}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Engagement:</span>
                    <div className="font-medium text-primary">
                      {item.engagement?.toLocaleString()}
                    </div>
                  </div>
                </div>
                {item.sweet_spot_days_left > 0 && (
                  <div className="mt-3 p-2 bg-accent/60 rounded text-xs text-primary font-medium">
                    🎯 Sweet Spot Alert: Optimal engagement window
                  </div>
                )}

                <div className="mt-2 text-xs text-muted-foreground">
                  {item.recommended_action}
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
