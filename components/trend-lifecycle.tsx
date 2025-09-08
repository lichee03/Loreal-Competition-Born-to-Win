// "use client";
// import { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Area,
//   AreaChart,
// } from "recharts";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const lifecycleData = [
//   { day: 0, mentions: 120, engagement: 85, phase: "Emerging" },
//   { day: 3, mentions: 340, engagement: 180, phase: "Emerging" },
//   { day: 7, mentions: 890, engagement: 420, phase: "Growing" },
//   { day: 10, mentions: 1560, engagement: 680, phase: "Growing" },
//   { day: 14, mentions: 2340, engagement: 920, phase: "Peak" },
//   { day: 17, mentions: 2890, engagement: 1100, phase: "Peak" },
//   { day: 21, mentions: 2650, engagement: 980, phase: "Stabilizing" },
//   { day: 24, mentions: 2100, engagement: 750, phase: "Declining" },
//   { day: 28, mentions: 1450, engagement: 520, phase: "Declining" },
//   { day: 31, mentions: 890, engagement: 340, phase: "Fading" },
// ];

// const predictiveData = [
//   {
//     trend: "#SkinCycling",
//     currentPhase: "Emerging",
//     peakIn: 14,
//     confidence: 92,
//   },
//   { trend: "#GlassSkin", currentPhase: "Peak", peakIn: 0, confidence: 98 },
//   {
//     trend: "#CleanGirl",
//     currentPhase: "Declining",
//     peakIn: -7,
//     confidence: 89,
//   },
//   { trend: "#KBeauty", currentPhase: "Growing", peakIn: 8, confidence: 85 },
// ];

// export function TrendLifecycle() {
//   const primaryColor = getComputedStyle(
//     document.documentElement
//   ).getPropertyValue("--primary");

//   const accentColor = getComputedStyle(
//     document.documentElement
//   ).getPropertyValue("--accent");

// const [predictionPlatform, setPredictionPlatform] = useState("youtube");

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//       {/* Lifecycle Chart */}
//       <Card className="p-6 bg-gradient-to-br from-background via-muted/20 to-background">
//         <div className="mb-6">
//           <h3 className="text-xl font-semibold text-foreground mb-2">
//             Trend Lifecycle: #SkinCycling
//           </h3>
//           <p className="text-sm text-muted-foreground">
//             Real-time analysis of trend momentum and engagement patterns
//           </p>
//         </div>

//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={lifecycleData}>
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="hsl(var(--border))"
//               />
//               <XAxis
//                 dataKey="day"
//                 stroke="hsl(var(--muted-foreground))"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <YAxis
//                 stroke="hsl(var(--muted-foreground))"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: primaryColor + "EE",
//                   border: "1px solid hsl(var(--border))",
//                   borderRadius: "8px",
//                 }}
//               />
//               <Area
//                 type="monotone"
//                 dataKey="mentions"
//                 stroke={primaryColor}
//                 fill={primaryColor + "33"}
//                 strokeWidth={2}
//               />
//               <Area
//                 type="monotone"
//                 dataKey="engagement"
//                 stroke={accentColor}
//                 fill={accentColor + "33"}
//                 strokeWidth={2}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="flex justify-center gap-6 mt-4">
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 rounded-full bg-primary"></div>
//             <span className="text-sm text-muted-foreground">Mentions</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 rounded-full bg-accent"></div>
//             <span className="text-sm text-muted-foreground">Engagement</span>
//           </div>
//         </div>
//       </Card>

//       {/* Predictive Analysis */}
//       <Card className="p-6 bg-gradient-to-br from-background via-muted/20 to-background">
//         <div className="mb-6">
//           <h3 className="text-xl font-semibold text-foreground mb-2">
//             AI Predictions
//           </h3>
//           <p className="text-sm text-muted-foreground">
//             Machine learning models predict optimal engagement timing
//           </p>
//           <div>
//           <Select value={predictionPlatform} onValueChange={setPredictionPlatform}>
//             <SelectTrigger className="w-32 ">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="youtube">YouTube</SelectItem>
//               <SelectItem value="twitter">Twitter</SelectItem>
//               <SelectItem value="instagram">Instagram</SelectItem>
//               <SelectItem value="tiktok">TikTok</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         </div>

