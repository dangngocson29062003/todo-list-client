"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/components/shadcn/chart";
import { CustomTooltip } from "./custom-tool-tip";

export function MemberChart({ members }: { members: any[] }) {
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const chartData = members.map((m, index) => ({
    name: m.name,
    email: m.email,
    tasks: [12, 18, 10, 15][index] || 5,
    fill: colors[index % colors.length],
  }));

  const chartConfig = {
    tasks: {
      label: "Tasks",
      color: "#3b82f6",
    },
  };

  return (
    <div className="p-4 bg-muted/20 rounded-xl border border-border/50 shadow-sm">
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <BarChart
          data={chartData}
          //   margin={{ top: 20, right: 0, left: -, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            fontSize={12}
            tickMargin={1}
          />
          <YAxis axisLine={false} tickLine={false} fontSize={12} />
          <ChartTooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            content={<CustomTooltip />}
          />
          <Bar dataKey="tasks" radius={[8, 8, 0, 0]} barSize={60}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
