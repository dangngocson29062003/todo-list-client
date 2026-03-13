// src/components/gantt/GanttToolbar.tsx
import { Button } from "@/src/components/shadcn/button";
import { subDays, addMonths, format, subMonths } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../shadcn/tooltip";
interface GanttToolbarType {
  title: string;
  viewMode: "day" | "week" | "month";
  setViewMode: (mode: "day" | "week" | "month") => void;
  range: { start: Date; end: Date };
  setRange: (range: { start: Date; end: Date }) => void;
}
export default function GanttToolbar({
  title,
  viewMode,
  setViewMode,
  range,
  setRange,
}: GanttToolbarType) {
  return (
    <div className="flex justify-between items-center gap-2 border-b p-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">From:</span>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm bg-white dark:bg-card"
            value={format(range.start, "yyyy-MM-dd")}
            onChange={(e) =>
              setRange({
                ...range,
                start: new Date(e.target.value),
              })
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">To:</span>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm bg-white dark:bg-card"
            value={format(range.end, "yyyy-MM-dd")}
            onChange={(e) =>
              setRange({
                ...range,
                end: new Date(e.target.value),
              })
            }
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setRange({
              start: subMonths(new Date(), 1),
              end: addMonths(new Date(), 1),
            })
          }
        >
          Reset
        </Button>
      </div>
      <TooltipProvider>
        <div className="flex items-center gap-2 bg-muted dark:bg-card p-1 rounded-lg">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => setViewMode("day")}
                className={`
                    transition-all duration-200 hover:bg-transparent
                    ${
                      viewMode === "day"
                        ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                        : "opacity-60 scale-95 dark:opacity-50"
                    }
                  `}
              >
                Day
              </Button>
            </TooltipTrigger>

            <TooltipContent>Day view</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => setViewMode("week")}
                className={`
                  transition-all duration-200 hover:bg-transparent
                  ${
                    viewMode === "week"
                      ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                      : "opacity-60 scale-95 dark:opacity-50"
                  }
                `}
              >
                Week
              </Button>
            </TooltipTrigger>

            <TooltipContent>Month view</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => setViewMode("month")}
                className={`
            transition-all duration-200 hover:bg-transparent
            ${
              viewMode === "month"
                ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                : "opacity-60 scale-95 dark:opacity-50"
            }
          `}
              >
                Month
              </Button>
            </TooltipTrigger>

            <TooltipContent>Month view</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