//         <div className="space-y-4">
//           {predictiveData.map((item, index) => (
//             <div
//               key={index}
//               className="p-4 rounded-lg border border-border bg-muted/20"
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <h4 className="font-medium text-foreground">{item.trend}</h4>
//                 <Badge
//                   variant={
//                     item.currentPhase === "Peak" ? "default" : "secondary"
//                   }
//                   className="text-xs"
//                 >
//                   {item.currentPhase}
//                 </Badge>
//               </div>

//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="text-muted-foreground">Peak in:</span>
//                   <div className="font-medium text-foreground">
//                     {item.peakIn > 0
//                       ? `${item.peakIn} days`
//                       : item.peakIn === 0
//                       ? "Now"
//                       : `${Math.abs(item.peakIn)} days ago`}
//                   </div>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Confidence:</span>
//                   <div className="font-medium text-accent">
//                     {item.confidence}%
//                   </div>
//                 </div>
//               </div>

//               {item.peakIn > 0 && item.peakIn <= 14 && (
//                 <div className="mt-3 p-2 bg-accent/60 rounded text-xs text-primary font-medium">
//                   🎯 Sweet Spot Alert: Optimal engagement window
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </Card>
//     </div>
//   );
// }

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

// You can still keep lifecycleData for your chart
const lifecycleData = [
  { day: 0, mentions: 120, engagement: 85, phase: "Emerging" },
  { day: 3, mentions: 340, engagement: 180, phase: "Emerging" },
  { day: 7, mentions: 890, engagement: 420, phase: "Growing" },
  { day: 10, mentions: 1560, engagement: 680, phase: "Growing" },
  { day: 14, mentions: 2340, engagement: 920, phase: "Peak" },
  { day: 17, mentions: 2890, engagement: 1100, phase: "Peak" },
  { day: 21, mentions: 2650, engagement: 980, phase: "Stabilizing" },
  { day: 24, mentions: 2100, engagement: 750, phase: "Declining" },
  { day: 28, mentions: 1450, engagement: 520, phase: "Declining" },
  { day: 31, mentions: 890, engagement: 340, phase: "Fading" },
];

export function TrendLifecycle() {
  const primaryColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--primary");
  const accentColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--accent");

  const [predictionPlatform, setPredictionPlatform] = useState("youtube");
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/trend_aggregated.json");
        const data = await res.json();
        // If your JSON is an array already, use directly.
        // If it's an object, wrap it in [ ].
        setTrendData(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Failed to load trend data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Lifecycle Chart */}
      <Card className="p-6 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Trend Lifecycle: #SkinCycling
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time analysis of trend momentum and engagement patterns
          </p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lifecycleData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
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

        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">Mentions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span className="text-sm text-muted-foreground">Engagement</span>
          </div>
        </div>
      </Card>

      {/* Predictive Analysis */}
      <Card className="p-6 bg-gradient-to-br from-background via-muted/20 to-background h-[550px] flex flex-col">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            AI Predictions
          </h3>
          <p className="text-sm text-muted-foreground">
            Machine learning models predict optimal engagement timing
          </p>
          <div>
            <Select
              value={predictionPlatform}
              onValueChange={setPredictionPlatform}
            >
              <SelectTrigger className="w-32 ">
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
        </div>

        <div className="overflow-y-auto flex-1 pr-2 space-y-4">
          {trendData
            .filter((item) => item.platform === predictionPlatform)
            .map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-muted/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">
                    {item.trend_id}
                  </h4>
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
                    <span className="text-muted-foreground">Sweet Spot:</span>
                    <div className="font-medium text-foreground">
                      {item.sweet_spot_days_left > 0
                        ? `${item.sweet_spot_days_left} days left`
                        : "Expired"}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Engagement:</span>
                    <div className="font-medium text-primary">
                      {item.engagement.toLocaleString()}
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
