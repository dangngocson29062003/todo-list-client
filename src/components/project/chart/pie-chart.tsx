"use client";

import { Pie, PieChart, Cell, Label } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/src/components/shadcn/chart";

export function TasksChart({ stats }: { stats: any }) {
  const chartData = [
    {
      status: "done",
      tasks: stats.done,
      fill: "#10b981",
    },
    { status: "block", tasks: stats.block, fill: "#ef4444" },
    { status: "in_progress", tasks: stats.in_progress, fill: "#f97316" },
    {
      status: "todo",
      tasks: stats.todo,
      fill: "#3b82f6",
    },
  ];
  const chartConfig = {
    tasks: { label: "Tasks" },
    done: { label: "Done" },
    todo: { label: "Todo" },
    in_progress: { label: "In progress" },
    block: { label: "Blocked" },
  };

  return (
    <div className="p-4 bg-muted/50 rounded-xl border">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px] w-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="tasks"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 20}
                        className="fill-muted-foreground text-xs uppercase font-bold tracking-wider"
                      >
                        Total
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 5}
                        className="fill-foreground text-3xl font-bold"
                      >
                        42
                      </tspan>
                    </text>
                  );
                }
              }}
            />
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="status" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
