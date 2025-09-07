"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TrendData {
  trend_id: string;
  volume: number;
  engagement: number;
  unique_creators: number | string | null;
  current_stage: "emerging" | "peak" | "stable" | "declining";
  growth_rate_7d: number;
  acceleration: number;
  sweet_spot_days_left: number | null;
  recommended_action: string;
  platform: string;
  x: number;
  y: number;
  size: number;
}

export function TrendRadar() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("YouTube");

  // fetch JSON data
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/trend_aggregated.json");
      const data = await res.json();

      const mapped: TrendData[] = data.map((d: any) => {
        const maxRadius = 40;
        const r = Math.random() * maxRadius;
        const angle = Math.random() * 2 * Math.PI;

        return {
          ...d,
          x: 50 + r * Math.cos(angle),
          y: 50 + r * Math.sin(angle),
          size: 60,
        };
      });

      const platforms = ["YouTube", "Instagram", "Twitter", "TikTok"];
      const availableStages = ["emerging", "peak", "declining", "stable"];
      const finalTrends: TrendData[] = [];

      platforms.forEach((platform) => {
        const trendsArr = mapped.filter(
          (t) => t.platform.toLowerCase() === platform.toLowerCase()
        );

        if (!trendsArr.length) return;

        const selected: TrendData[] = [];

        // ensure at least one trend per stage
        availableStages.forEach((stage) => {
          const group = trendsArr.filter(
            (t) => t.current_stage?.toLowerCase() === stage
          );
          if (group.length > 0) {
            const top = [...group].sort(
              (a, b) => b.growth_rate_7d - a.growth_rate_7d
            )[0];
            selected.push(top);
          }
        });

        // fill up to 5
        const alreadyIds = new Set(selected.map((t) => t.trend_id));
        const rest = trendsArr
          .filter((t) => !alreadyIds.has(t.trend_id))
          .sort((a, b) => b.growth_rate_7d - a.growth_rate_7d)
          .slice(0, 5 - selected.length);

        const finalSelection = [...selected, ...rest];

        // assign coords
        const withCoords = finalSelection.map((t) => {
          const r = Math.random() * 40;
          const angle = Math.random() * 2 * Math.PI;
          return {
            ...t,
            x: Math.min(95, Math.max(5, 50 + r * Math.cos(angle))),
            y: Math.min(95, Math.max(5, 50 + r * Math.sin(angle))),
            size: 80,
          };
        });

        finalTrends.push(...withCoords);
      });

      setTrends(finalTrends);
      console.log("Final Trends", finalTrends);
    };

    fetchData();
  }, []);

  // Scanning animation toggle
  useEffect(() => {
    const interval = setInterval(() => {
      setIsScanning((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "emerging":
        return "bg-accent";
      case "peak":
        return "bg-primary";
      case "declining":
        return "bg-destructive";
      case "stable":
        return "bg-muted";
      default:
        return "bg-muted";
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "emerging":
        return "Emerging";
      case "peak":
        return "Peak";
      case "declining":
        return "Declining";
      case "stable":
        return "Stable";
      default:
        return "Unknown";
    }
  };

  const handleTrendClick = (trend: TrendData) => {
    setSelectedTrend(trend);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Display */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-card">
            <div className="flex gap-2 mb-4 justify-center">
              {["YouTube", "Instagram", "Twitter", "TikTok"].map((platform) => (
                <Button
                  key={platform}
                  size="sm"
                  variant={
                    selectedPlatform === platform ? "default" : "outline"
                  }
                  onClick={() => setSelectedPlatform(platform)}
                >
                  {platform}
                </Button>
              ))}
            </div>

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
              {trends
                .filter((t) => t.platform === selectedPlatform.toLowerCase())
                .map((trend) => (
                  <button
                    key={trend.trend_id}
                    style={{
                      left: `${trend.x}%`,
                      top: `${trend.y}%`,
                      width: `${trend.size}px`,
                      height: `${trend.size}px`,
                    }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full ${getStageColor(
                      trend.current_stage
                    )} cursor-pointer hover:scale-110 transition-transform`}
                    onClick={() => handleTrendClick(trend)}
                  />
                ))}

              {/* Center Label */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-xs font-medium text-muted-foreground">
                  TREND
                </div>
                <div className="text-xs font-medium text-muted-foreground">
                  RADAR
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6 flex-wrap">
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
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted"></div>
                <span className="text-sm text-muted-foreground">Stable</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Trend Details */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Trend Details
            </h3>
            {selectedTrend ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground">
                    {selectedTrend.trend_id}
                  </h4>
                  <Badge variant="secondary" className="mt-1">
                    {getStageLabel(selectedTrend.current_stage)}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform:</span>
                    <span className="text-foreground">
                      {selectedTrend.platform}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Audience:</span>
                    <span className="text-foreground">
                      {selectedTrend.unique_creators}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Growth:</span>
                    <span
                      className={
                        selectedTrend.growth_rate_7d > 0
                          ? "text-accent"
                          : "text-destructive"
                      }
                    >
                      {selectedTrend.growth_rate_7d > 0 ? "+" : ""}
                      {selectedTrend.growth_rate_7d}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days to Peak:</span>
                    <span className="text-foreground">
                      {selectedTrend.sweet_spot_days_left}
                    </span>
                  </div>
                </div>

                <Button size="sm" className="w-full">
                  View Full Analysis
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Click on a trend dot to view detailed insights
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Popup */}
      {showPopup && selectedTrend && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-card border shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Trend Analysis
                </h3>
                <Button variant="ghost" size="sm" onClick={closePopup}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">
                    {selectedTrend.trend_id}
                  </h4>
                  <Badge
                    variant="secondary"
                    className={`${getStageColor(
                      selectedTrend.current_stage
                    )} text-white`}
                  >
                    {getStageLabel(selectedTrend.current_stage)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      Audience Driving It:
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {selectedTrend.unique_creators}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      Days Before Saturation:
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {selectedTrend.sweet_spot_days_left === 0
                        ? "Saturated"
                        : `${selectedTrend.sweet_spot_days_left} days`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      Platform:
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {selectedTrend.platform}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      Growth Rate:
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        selectedTrend.growth_rate_7d > 0
                          ? "text-accent"
                          : "text-destructive"
                      }`}
                    >
                      {selectedTrend.growth_rate_7d > 0 ? "+" : ""}
                      {selectedTrend.growth_rate_7d}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
