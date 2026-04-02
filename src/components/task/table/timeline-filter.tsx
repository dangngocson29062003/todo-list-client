"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Funnel, FunnelPlus, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Calendar } from "../../shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadcn/popover";
import { Button } from "../../shadcn/button";
import { cn } from "@/src/lib/utils";

export function TimelineFilter({ column }: { column: any }) {
  const dateValue = column.getFilterValue() as DateRange | undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors group">
          <div className="flex items-center gap-2">
            <CalendarIcon
              className={cn("size-4", dateValue && "text-blue-500")}
            />
            <p className="text-xs font-medium">
              {dateValue?.from ? (
                dateValue.to ? (
                  <>
                    {format(dateValue.from, "LLL dd")} -{" "}
                    {format(dateValue.to, "LLL dd")}
                  </>
                ) : (
                  format(dateValue.from, "LLL dd")
                )
              ) : (
                "Timeline"
              )}
            </p>
          </div>
          {dateValue ? (
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-xs cursor-pointer"
              onClick={() => column.setFilterValue(undefined)}
            >
              <X className="size-4" />
            </Button>
          ) : (
            <FunnelPlus className="size-4" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={dateValue?.from}
          selected={dateValue}
          onSelect={(range) => {
            column.setFilterValue(range);
          }}
          numberOfMonths={2}
        />
        {dateValue && (
          <div className="p-2 border-t flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8"
              onClick={() => column.setFilterValue(undefined)}
            >
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
