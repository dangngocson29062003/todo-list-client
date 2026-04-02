import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/shadcn/tooltip";
import { format } from "date-fns";

export default function GanttTodayMarker({
  todayOffset,
}: {
  todayOffset: number;
}) {
  return (
    <div
      className="absolute top-[calc(var(--gantt-height)*2-10px)] bottom-0 flex flex-col w-[100px] items-center z-20 select-none pointer-events-none"
      style={{
        left: todayOffset - 50,
      }}
    >
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="text-[10px] text-white font-semibold p-1 bg-red-500 rounded-sm shadow-sm cursor-help pointer-events-auto transition-transform hover:scale-105 active:scale-95">
              Today
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-red-500 border-red-600 text-white font-bold"
          >
            <p>{format(new Date(), "EEE, dd MMM yyyy")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="border-l-2 border-dashed border-red-400/80 flex-1" />
    </div>
  );
}
