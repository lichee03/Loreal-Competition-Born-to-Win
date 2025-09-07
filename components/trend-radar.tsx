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
  unique_creators: number;
  current_stage: "emerging" | "peak" | "stable";
  growth_rate_7d: number;
  acceleration: number;
  sweet_spot_days_left: number;
  recommended_action: string;
  platform: string;
  x: number;
  y: number;
  size: number;
}

function hashToUnit(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return (h >>> 0) / 4294967295; // 0 → 1
}

export function TrendRadar() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // fetch JSON data
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/trend_aggregated.json");
      const data = await res.json();

      // Deduplicate by trend_id
      const uniqueData = data.filter(
        (item: any, idx: number, arr: any[]) =>
          idx === arr.findIndex((t) => t.trend_id === item.trend_id)
      );

      const mapped: TrendData[] = uniqueData.map((d: any, idx: number) => {
        const angle =
          (2 * Math.PI * idx) / uniqueData.length +
          hashToUnit(d.trend_id + "angle") * (Math.PI / 20);

        // base radius by stage (structured rings)
        let baseRadius = 30;
        if (d.current_stage === "emerging") baseRadius = 25;
        if (d.current_stage === "peak") baseRadius = 40;
        if (d.current_stage === "declining") baseRadius = 10;

        // jitter radius a bit so not all dots overlap
        const radius = baseRadius + hashToUnit(d.trend_id + "radius") * 5 - 2.5; // ±2.5 variation

        return {
          ...d,
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle),
          size: Math.max(8, Math.min(60, d.volume / 30)),
        };
      });

      setTrends(mapped);
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
    switch (stage) {
      case "emerging":
        return "bg-accent";
      case "peak":
        return "bg-primary";
      case "declining":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "emerging":
        return "Emerging";
      case "peak":
        return "Peak";
      case "declining":
        return "Declining";
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
              {trends.map((trend) => (
                <button
                  key={trend.trend_id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full ${getStageColor(
                    trend.current_stage
                  )} trend-wave cursor-pointer hover:scale-110 transition-transform`}
                  style={{
                    left: `${trend.x}%`,
                    top: `${trend.y}%`,
                    width: `${trend.size}px`,
                    height: `${trend.size}px`,
                  }}
                  onClick={() => handleTrendClick(trend)}
                >
                  <span className="sr-only">{trend.trend_id}</span>
                </button>
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

          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Live Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <span className="text-sm text-muted-foreground">
                  New trend detected: #MinimalMakeup
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">
                  #GlassSkin reaching peak engagement
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive"></div>
                <span className="text-sm text-muted-foreground">
                  #CleanGirl showing decline signals
                </span>
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

                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-muted-foreground mb-2">
                    Suggested L'Oréal Product:
                  </h5>
                  <p className="text-sm font-semibold text-foreground bg-muted p-3 rounded-lg">
                    {selectedTrend.platform}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Campaign Ideas
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    Export Report
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
