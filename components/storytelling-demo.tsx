"use client";

import { useState,useEffect,useMemo} from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, CheckCircle } from "lucide-react";

// Define types

interface TrendData {
  trend_id: string;
  volume: number;
  engagement: number;
  growth_rate_7d: number;
  acceleration: number;
  current_stage: string;
  platform: string;
  recommended_action: string;
  audience_signals: string | { gen_z: number; millennials: number };
  category: string | string[];
 
}

interface TimeSeriesPoint {
  day: string;
  mentions: number;
  engagement: number;
}

interface TimeSeriesData {
  [key: string]: TimeSeriesPoint[];
}

interface ImpactMetrics {
  timeToMarket: string;
  engagementLift: number;
  roi: number;
  brandMentionsLift: number;
}

function calculateImpactMetrics(
  hashtag: string,
  trendData: TrendData,
  timeSeriesData: TimeSeriesData
): ImpactMetrics {
  const series = timeSeriesData[hashtag];
  if (!series || series.length === 0) {
    return {
      timeToMarket: "N/A",
      engagementLift: 0,
      roi: 0,
      brandMentionsLift: 0,
    };
  }

  const cutoffDate = new Date(timeSeriesData[hashtag][0].day);

  const before = series.filter((d) => new Date(d.day) < cutoffDate);
  const after = series.filter((d) => new Date(d.day) >= cutoffDate);

  const avgMentionsBefore =
    before.reduce((sum, d) => sum + d.mentions, 0) / (before.length || 1);
  const avgEngagementBefore =
    before.reduce((sum, d) => sum + d.engagement, 0) / (before.length || 1);

  const mentionsAfter =
    after.reduce((sum, d) => sum + d.mentions, 0) / (after.length || 1);
  const engagementAfter =
    after.reduce((sum, d) => sum + d.engagement, 0) / (after.length || 1);

  const CengagementLift =
    ((engagementAfter - avgEngagementBefore) /
      (avgEngagementBefore || 1)) *
    100;
    
const engagementLift = Math.min(CengagementLift, 500);

  const brandMentionsLift =
    ((mentionsAfter - avgMentionsBefore) /
      (avgMentionsBefore || 1)) *
    100;

  // ROI proxy
  const valueGenerated = engagementAfter * 0.01;
  const cost = avgEngagementBefore * 0.01 || 1;
  const roi = ((valueGenerated - cost) / cost) * 100;

  return {
    timeToMarket: "2 weeks faster",
    engagementLift,
    roi,
    brandMentionsLift,
  };
}


