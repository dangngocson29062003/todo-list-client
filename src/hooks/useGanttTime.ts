// src/hooks/useGanttTime.ts
import { useMemo } from "react";
import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInMonths,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { getMonthGroups, getWeekMonthGroups } from "@/src/helpers/ganttHelper";

export function useGanttTime(
  range: { start: Date; end: Date },
  viewMode: string,
) {
  return useMemo(() => {
    const startDate = startOfDay(range.start);
    const startMonth = startOfMonth(range.start);
    const totalDays = differenceInDays(range.end, range.start) + 1;
    const firstWeekStart = startOfWeek(startDate);
    const dates = Array.from({ length: totalDays }).map((_, i) =>
      addDays(startDate, i),
    );
    const totalWeeks =
      Math.ceil(differenceInDays(range.end, firstWeekStart) / 7) + 1;
    const weeks = Array.from({ length: totalWeeks }).map((_, i) =>
      addDays(firstWeekStart, i * 7),
    );
    const totalMonthsView = differenceInMonths(range.end, startMonth) + 1;
    const months = Array.from({ length: totalMonthsView }).map((_, i) =>
      addMonths(startMonth, i),
    );

    return {
      startDate,
      startMonth,
      firstWeekStart,
      totalDays,
      dates,
      weeks,
      months,
      monthGroups: getMonthGroups(dates),
      weekMonthGroups: getWeekMonthGroups(weeks),
    };
  }, [range.start, range.end, viewMode]);
}
