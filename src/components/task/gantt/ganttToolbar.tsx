// src/components/gantt/GanttToolbar.tsx
import { Button } from "@/src/components/shadcn/button";
import { addMonths, format, startOfDay, subMonths } from "date-fns";
import { CalendarIcon, RotateCcw } from "lucide-react";
import { Calendar } from "../../shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadcn/popover";
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
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(range.start, "LLL dd, y")} -{" "}
              {format(range.end, "LLL dd, y")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={range.start}
              selected={{ from: range.start, to: range.end }}
              onSelect={(newRange) => {
                // Chỉ update khi đã chọn đủ 2 ngày
                if (newRange?.from && newRange?.to) {
                  setRange({ start: newRange.from, end: newRange.to });
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          size="icon-sm"
          className="shadow"
          onClick={() =>
            setRange({
              start: startOfDay(subMonths(new Date(), 1)),
              end: startOfDay(addMonths(new Date(), 1)),
            })
          }
        >
          <RotateCcw />
        </Button>
      </div>

      <TooltipProvider>
        <div className="flex items-center gap-2 bg-muted-foreground/10 p-1 rounded-lg">
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