export function StorytellingDemo({ selectedTrend }: { selectedTrend: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trendData, setTrendData] = useState<any[]>([]);
   const [timeSeries, setTimeseries] = useState({});

  useEffect(() => {
  const fetchAllData = async () => {
    try {
      // fetch trend mapping
      const resTrend = await fetch("/trend_with_loreal_mapping.json");
      const trendJson = await resTrend.json();
      setTrendData(trendJson);

      // fetch timeseries
      const resTs = await fetch("/top5_hashtags_timeseries.json");
      const tsJson = await resTs.json();
      setTimeseries(tsJson);

    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  fetchAllData();
}, []);

   // Find the selected trend object
  const trend = useMemo(
    () => trendData.find((t) => t.trend_id === selectedTrend) || {},
    [trendData, selectedTrend]
  );

  
  const impactMetrics = useMemo<ImpactMetrics>(() => {
  if (!trend.trend_id || Object.keys(timeSeries).length === 0) {
    return {
      timeToMarket: "N/A",
      engagementLift: 0,
      roi: 0,
      brandMentionsLift: 0,
    };
  }
  return calculateImpactMetrics(trend.trend_id.replace(/^##/, ""), trend, timeSeries);
}, [trend, timeSeries]);


  const storySteps = useMemo(() => {
    if (!trend || !trend.trend_id) return [];


  

    let audienceSignals = trend.audience_signals;
  if (typeof audienceSignals === "string") {
    try {
      // Remove np.float64 and convert single quotes to double quotes
      const cleaned = audienceSignals
        .replace(/np\.float64\(([\d.]+)\)/g, "$1")
        .replace(/'/g, '"');
      audienceSignals = JSON.parse(cleaned);
    } catch {
      audienceSignals = {};
    }
  }
  const genZ = audienceSignals?.gen_z ?? 0;
  const millennials = audienceSignals?.millennials ?? 0;
  const genZPercent = (genZ * 100).toFixed(0);
  const millennialsPercent = (millennials * 100).toFixed(0);

  let mainAudience = "N/A";
  if (genZ > millennials) {
    mainAudience = `Gen Z (${genZPercent}%)`;
  } else if (millennials > genZ) {
    mainAudience = `Millennials (${millennialsPercent}%)`;
  } else if (genZ > 0) {
    mainAudience = `Gen Z & Millennials (${genZPercent}%)`;
  }
const mainCategory = (() => {
  let cat = "";
  if (Array.isArray(trend.category)) {
    cat = trend.category[0];
  } else if (typeof trend.category === "string") {
    const match = trend.category.match(/'([^']+)'/);
    if (match) cat = match[1];
    else cat = trend.category.replace(/[\[\]']+/g, "").split(",")[0].trim();
  } else {
    cat = trend.category;
  }
  // Capitalize first letter
  return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : cat;
})();







    return [
      {
        id: 1,
        title: "Trend Detection",
        description: `AI spots ${trend.trend_id.replace(/^##/,"#")} growing ${trend.growth_rate_7d}% week-over-week on ${trend.platform}`,
        timestamp: "Day 0",
        status: "detected",
        data: {
          mentions: trend.volume,
          engagement: trend.engagement,
          growth: `${trend.growth_rate_7d}%`,
          acceleration: trend.acceleration,
          stage: trend.current_stage,
          platforms: trend.platform,
          // geo: Array.isArray(trend.geo) ? trend.geo.join(", ") : trend.geo,
        },
      },
      {
      id: 2,
      title: "Audience Analysis",
      description:
        genZ > 0 || millennials > 0
          ? `Audience analysis shows ${mainAudience} adoption with strong engagement in ${mainCategory} community`
          : "Audience analysis unavailable.",
      timestamp: "Day 3",
      status: "analyzing",
      data: {
        audience: mainAudience,
        category: mainCategory,
        sentiment: "Positive",
      },
    },
      {
        id: 3,
        title: "Sweet Spot Alert",
        description: `System recommends: ${trend.recommended_action}. Acceleration detected (${trend.acceleration}).`,
        timestamp: "Day 7",
        status: "alert",
        data: {
          recommendation: trend.recommended_action,
          stage: trend.current_stage,
          acceleration: trend.acceleration,
          brands: trend.best_brands?.replace(/[\[\]']/g, ""),
          suggestedProduct: `   ${trend.best_loreal_product}`,
        },
      },
      {
  id: 4,
  title: "L'Oréal Action",
  description: `L'Oréal launches campaign using ${trend.trend_id.replace(/^##/, "#")}, capturing over ${(trend.engagement / 1_000_000).toFixed(1)}M engagements, achieving ROI of ${trend.roi || "320%"} and ${trend.brandMentions || "+89%"} more brand mentions.`,
  timestamp: "Day 10",
  status: "success",
  data: {
    engagement: trend.engagement
      ? trend.engagement.toLocaleString()
      : "N/A",
    brandMentions: `${impactMetrics.brandMentionsLift.toFixed(1)}%` || "+89%",
    roi: `${impactMetrics.roi.toFixed(1)}%` || "320%",
    // views: trend.engagement
    //   ? `${(trend.engagement / 1_000_000).toFixed(1)}M`
    //   : "N/A",
  },
}
    ];
  }, [trend]);

  const nextStep = () => {
    if (currentStep < storySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < storySteps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            clearInterval(interval);
            return prev;
          }
        });
      }, 3000);
    }
  };

   if (!trend || !trend.trend_id) {
    return (
      <div className="text-center text-muted-foreground py-12">
        No data available for this trend.
      </div>
    );
  }

  const step = storySteps[currentStep];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Story Visualization */}
      <div className="lg:col-span-2">
        <Card className="p-6 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-foreground">
                Success Story Timeline
              </h3>
            <Badge variant="outline" className="text-xs">
            YouTube Only
          </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
                className="flex items-center gap-2 bg-transparent"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetDemo}
                className="flex items-center gap-2 bg-transparent"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border"></div>

            <div className="space-y-8">
              {storySteps.map((timelineStep, index) => (
                <div
                  key={timelineStep.id}
                  className={`relative flex items-start gap-4 transition-all duration-500 ${
                    index <= currentStep ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <div
                    className={`relative z-10 w-4 h-4 rounded-full border-2 ${
                      index < currentStep
                        ? "bg-accent border-accent"
                        : index === currentStep
                        ? "bg-primary border-primary animate-pulse"
                        : "bg-background border-border"
                    }`}
                  >
                    {index < currentStep && (
                      <CheckCircle className="w-3 h-3 text-white absolute -top-px -left-px" />
                    )}
                  </div>

                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {timelineStep.timestamp}
                      </Badge>
                      <h4 className="font-medium text-foreground">
                        {timelineStep.title}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {timelineStep.description}
                    </p>

                    {index === currentStep && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(timelineStep.data).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between p-2 bg-muted/50 rounded"
                            >
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </span>
                              <span className="text-foreground font-medium">
                                {value}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Current Step Details */}
      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-br from-background via-muted/20 to-background">
          <h3 className="font-semibold text-foreground mb-4">Current Step</h3>
          <div className="space-y-4">
            <div>
              <Badge className="mb-2">{step.timestamp}</Badge>
              <h4 className="font-medium text-foreground">{step.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {step.description}
              </p>
            </div>

            <div className="space-y-2">
              {Object.entries(step.data).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {impactMetrics && (
  <Card className="p-6 bg-gradient-to-br from-background via-muted/20 to-background">
    <h3 className="font-semibold text-foreground mb-4">Predicted Impact Metrics</h3>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Time to Market:</span>
        <span className="text-accent font-medium">{impactMetrics.timeToMarket}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Engagement Lift:</span>
        <span className="text-accent font-medium">{impactMetrics.engagementLift.toFixed(1)}%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">ROI:</span>
        <span className="text-accent font-medium">{impactMetrics.roi.toFixed(1)}%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Brand Mentions:</span>
        <span className="text-accent font-medium">{impactMetrics.brandMentionsLift.toFixed(1)}%</span>
      </div>
    </div>
  </Card>
)}


        <div className="flex gap-2">
          <Button onClick={nextStep} disabled={isPlaying} className="flex-1">
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
}
