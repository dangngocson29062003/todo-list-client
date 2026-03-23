"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/components/shadcn/chart";
const timelineData = [
  { date: "2026-03-15", tasks: 5 },
  { date: "2026-03-16", tasks: 3 },
  { date: "2026-03-17", tasks: 7 },
  { date: "2026-03-18", tasks: 1 },
  { date: "2026-03-19", tasks: 0 },
];
export function ProjectProgressArea() {
  const chartConfig = {
    tasks: {
      label: "Completed Tasks",
      color: "#10b981",
    },
  };

  return (
    <div className="p-5 bg-muted/20 rounded-2xl border border-border/50 shadow-sm">
      <div className="mb-4">
        <p className="text-2xl font-bold">
          -100%{" "}
          <span className="text-xs font-normal text-emerald-500">
            from day ago
          </span>
        </p>
      </div>

      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <AreaChart data={timelineData} margin={{ left: -20, right: 10 }}>
          <defs>
            <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
          />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="tasks"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#fillTasks)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
